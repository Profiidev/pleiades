import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  url: string;
  readyState = 1;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  sent: string[] = [];
  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }
  send(data: string) {
    this.sent.push(data);
  }
  close() {
    this.readyState = this.CLOSED;
    this.onclose?.();
  }
}

const load = async () => await import('$lib/backend/updater.svelte');

beforeEach(() => {
  FakeWebSocket.instances = [];
  vi.stubGlobal('WebSocket', FakeWebSocket);
  vi.useFakeTimers();
  vi.resetModules();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('createWebsocket', () => {
  it('exposes connect, disconnect and the updater getter', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    expect(typeof ws.connect).toBe('function');
    expect(typeof ws.disconnect).toBe('function');
    // No socket opened until connect is called.
    expect(ws.updater).toBeUndefined();
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('returns independent instances with isolated state', async () => {
    const { createWebsocket } = await load();
    const a = createWebsocket();
    const b = createWebsocket();
    a.connect(() => {});
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(a.updater).toBe(FakeWebSocket.instances[0]);
    expect(b.updater).toBeUndefined();
  });
});

describe('connect', () => {
  it('opens a websocket to the default updater endpoint', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(FakeWebSocket.instances[0].url).toBe('/api/ws/updater');
  });

  it('opens a websocket to a custom path when provided', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {}, '/api/ws/custom');
    expect(FakeWebSocket.instances[0].url).toBe('/api/ws/custom');
  });

  it('exposes the live socket through the updater getter', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    expect(ws.updater).toBe(FakeWebSocket.instances[0]);
  });

  it('parses incoming messages and forwards them to the handler', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket<{ kind: string }>();
    const handler = vi.fn();
    ws.connect(handler);
    FakeWebSocket.instances[0].onmessage?.({
      data: JSON.stringify({ kind: 'ping' })
    });
    expect(handler).toHaveBeenCalledWith({ kind: 'ping' });
  });

  it('does not open a second socket while one is connected', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    ws.connect(() => {});
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('sends a heartbeat every 10 seconds while open', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    await vi.advanceTimersByTimeAsync(10_000);
    expect(FakeWebSocket.instances[0].sent).toContain('heartbeat');
  });

  it('stops the heartbeat once the socket is closed', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    const socket = FakeWebSocket.instances[0];
    socket.readyState = socket.CLOSED;
    await vi.advanceTimersByTimeAsync(10_000);
    expect(socket.sent).not.toContain('heartbeat');
  });

  it('stops the heartbeat once the socket is closing', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    const socket = FakeWebSocket.instances[0];
    socket.readyState = socket.CLOSING;
    await vi.advanceTimersByTimeAsync(10_000);
    expect(socket.sent).not.toContain('heartbeat');
  });

  it('reconnects after the socket closes unexpectedly', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    // Trigger an unexpected close (not via disconnect).
    FakeWebSocket.instances[0].onclose?.();
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('reconnects to the default endpoint, dropping the custom path', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {}, '/api/ws/custom');
    FakeWebSocket.instances[0].onclose?.();
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeWebSocket.instances).toHaveLength(2);
    expect(FakeWebSocket.instances[1].url).toBe('/api/ws/updater');
  });

  it('keeps the reconnected socket alive with heartbeats', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    FakeWebSocket.instances[0].onclose?.();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(FakeWebSocket.instances[1].sent).toContain('heartbeat');
  });
});

describe('disconnect', () => {
  it('closes the socket and prevents reconnection', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    const socket = FakeWebSocket.instances[0];
    ws.disconnect();
    expect(socket.readyState).toBe(3);
    // The close handler ran with disconnected=true, so no new socket appears.
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('clears the updater reference', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    ws.disconnect();
    expect(ws.updater).toBeUndefined();
  });

  it('stops the heartbeat after disconnecting', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    ws.connect(() => {});
    const socket = FakeWebSocket.instances[0];
    ws.disconnect();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(socket.sent).not.toContain('heartbeat');
  });

  it('is a no-op when nothing is connected', async () => {
    const { createWebsocket } = await load();
    const ws = createWebsocket();
    expect(() => ws.disconnect()).not.toThrow();
    expect(FakeWebSocket.instances).toHaveLength(0);
  });
});
