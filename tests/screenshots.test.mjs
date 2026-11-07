import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../dist/assets/screenshots/", import.meta.url);
const captures = [
  { name: "moguri-workspace-dark", hash: "799b97195f773d39bfcc21417588847fc26e2d0d029582434ec3ec024e2dc4c4" },
  { name: "moguri-workspace-light", hash: "e610f492089731ae13dc1a7b6f5340d33bd8933f9d772420eea9f609c8c41975" },
  { name: "moguri-model-controls", hash: "f77acd962c5d39369da2987525545c4d7fc70c98dce85f00c646e741898a43f7" },
];

for (const capture of captures) {
  test(`${capture.name} preserves the actual app capture and provides uncropped responsive images`, async () => {
    const original = await readFile(new URL(`${capture.name}.png`, root));
    assert.equal(createHash("sha256").update(original).digest("hex"), capture.hash);
    assert.equal(original.readUInt32BE(16), 2880);
    assert.equal(original.readUInt32BE(20), 2000);
    for (const width of [960, 1440]) {
      const image = await readFile(new URL(`${capture.name}-${width}.png`, root));
      assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      assert.equal(image.readUInt32BE(16), width);
      assert.ok(Math.abs(image.readUInt32BE(20) - width * 2000 / 2880) <= 1);
    }
  });
}
