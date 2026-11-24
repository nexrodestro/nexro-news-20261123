// news-image-20261123 refresh (v2 poster) - entrypoint.
// Node 22, standard library only. Locates entry.png beside this file,
// validates it is a whole 1024x1024 PNG under 1 MiB, and stages its exact
// bytes to MAKEFUN_OUTPUT_DIR (default /output) as entry.png. No network,
// no randomness, no timestamps in the output: two runs stage identical bytes.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024;

function fail(message: string): never {
  console.error("entrypoint failed: " + message);
  process.exit(1);
}

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

const CRC_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const b of bytes) {
    crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function checkChunkCrc(bytes: Buffer, offset: number, type: string): void {
  const length = bytes.readUInt32BE(offset);
  const stored = bytes.readUInt32BE(offset + 8 + length);
  const computed = crc32(bytes.subarray(offset + 4, offset + 8 + length));
  if (stored !== computed) {
    fail(type + " chunk CRC mismatch");
  }
}

function validatePng(bytes: Buffer): void {
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("entry.png is not a PNG file");
  }
  if (bytes.readUInt32BE(12) !== 0x49484452) {
    fail("first PNG chunk is not IHDR");
  }
  checkChunkCrc(bytes, 8, "IHDR");
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== 1024 || height !== 1024) {
    fail("IHDR declares " + width + "x" + height + ", expected 1024x1024");
  }
  if (bytes.length > MAX_BYTES) {
    fail("entry.png is " + bytes.length + " bytes, over the 1 MiB limit");
  }
  const tail = bytes.subarray(bytes.length - 12);
  if (tail.indexOf(Buffer.from("IEND")) === -1) {
    fail("PNG is missing its IEND trailer");
  }
  checkChunkCrc(bytes, bytes.length - 12, "IEND");
}

function main(): void {
  const src = join(here(), "entry.png");
  if (!existsSync(src)) {
    fail("entry.png not found beside main.ts");
  }
  const bytes = readFileSync(src);
  validatePng(bytes);
  const sha = createHash("sha256").update(bytes).digest("hex");
  console.log("entry.png sha256: " + sha);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, "entry.png");
  copyFileSync(src, dest);
  const staged = readFileSync(dest);
  if (!staged.equals(bytes)) {
    fail("staged copy differs from entry.png");
  }
  console.log("staged " + staged.length + " bytes to " + dest);
}

main();
