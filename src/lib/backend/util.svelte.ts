import { RequestError, ResponseType } from './types.svelte';

export interface RequestOptions {
  res_type?: ResponseType;
  body?: any;
  content_type?: string;
  signal?: AbortSignal;
  fetch?: typeof fetch;
}

export const patch = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'PATCH', options);

export const put = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'PUT', options);

export const delete_req = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'DELETE', options);

export const post = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'POST', options);

export const get = async <T = undefined>(
  path: string,
  options: Omit<RequestOptions, 'body'> = {}
): Promise<T | RequestError> => await request(path, 'GET', options);

// oxlint-disable-next-line complexity
export const request = async <T = undefined>(
  path: string,
  method: string,
  { res_type, body, content_type, signal, fetch }: RequestOptions = {}
): Promise<T | RequestError> => {
  const res_type_inner = res_type ?? ResponseType.None;
  let content_type_inner = content_type;
  let body_inner = body;

  if (body_inner instanceof ArrayBuffer) {
    content_type_inner = 'application/octet-stream';
  } else if (body_inner instanceof Blob) {
    content_type_inner = body_inner.type;
    body_inner = body_inner.stream();
  } else if (typeof body_inner === 'string') {
    content_type_inner = 'text/plain';
  } else if (typeof body_inner === 'object' && body_inner !== null) {
    content_type_inner = 'application/json';
    body_inner = JSON.stringify(body_inner);
  }

  const headers: HeadersInit = {};
  if (content_type_inner) {
    headers['Content-Type'] = content_type_inner;
  }

  const fetch_inner = fetch ?? globalThis.fetch;

  try {
    const res = await fetch_inner(path, {
      body: body_inner,
      headers,
      method,
      signal
    });

    switch (res.status) {
      case 200: {
        break;
      }
      case 400: {
        return RequestError.BadRequest;
      }
      case 401: {
        return RequestError.Unauthorized;
      }
      case 403: {
        return RequestError.Forbidden;
      }
      case 404: {
        return RequestError.NotFound;
      }
      case 406: {
        return RequestError.NotAcceptable;
      }
      case 408: {
        return RequestError.RequestTimeout;
      }
      case 409: {
        return RequestError.Conflict;
      }
      case 410: {
        return RequestError.Gone;
      }
      case 413: {
        return RequestError.ContentTooLarge;
      }
      case 415: {
        return RequestError.UnsupportedMediaType;
      }
      case 422: {
        return RequestError.UnprocessableEntity;
      }
      case 429: {
        return RequestError.TooManyRequests;
      }
      case 500: {
        return RequestError.InternalServerError;
      }
      case 501: {
        return RequestError.NotImplemented;
      }
      case 502: {
        return RequestError.BadGateway;
      }
      case 503: {
        return RequestError.ServiceUnavailable;
      }
      case 504: {
        return RequestError.GatewayTimeout;
      }
      case 507: {
        return RequestError.InsufficientStorage;
      }
      default: {
        return RequestError.Other;
      }
    }

    switch (res_type_inner) {
      case ResponseType.Json: {
        const json = await res.json();
        // oxlint-disable-next-line no-unsafe-type-assertion
        return json as T;
      }
      case ResponseType.Text: {
        const text = await res.text();
        // oxlint-disable-next-line no-unsafe-type-assertion
        return text as T;
      }
      case ResponseType.None: {
        // oxlint-disable-next-line no-unsafe-type-assertion
        return undefined as T;
      }
      default: {
        return RequestError.Other;
      }
    }
  } catch {
    return RequestError.Other;
  }
};
