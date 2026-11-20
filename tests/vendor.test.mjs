import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { canonicalPages, screenshots } from "../scripts/catalogue.mjs";
import { readVendor } from "../scripts/vendor.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));

test("synced Moguri documents and screenshots match their recorded source", async () => {
  const record = await readVendor(root);
  assert.equal(record.repository, "mbianchidev/moguri");
  assert.match(record.commit, /^[0-9a-f]{40}$/);
  assert.deepEqual(Object.keys(record.documents).sort(), canonicalPages.map((page) => page.upstream).sort());
  assert.equal(record.screenshots.fixtures, "generated");
  for (const shot of screenshots) {
    for (const [suffix, width] of [["", 1280], ...(shot.narrow ? [["-narrow", 760]] : [])]) {
      const file = `assets/screenshots/moguri-${shot.name}${suffix}.png`;
      const bytes = await readFile(join(root, file));
      assert.deepEqual(bytes.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), file);
      assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [width, 800], file);
      assert.deepEqual([record.screenshots.files[file].width, record.screenshots.files[file].height], [width, 800], file);
    }
    assert.ok(shot.alt.length > 60, `${shot.name} needs descriptive alt text`);
  }
});

test("edited synced documents or screenshots fail the integrity check", async () => {
  const copy = await mkdtemp(join(tmpdir(), "moguri-vendor-"));
  try {
    await cp(join(root, "vendor"), join(copy, "vendor"), { recursive: true });
    await cp(join(root, "assets/screenshots"), join(copy, "assets/screenshots"), { recursive: true });
    await readVendor(copy);
    const file = join(copy, "vendor/moguri/docs/installation.md");
    const original = await readFile(file);
    await writeFile(file, `${original}\nAn unreviewed local edit.\n`);
    await assert.rejects(readVendor(copy), /installation\.md was edited/);
    await writeFile(file, original);
    await writeFile(join(copy, "assets/screenshots/moguri-settings.png"), "not a capture");
    await assert.rejects(readVendor(copy), /moguri-settings\.png doesn't match/);
  } finally {
    await rm(copy, { recursive: true, force: true });
  }
});
