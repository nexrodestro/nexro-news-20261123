// nexro-news-20261123 — entrypoint.
// Validates the shipped entry.png (whole PNG, 1024x1024, <=1 MiB), then
// stages its exact bytes to MAKEFUN_OUTPUT_DIR (default /output) as
// entry.png. Node 22 standard library only. No network, no randomness,
// no timestamps: both grader runs produce identical bytes by construction.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "entry.png");
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const DST = join(OUT_DIR, "entry.png");
const MAX_BYTES = 1048576;

function fail(message: string): never {
  console.error(`entry failed: ${message}`);
  process.exit(1);
}

// CRC-32 (IEEE 802.3) over a Buffer, for PNG chunk checksums.
const CRC_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table.push(c >>> 0);
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const png = readFileSync(SRC);

if (png.length > MAX_BYTES) {
  fail(`entry.png is ${png.length} bytes, over the 1 MiB limit`);
}
if (png.length < 8 || !png.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
  fail("entry.png does not start with the PNG signature");
}

// Walk every chunk: length + type + data + CRC. Each chunk's CRC must match,
// the first chunk must be IHDR declaring 1024x1024, and the file must end
// with a valid IEND chunk.
let offset = 8;
let sawIhdr = false;
let sawIend = false;
while (offset + 12 <= png.length) {
  const length = png.readUInt32BE(offset);
  const type = png.toString("ascii", offset + 4, offset + 8);
  const dataEnd = offset + 8 + length;
  if (dataEnd + 4 > png.length) fail(`chunk ${type} overruns the file`);
  const storedCrc = png.readUInt32BE(dataEnd);
  const computedCrc = crc32(Buffer.concat([png.subarray(offset + 4, offset + 8), png.subarray(offset + 8, dataEnd)]));
  if (storedCrc !== computedCrc) fail(`chunk ${type} has a bad CRC`);
  if (type === "IHDR") {
    if (sawIhdr) fail("duplicate IHDR chunk");
    sawIhdr = true;
    if (length !== 13) fail("IHDR chunk is not 13 bytes");
    const width = png.readUInt32BE(offset + 8);
    const height = png.readUInt32BE(offset + 12);
    if (width !== 1024 || height !== 1024) {
      fail(`IHDR declares ${width}x${height}, expected 1024x1024`);
    }
  }
  if (type === "IEND") {
    sawIend = true;
    if (dataEnd + 4 !== png.length) fail("trailing bytes after IEND");
    break;
  }
  offset = dataEnd + 4;
}
if (!sawIhdr) fail("no IHDR chunk found");
if (!sawIend) fail("no IEND chunk found");

const sha256 = createHash("sha256").update(png).digest("hex");

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(DST, png);

// Re-read the staged copy and verify it matches the source byte for byte
// (and by sha256) before reporting success.
const staged = readFileSync(DST);
if (!staged.equals(png)) {
  fail("staged copy does not match entry.png byte for byte");
}
const stagedSha = createHash("sha256").update(staged).digest("hex");
if (stagedSha !== sha256) {
  fail("staged copy sha256 does not match entry.png");
}

console.log(`staged entry.png: ${png.length} bytes sha256=${sha256}`);
