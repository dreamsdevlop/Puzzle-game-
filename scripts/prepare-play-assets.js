import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve('.');
const source = path.join(root, 'play-store-feature-graphic.png');
const output = path.join(root, 'Word-Quest-Feature-Graphic-1024x500.png');

await sharp(source)
  .resize(1024, 500, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(JSON.stringify({
  output,
  width: metadata.width,
  height: metadata.height,
  format: metadata.format,
  sizeBytes: fs.statSync(output).size,
}, null, 2));
