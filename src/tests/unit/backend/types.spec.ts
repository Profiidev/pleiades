import { describe, expect, it } from 'vitest';
import { RequestError, ResponseType } from '$lib/backend/types.svelte';

describe('RequestError enum', () => {
  it('maps each member to its own name', () => {
    expect(RequestError.BadRequest).toBe('BadRequest');
    expect(RequestError.Unauthorized).toBe('Unauthorized');
    expect(RequestError.Other).toBe('Other');
  });

  it('exposes every documented variant', () => {
    expect(Object.values(RequestError)).toEqual([
      'BadRequest',
      'Unauthorized',
      'Forbidden',
      'NotFound',
      'NotAcceptable',
      'RequestTimeout',
      'Conflict',
      'Gone',
      'ContentTooLarge',
      'UnsupportedMediaType',
      'UnprocessableEntity',
      'TooManyRequests',
      'InternalServerError',
      'NotImplemented',
      'BadGateway',
      'ServiceUnavailable',
      'GatewayTimeout',
      'InsufficientStorage',
      'Other'
    ]);
  });
});

describe('ResponseType enum', () => {
  it('exposes Json, Text and None', () => {
    expect(ResponseType.Json).toBe('Json');
    expect(ResponseType.Text).toBe('Text');
    expect(ResponseType.None).toBe('None');
    expect(Object.values(ResponseType)).toHaveLength(3);
  });
});
