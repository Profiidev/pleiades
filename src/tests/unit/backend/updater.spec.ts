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

describe('connectWebsocket', () => {
  it('opens a websocket to the updater endpoint', async () => {
    const { connectWebsocket } = await load();
    connectWebsocket('alice', () => {});
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(FakeWebSocket.instances[0].url).toBe('/api/ws/updater');
  });

  it('parses incoming messages and forwards them to the handler', async () => {
    const { connectWebsocket } = await load();
    const handler = vi.fn();
    connectWebsocket('bob', handler);
    FakeWebSocket.instances[0].onmessage?.({
      data: JSON.stringify({ kind: 'ping' })
    });
    expect(handler).toHaveBeenCalledWith({ kind: 'ping' }, 'bob');
  });

  it('does not open a second socket while one is connected', async () => {
    const { connectWebsocket } = await load();
    connectWebsocket('alice', () => {});
    connectWebsocket('alice', () => {});
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('sends a heartbeat every 10 seconds while open', async () => {
    const { connectWebsocket } = await load();
    connectWebsocket('alice', () => {});
    await vi.advanceTimersByTimeAsync(10_000);
    expect(FakeWebSocket.instances[0].sent).toContain('heartbeat');
  });

  it('stops the heartbeat once the socket is closed', async () => {
    const { connectWebsocket } = await load();
    connectWebsocket('alice', () => {});
    const ws = FakeWebSocket.instances[0];
    ws.readyState = ws.CLOSED;
    await vi.advanceTimersByTimeAsync(10_000);
    expect(ws.sent).not.toContain('heartbeat');
  });

  it('reconnects after the socket closes unexpectedly', async () => {
    const { connectWebsocket } = await load();
    connectWebsocket('alice', () => {});
    // Trigger an unexpected close (not via disconnectWebsocket).
    FakeWebSocket.instances[0].onclose?.();
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeWebSocket.instances).toHaveLength(2);
  });
});

describe('disconnectWebsocket', () => {
  it('closes the socket and prevents reconnection', async () => {
    const { connectWebsocket, disconnectWebsocket } = await load();
    connectWebsocket('alice', () => {});
    disconnectWebsocket();
    expect(FakeWebSocket.instances[0].readyState).toBe(3);
    // The close handler ran with disconnect=true, so no new socket appears.
    await vi.advanceTimersByTimeAsync(1000);
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('is a no-op when nothing is connected', async () => {
    const { disconnectWebsocket } = await load();
    expect(() => disconnectWebsocket()).not.toThrow();
    expect(FakeWebSocket.instances).toHaveLength(0);
  });
});
