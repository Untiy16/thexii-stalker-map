import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.join(__dirname, '..', 'src', 'styles');
const target = path.join(stylesDir, '_asset-base.scss');

const profiles = {
  default: path.join(stylesDir, '_asset-base.default.scss'),
  laravel: path.join(stylesDir, '_asset-base.laravel.scss'),
  'laravel-public': path.join(stylesDir, '_asset-base.laravel-public.scss'),
};

const profile = process.argv[2] || 'default';
const source = profiles[profile];

if (!source) {
  console.error(`Unknown asset base profile: ${profile}`);
  process.exit(1);
}

if (!fs.existsSync(source)) {
  console.error(`Asset base file not found: ${source}`);
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`Prepared asset base from ${path.basename(source)}`);
