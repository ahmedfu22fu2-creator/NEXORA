import { defineConfig } from 'vite';
import { readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

// The legacy app uses ordered classic scripts and shared globals. We minify each
// file independently rather than concatenate them and accidentally change scope/order.
function minifyLegacyScripts() {
  let outputDir;
  return {
    name: 'squad-safe-legacy-js-minifier',
    apply: 'build',
    configResolved(config) { outputDir = path.resolve(config.root, config.build.outDir); },
    async closeBundle() {
      // Keep the root service worker available at the URL expected by app.js.
      await copyFile(path.resolve('site/sw.js'), path.join(outputDir, 'sw.js'));
      const files = await walk(outputDir);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      for (const file of jsFiles) {
        const source = await readFile(file, 'utf8');
        const result = await transform(source, {
          loader: 'js',
          target: 'es2020',
          minify: true,
          legalComments: 'none',
          charset: 'utf8'
        });
        await writeFile(file, result.code, 'utf8');
      }
      console.log(`[NEXORA] Minified ${jsFiles.length} production JavaScript files (kept classic-script order and boundaries).`);
    }
  };
}

export default defineConfig({
  root: path.resolve('site'),
  base: './',
  publicDir: false,
  plugins: [minifyLegacyScripts()],
  build: {
    outDir: path.resolve('dist'),
    emptyOutDir: true,
    minify: 'esbuild',
    cssCodeSplit: false,
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: { input: path.resolve('site/index.html') }
  }
});
