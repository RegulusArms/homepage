// Scans img/gallery for images + matching .txt metadata files and writes
// img/gallery/manifest.json, which the site fetches at runtime to build
// the gallery. Run this after adding/removing/renaming files in img/gallery.
//
//   node scripts/build-gallery-manifest.js

const fs = require('fs');
const path = require('path');

const GALLERY_DIR = path.join(__dirname, '..', 'img', 'gallery');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const entries = fs.readdirSync(GALLERY_DIR);
const images = entries.filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()));

const manifest = [];
for (const image of images.sort()) {
  const base = image.slice(0, -path.extname(image).length);
  const txtPath = path.join(GALLERY_DIR, base + '.txt');
  if (!fs.existsSync(txtPath)) {
    console.warn(`skipping ${image}: no matching ${base}.txt`);
    continue;
  }
  manifest.push(image);
}

const outPath = path.join(GALLERY_DIR, 'manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`wrote ${manifest.length} image(s) to ${path.relative(process.cwd(), outPath)}`);
