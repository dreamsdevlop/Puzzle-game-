import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve('.');
const svg = fs.readFileSync(path.join(root, 'public/icon.svg'));
const densities = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

for (const [density, size] of Object.entries(densities)) {
  const outputDir = path.join(root, 'android/app/src/main/res', `mipmap-${density}`);
  await fs.promises.mkdir(outputDir, { recursive: true });
  const png = await sharp(svg).resize(size, size).png().toBuffer();
  await fs.promises.writeFile(path.join(outputDir, 'ic_launcher.png'), png);
  await fs.promises.writeFile(path.join(outputDir, 'ic_launcher_round.png'), png);
  await fs.promises.writeFile(path.join(outputDir, 'ic_launcher_foreground.png'), png);
}

console.log('Generated Android launcher icons from public/icon.svg');
