import { describe, expect, it } from 'vitest';
import * as backend from '$lib/backend/index';

describe('backend barrel', () => {
  it('re-exports the type enums', () => {
    expect(backend.RequestError.Other).toBe('Other');
    expect(backend.ResponseType.Json).toBe('Json');
  });

  it('re-exports the request helpers', () => {
    expect(typeof backend.request).toBe('function');
    expect(typeof backend.get).toBe('function');
    expect(typeof backend.post).toBe('function');
    expect(typeof backend.put).toBe('function');
    expect(typeof backend.patch).toBe('function');
    expect(typeof backend.delete_req).toBe('function');
  });

  it('re-exports the updater helpers', () => {
    expect(typeof backend.connectWebsocket).toBe('function');
    expect(typeof backend.disconnectWebsocket).toBe('function');
  });
});
