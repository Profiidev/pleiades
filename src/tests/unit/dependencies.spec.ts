import fs from 'node:fs';
import path from 'node:path';
import { builtinModules } from 'node:module';
import { describe, expect, it } from 'vitest';
import pkg from '../../../package.json' with { type: 'json' };

const libDir = path.resolve(import.meta.dirname, '../../lib');
const specifier =
  /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)['"](?<spec>[^'"]+)['"]/g;

const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(full);
    }
    return /\.(?:ts|js|svelte)$/.test(entry.name) ? [full] : [];
  });

const packageName = (spec: string): string => {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

describe('published dependencies', () => {
  // Consumers install only dependencies and peerDependencies; anything else imported here breaks their build.
  it('declares every package imported from src/lib', () => {
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {})
    ]);
    const missing = new Map<string, string>();

    for (const file of sourceFiles(libDir)) {
      const source = fs.readFileSync(file, 'utf8');
      for (const match of source.matchAll(specifier)) {
        const spec = match.groups!.spec;
        if (/^[.$/#]/.test(spec) || spec.startsWith('node:')) {
          continue;
        }
        const name = packageName(spec);
        if (!declared.has(name) && !builtinModules.includes(name)) {
          missing.set(name, path.relative(libDir, file));
        }
      }
    }

    expect(Object.fromEntries(missing)).toEqual({});
  });
});
