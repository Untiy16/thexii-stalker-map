import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist', 'stalker-map');
const baseHref = (process.argv[2] || '').replace(/\/?$/, '/');

if (!fs.existsSync(distDir)) {
  console.error(`Build output not found: ${distDir}`);
  process.exit(1);
}

if (!baseHref || baseHref === '/') {
  console.log('Root deployment detected, skipping asset URL rewrite.');
  process.exit(0);
}

const assetPrefix = `${baseHref}assets/`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function rewriteAssetUrls(content) {
  if (!content.includes('/assets/')) {
    return content;
  }

  return content
    .replace(/url\(\/assets\//g, `url(${assetPrefix}`)
    .replace(/url\("\/assets\//g, `url("${assetPrefix}`)
    .replace(/url\('\/assets\//g, `url('${assetPrefix}`)
    .replace(/"\/assets\//g, `"${assetPrefix}`)
    .replace(/'\/assets\//g, `'${assetPrefix}`);
}

let updatedFiles = 0;

for (const filePath of walk(distDir)) {
  if (!/\.(css|js)$/i.test(filePath)) {
    continue;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const updated = rewriteAssetUrls(original);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    updatedFiles++;
  }
}

console.log(`Rewrote /assets/ -> ${assetPrefix} in ${updatedFiles} file(s).`);
