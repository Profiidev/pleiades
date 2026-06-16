import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  delete_req,
  get,
  patch,
  post,
  put,
  request
} from '$lib/backend/util.svelte';
import { RequestError, ResponseType } from '$lib/backend/types.svelte';

const okResponse = (body?: unknown, status = 200) =>
  ({
    json: async () => body,
    status,
    text: async () => body
  }) as unknown as Response;

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => okResponse());
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request – body handling', () => {
  it('sends no Content-Type when there is no body', async () => {
    await request('/x', 'GET');
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBeUndefined();
    expect(init.body).toBeUndefined();
  });

  it('serialises an object body as JSON', async () => {
    await request('/x', 'POST', { body: { a: 1 } });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('sends a string body as text/plain', async () => {
    await request('/x', 'POST', { body: 'hello' });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('text/plain');
    expect(init.body).toBe('hello');
  });

  it('sends an ArrayBuffer body as octet-stream', async () => {
    const buf = new ArrayBuffer(4);
    await request('/x', 'POST', { body: buf });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('application/octet-stream');
    expect(init.body).toBe(buf);
  });

  it('sends a Blob body using its type and stream', async () => {
    const blob = new Blob(['data'], { type: 'image/png' });
    // Jsdom's Blob has no stream(); provide one so the code path can run.
    const stream = new ReadableStream();
    if (typeof blob.stream !== 'function') {
      Object.defineProperty(blob, 'stream', { value: () => stream });
    }
    await request('/x', 'POST', { body: blob });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('image/png');
    // Body becomes the blob stream
    expect(init.body).toBe(blob.stream());
  });

  it('keeps an explicit content_type when no body coercion applies', async () => {
    await request('/x', 'GET', { content_type: 'application/custom' });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('application/custom');
  });

  it('treats null body as no body (no coercion)', async () => {
    await request('/x', 'POST', { body: null });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBeUndefined();
  });

  it('passes through the abort signal', async () => {
    const controller = new AbortController();
    await request('/x', 'GET', { signal: controller.signal });
    const init = fetchMock.mock.calls[0][1];
    expect(init.signal).toBe(controller.signal);
  });

  it('uses a custom fetch when provided', async () => {
    const customFetch = vi.fn(async () => okResponse());
    await request('/x', 'GET', {
      fetch: customFetch as unknown as typeof fetch
    });
    expect(customFetch).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('request – status code mapping', () => {
  const cases: [number, RequestError | 'ok'][] = [
    [200, 'ok'],
    [400, RequestError.BadRequest],
    [401, RequestError.Unauthorized],
    [403, RequestError.Forbidden],
    [404, RequestError.NotFound],
    [406, RequestError.NotAcceptable],
    [408, RequestError.RequestTimeout],
    [409, RequestError.Conflict],
    [410, RequestError.Gone],
    [413, RequestError.ContentTooLarge],
    [415, RequestError.UnsupportedMediaType],
    [422, RequestError.UnprocessableEntity],
    [429, RequestError.TooManyRequests],
    [500, RequestError.InternalServerError],
    [501, RequestError.NotImplemented],
    [502, RequestError.BadGateway],
    [503, RequestError.ServiceUnavailable],
    [504, RequestError.GatewayTimeout],
    [507, RequestError.InsufficientStorage],
    [418, RequestError.Other],
    [302, RequestError.Other]
  ];

  it.each(cases)('maps status %i correctly', async (status, expected) => {
    fetchMock.mockResolvedValueOnce(okResponse(undefined, status));
    const res = await request('/x', 'GET');
    if (expected === 'ok') {
      expect(res).toBeUndefined();
    } else {
      expect(res).toBe(expected);
    }
  });
});

describe('request – response types', () => {
  it('parses JSON when res_type is Json', async () => {
    fetchMock.mockResolvedValueOnce(okResponse({ ok: true }));
    const res = await request('/x', 'GET', { res_type: ResponseType.Json });
    expect(res).toEqual({ ok: true });
  });

  it('returns text when res_type is Text', async () => {
    fetchMock.mockResolvedValueOnce(okResponse('plain'));
    const res = await request('/x', 'GET', { res_type: ResponseType.Text });
    expect(res).toBe('plain');
  });

  it('returns undefined when res_type is None', async () => {
    const res = await request('/x', 'GET', { res_type: ResponseType.None });
    expect(res).toBeUndefined();
  });

  it('defaults to None when res_type is omitted', async () => {
    const res = await request('/x', 'GET');
    expect(res).toBeUndefined();
  });

  it('returns Other for an unknown res_type value', async () => {
    const res = await request('/x', 'GET', {
      res_type: 'Weird' as unknown as ResponseType
    });
    expect(res).toBe(RequestError.Other);
  });
});

describe('request – network failure', () => {
  it('returns Other when fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('boom'));
    const res = await request('/x', 'GET');
    expect(res).toBe(RequestError.Other);
  });
});

describe('method helpers', () => {
  it.each([
    ['patch', patch, 'PATCH'],
    ['put', put, 'PUT'],
    ['delete_req', delete_req, 'DELETE'],
    ['post', post, 'POST'],
    ['get', get, 'GET']
  ] as const)('%s issues a %s request', async (_name, fn, method) => {
    await fn('/path');
    expect(fetchMock.mock.calls[0][0]).toBe('/path');
    expect(fetchMock.mock.calls[0][1].method).toBe(method);
  });
});
