import { describe, expect, it } from 'vitest';
import { deepCopy, isUrl } from '$lib/util/other.svelte';

describe('isUrl', () => {
  it('returns true for a valid absolute url', () => {
    expect(isUrl('https://example.com')).toBe(true);
  });

  it('returns true for other valid url schemes', () => {
    expect(isUrl('ftp://host/path')).toBe(true);
    expect(isUrl('mailto:a@b.com')).toBe(true);
  });

  it('returns false for a relative path', () => {
    expect(isUrl('/foo/bar')).toBe(false);
  });

  it('returns false for a non-url string', () => {
    expect(isUrl('not a url')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isUrl('')).toBe(false);
  });
});

describe('deepCopy', () => {
  it('clones nested objects', () => {
    const src = { a: 1, b: { c: [2, 3] } };
    const copy = deepCopy(src);
    expect(copy).toEqual(src);
    expect(copy).not.toBe(src);
    expect(copy.b).not.toBe(src.b);
  });

  it('mutating the copy does not affect the source', () => {
    const src = { list: [1, 2, 3] };
    const copy = deepCopy(src);
    copy.list.push(4);
    expect(src.list).toEqual([1, 2, 3]);
  });

  it('handles primitives', () => {
    expect(deepCopy(5)).toBe(5);
    expect(deepCopy('x')).toBe('x');
    expect(deepCopy(null)).toBe(null);
  });
});
