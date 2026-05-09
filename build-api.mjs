// Bundles api/screen.ts → functions/api/screen.js
//
// Resolves @/ path aliases so the Cloudflare Pages Function can import
// from the same source files as the Vite app. The output is a single
// self-contained ESM file with no external dependencies.

import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure output directory exists.
fs.mkdirSync(path.resolve(__dirname, 'functions/api'), { recursive: true });

await esbuild.build({
  entryPoints: [path.resolve(__dirname, 'api/screen.ts')],
  bundle: true,
  outfile: path.resolve(__dirname, 'functions/api/screen.js'),
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  minify: false, // keep readable for debugging
  plugins: [
    {
      name: 'resolve-at-alias',
      setup(build) {
        // Map @/foo → ./src/foo, resolving .ts extension
        build.onResolve({ filter: /^@\// }, (args) => {
          const bare = path.resolve(__dirname, 'src', args.path.slice(2));
          // Try .ts, then .tsx, then bare (directory index)
          for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '']) {
            const candidate = bare + ext;
            if (fs.existsSync(candidate)) {
              return { path: candidate };
            }
          }
          return { path: bare };
        });
      },
    },
  ],
});

const stats = fs.statSync(path.resolve(__dirname, 'functions/api/screen.js'));
console.log(`  api/screen.ts → functions/api/screen.js (${(stats.size / 1024).toFixed(1)} KB)`);
