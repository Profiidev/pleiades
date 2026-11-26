import { describe, expect, it } from 'vitest';
import { dummy } from '#lib/index.js';

describe('lib index barrel', () => {
  it('exports the dummy placeholder', () => {
    expect(dummy).toBe(0);
  });
});
