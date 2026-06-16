import { describe, expect, it } from 'vitest';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer
} from '$lib/util/convert.svelte';

describe('arrayBufferToBase64', () => {
  it('encodes an empty buffer to an empty string', () => {
    expect(arrayBufferToBase64(new ArrayBuffer(0))).toBe('');
  });

  it('encodes bytes to base64', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    expect(arrayBufferToBase64(bytes.buffer)).toBe(btoa('Hello'));
  });

  it('handles full byte range including high values', () => {
    const bytes = new Uint8Array([0, 127, 255]);
    expect(arrayBufferToBase64(bytes.buffer)).toBe(
      btoa(String.fromCharCode(0, 127, 255))
    );
  });
});

describe('base64ToArrayBuffer', () => {
  it('decodes an empty string to an empty buffer', () => {
    const buf = base64ToArrayBuffer('');
    expect(buf.byteLength).toBe(0);
  });

  it('decodes base64 back to the original bytes', () => {
    const buf = base64ToArrayBuffer(btoa('Hello'));
    expect([...new Uint8Array(buf)]).toEqual([72, 101, 108, 108, 111]);
  });
});

describe('round trip', () => {
  it('arrayBufferToBase64 -> base64ToArrayBuffer is identity', () => {
    const original = new Uint8Array([1, 2, 3, 250, 251, 0, 255]);
    const restored = new Uint8Array(
      base64ToArrayBuffer(arrayBufferToBase64(original.buffer))
    );
    expect([...restored]).toEqual([...original]);
  });
});
