// Copies Moguri's canonical documents and design captures into this repository, unchanged.
// Usage: node scripts/sync-moguri.mjs --source /path/to/moguri --captures /path/to/captures
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalPages, moguri, screenshots } from "./catalogue.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const usage = "Usage: node scripts/sync-moguri.mjs --source /absolute/moguri/checkout --captures /absolute/capture/directory";
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const git = (source, ...args) => execFileSync("git", ["-C", source, ...args], { encoding: "utf8" }).trim();

function options(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    if (!["--source", "--captures"].includes(key) || !argv[index + 1]) throw new Error(usage);
    values[key.slice(2)] = argv[index + 1];
  }
  for (const key of ["source", "captures"]) {
    if (!values[key] || !isAbsolute(values[key])) throw new Error(`${usage}\nMissing or relative --${key}.`);
  }
  return values;
}

function pngSize(bytes, file) {
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error(`${file} is not a PNG.`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const staged = [];
try {
  const { source, captures } = options(process.argv.slice(2));
  const commit = git(source, "rev-parse", "HEAD");
  const ref = git(source, "rev-parse", "--abbrev-ref", "HEAD");
  const files = canonicalPages.map((page) => page.upstream);
  const dirty = git(source, "status", "--porcelain", "--", ...files, "package.json");
  if (dirty) throw new Error(`The source checkout has uncommitted changes to synced files:\n${dirty}`);
  const { version } = JSON.parse(await readFile(join(source, "package.json"), "utf8"));
  if (typeof version !== "string" || !version) throw new Error("The source package.json has no version.");

  const vendor = await mkdtemp(join(root, ".vendor-sync-"));
  staged.push(vendor);
  const documents = {};
  for (const file of files) {
    const bytes = await readFile(join(source, file));
    await mkdir(dirname(join(vendor, file)), { recursive: true });
    await writeFile(join(vendor, file), bytes);
    documents[file] = sha256(bytes);
  }

  const shots = await mkdtemp(join(root, ".screenshots-sync-"));
  staged.push(shots);
  const images = {};
  for (const shot of screenshots) {
    for (const [capture, suffix] of [[shot.capture, ""], [shot.narrow, "-narrow"]]) {
      if (!capture) continue;
      const bytes = await readFile(join(captures, capture));
      const file = `moguri-${shot.name}${suffix}.png`;
      await writeFile(join(shots, file), bytes);
      images[`assets/screenshots/${file}`] = { capture, ...pngSize(bytes, capture), sha256: sha256(bytes) };
    }
  }

  const record = {
    repository: moguri.repository,
    ref,
    commit,
    version,
    documents,
    screenshots: { generator: "tests/e2e/design-captures.spec.ts", fixtures: "generated", files: images },
  };
  await writeFile(join(vendor, "SOURCE.json"), `${JSON.stringify(record, null, 2)}\n`);

  for (const [stage, target] of [[vendor, join(root, "vendor/moguri")], [shots, join(root, "assets/screenshots")]]) {
    await mkdir(dirname(target), { recursive: true });
    await rm(target, { recursive: true, force: true });
    await rename(stage, target);
    staged.splice(staged.indexOf(stage), 1);
  }
  console.log(`Synced ${files.length} documents and ${Object.keys(images).length} screenshots from ${moguri.repository}@${commit.slice(0, 7)} (${version}).`);
} catch (error) {
  console.error("Moguri sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await Promise.all(staged.map((path) => rm(path, { recursive: true, force: true })));
}
