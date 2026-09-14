import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve('.');
const icon = fs.readFileSync(path.join(root, 'public/icon.svg'), 'utf8');
const escapedIcon = icon.replace(/<\?xml[^>]*>/g, '');
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f2461"/>
      <stop offset="0.5" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#4338ca"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <circle cx="540" cy="820" r="620" fill="url(#glow)"/>
  <g transform="translate(284 500) scale(1.0)">${escapedIcon}</g>
  <text x="540" y="1235" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="800" fill="#ffffff">Word Quest</text>
  <text x="540" y="1315" text-anchor="middle" font-family="sans-serif" font-size="38" font-weight="600" fill="#dbeafe">Brain Search</text>
  <text x="540" y="1760" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="500" fill="#bfdbfe">Train your focus • Find your quest</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(
  path.join(root, 'android/app/src/main/res/drawable/splash.png'),
);
console.log('Generated branded Word Quest splash screen');
