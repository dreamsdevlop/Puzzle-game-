import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve('.');
const source = fs.readFileSync(path.join(root, 'public/icon.svg'));
const output = path.join(root, 'Word-Quest-Play-Icon-512.png');

await sharp(source)
  .resize(512, 512, { fit: 'fill' })
  .ensureAlpha()
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toColourspace('srgb')
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(JSON.stringify({
  output,
  width: metadata.width,
  height: metadata.height,
  format: metadata.format,
  channels: metadata.channels,
  sizeBytes: fs.statSync(output).size,
}, null, 2));
