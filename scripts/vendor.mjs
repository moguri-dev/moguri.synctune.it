import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { canonicalPages, screenshots } from "./catalogue.mjs";

// Reads vendor/moguri/SOURCE.json and proves the synced files are unchanged and complete.
export async function readVendor(root) {
  const record = JSON.parse(await readFile(join(root, "vendor/moguri/SOURCE.json"), "utf8"));
  const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
  const expected = canonicalPages.map((page) => page.upstream).sort();
  const recorded = Object.keys(record.documents ?? {}).sort();
  if (JSON.stringify(expected) !== JSON.stringify(recorded)) {
    throw new Error("vendor/moguri/SOURCE.json doesn't match the catalogue. Run the Moguri sync (see docs/development.md).");
  }
  for (const [file, hash] of Object.entries(record.documents)) {
    if (sha256(await readFile(join(root, "vendor/moguri", file))) !== hash) {
      throw new Error(`vendor/moguri/${file} was edited after syncing. Change it in the Moguri repository and sync again.`);
    }
  }
  const shots = screenshots.flatMap((shot) => [`moguri-${shot.name}.png`, ...(shot.narrow ? [`moguri-${shot.name}-narrow.png`] : [])].map((file) => `assets/screenshots/${file}`)).sort();
  if (JSON.stringify(shots) !== JSON.stringify(Object.keys(record.screenshots?.files ?? {}).sort())) {
    throw new Error("vendor/moguri/SOURCE.json doesn't list the catalogued screenshots. Run the Moguri sync.");
  }
  for (const [file, { sha256: hash }] of Object.entries(record.screenshots.files)) {
    if (sha256(await readFile(join(root, file))) !== hash) throw new Error(`${file} doesn't match its recorded capture.`);
  }
  if (!/^[0-9a-f]{40}$/.test(record.commit) || typeof record.version !== "string") {
    throw new Error("vendor/moguri/SOURCE.json needs the source commit and version.");
  }
  return record;
}
