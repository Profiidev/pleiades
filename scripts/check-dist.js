import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// svelte-package must rewrite every `$lib` import to a relative path; consumers cannot resolve `$lib`.
// shortcut: only checks `$lib`. When moving to SvelteKit 3 / @sveltejs/package 3, either keep `$lib`
// via a top-level `alias` in svelte.config.js (this check stays valid), or switch to package.json
// `#` imports and extend `libImport` to the new `#` prefixes (otherwise this check passes blindly).
const distPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../dist'
);
const libImport = /(?:from\s*|import\s*\(\s*|import\s+)['"]\$lib[/'"]/;

const broken = fs
  .readdirSync(distPath, { recursive: true })
  .filter((file) => /\.(?:js|ts|svelte)$/.test(file))
  .filter((file) =>
    libImport.test(fs.readFileSync(path.join(distPath, file), 'utf8'))
  );

if (broken.length > 0) {
  console.error(`dist still imports $lib in ${broken.length} files, e.g.:`);
  for (const file of broken.slice(0, 10)) {
    console.error(`  dist/${file}`);
  }
  process.exit(1);
}
console.log('dist has no unresolved $lib imports');
