import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve('.');
const icon = fs.readFileSync(path.join(root, 'public/icon.svg'), 'utf8').replace(/<\?xml[^>]*>/g, '');

const assets = {
  'drawable-port-mdpi': [320, 480],
  'drawable-port-hdpi': [480, 800],
  'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [960, 1600],
  'drawable-port-xxxhdpi': [1280, 1920],
  'drawable-land-mdpi': [480, 320],
  'drawable-land-hdpi': [800, 480],
  'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1600, 960],
  'drawable-land-xxxhdpi': [1920, 1280],
  drawable: [1080, 1920],
};

function makeSvg(width, height) {
  const portrait = height >= width;
  const logoSize = portrait ? Math.round(Math.min(width, height) * 0.38) : Math.round(Math.min(width, height) * 0.52);
  const logoX = Math.round((width - logoSize) / 2);
  const logoY = portrait ? Math.round(height * 0.25) : Math.round((height - logoSize) / 2 - height * 0.06);
  const titleY = portrait ? Math.round(height * 0.66) : Math.round(height * 0.78);
  const subtitleY = titleY + Math.round(Math.min(width, height) * 0.075);
  const titleSize = Math.max(22, Math.round(Math.min(width, height) * (portrait ? 0.075 : 0.08)));
  const subtitleSize = Math.max(14, Math.round(titleSize * 0.52));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f2461"/><stop offset="0.5" stop-color="#2563eb"/><stop offset="1" stop-color="#4338ca"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/><ellipse cx="${width / 2}" cy="${height * 0.45}" rx="${width * 0.7}" ry="${height * 0.32}" fill="url(#glow)"/>
  <g transform="translate(${logoX} ${logoY}) scale(${logoSize / 512})">${icon}</g>
  <text x="${width / 2}" y="${titleY}" text-anchor="middle" font-family="sans-serif" font-size="${titleSize}" font-weight="800" fill="#ffffff">Word Quest</text>
  <text x="${width / 2}" y="${subtitleY}" text-anchor="middle" font-family="sans-serif" font-size="${subtitleSize}" font-weight="600" fill="#dbeafe">Brain Search</text>
</svg>`;
}

for (const [folder, [width, height]] of Object.entries(assets)) {
  const outputDir = path.join(root, 'android/app/src/main/res', folder);
  await fs.promises.mkdir(outputDir, { recursive: true });
  await sharp(Buffer.from(makeSvg(width, height))).png().toFile(path.join(outputDir, 'splash.png'));
}

console.log(`Generated ${Object.keys(assets).length} branded Word Quest splash assets`);
