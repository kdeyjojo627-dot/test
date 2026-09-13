import fs from 'node:fs';
import zlib from 'node:zlib';

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makePng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = Buffer.concat([
    Buffer.from('IHDR'),
    ihdrData
  ]);
  const ihdrCrc = Buffer.alloc(4);
  ihdrCrc.writeUInt32BE(crc32(ihdrChunk), 0);
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);

  // IDAT
  const idatChunk = Buffer.concat([
    Buffer.from('IDAT'),
    compressed
  ]);
  const idatCrc = Buffer.alloc(4);
  idatCrc.writeUInt32BE(crc32(idatChunk), 0);
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(compressed.length, 0);

  // IEND
  const iendChunk = Buffer.from('IEND');
  const iendCrc = Buffer.alloc(4);
  iendCrc.writeUInt32BE(crc32(iendChunk), 0);
  const iendLength = Buffer.alloc(4);
  iendLength.writeUInt32BE(0, 0);

  return Buffer.concat([
    signature,
    ihdrLength, ihdrChunk, ihdrCrc,
    idatLength, idatChunk, idatCrc,
    iendLength, iendChunk, iendCrc
  ]);
}

// Generate icon pixel function
function getIconPixel(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Background gradient: gold-red to emerald
  // from #ff416c to #f5af19 to #38ef7d
  const gradT = (nx + ny) / 2;
  let bgR = 255, bgG = 65, bgB = 108;
  if (gradT < 0.5) {
    const t = gradT / 0.5;
    bgR = Math.round(255 * (1 - t) + 245 * t);
    bgG = Math.round(65 * (1 - t) + 175 * t);
    bgB = Math.round(108 * (1 - t) + 25 * t);
  } else {
    const t = (gradT - 0.5) / 0.5;
    bgR = Math.round(245 * (1 - t) + 56 * t);
    bgG = Math.round(175 * (1 - t) + 239 * t);
    bgB = Math.round(25 * (1 - t) + 125 * t);
  }

  // Rounded rectangle bounds
  const cx = w / 2;
  const cy = h / 2;
  const rad = isMaskable ? 0 : w * 0.22;

  // For non-maskable, transparent corners
  if (!isMaskable) {
    const dx = Math.max(Math.abs(x - cx) - (cx - rad), 0);
    const dy = Math.max(Math.abs(y - cy) - (cy - rad), 0);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > rad) {
      return [0, 0, 0, 0]; // Transparent
    }
  }

  // Inner card
  const innerMargin = isMaskable ? w * 0.16 : w * 0.1;
  const inW = w - innerMargin * 2;
  const inH = h - innerMargin * 2;
  const inRad = w * 0.15;
  const idx = Math.max(Math.abs(x - cx) - (inW / 2 - inRad), 0);
  const idy = Math.max(Math.abs(y - cy) - (inH / 2 - inRad), 0);
  const inDist = Math.sqrt(idx * idx + idy * idy);

  if (inDist <= inRad) {
    // Border check
    if (inDist > inRad - (w * 0.02) || 
        Math.abs(x - cx) > (inW / 2 - w * 0.02) || 
        Math.abs(y - cy) > (inH / 2 - w * 0.02)) {
      // Golden border #fbd786
      return [251, 215, 134, 255];
    }
    
    // Inside badge area: white glassmorphism
    // Center VIP star / badge emblem
    const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (distFromCenter < w * 0.2) {
      // Red emblem center
      return [211, 47, 47, 255];
    }
    return [255, 255, 255, 240];
  }

  return [bgR, bgG, bgB, 255];
}

// Generate files
const sizes = [
  { file: 'public/pwa-192x192.png', size: 192, maskable: false },
  { file: 'public/pwa-512x512.png', size: 512, maskable: false },
  { file: 'public/pwa-maskable-512x512.png', size: 512, maskable: true },
  { file: 'public/apple-touch-icon.png', size: 180, maskable: false },
  { file: 'public/favicon.png', size: 64, maskable: false }
];

for (const s of sizes) {
  const buf = makePng(s.size, s.size, (x, y, w, h) => getIconPixel(x, y, w, h, s.maskable));
  fs.writeFileSync(s.file, buf);
  console.log(`Generated ${s.file} (${s.size}x${s.size})`);
}
