#!/usr/bin/env node
/**
 * Copy real installer artifacts into the website and rewrite the download
 * metadata to match them.
 *
 * This is the only supported way to make a download button go live. It refuses
 * to invent anything: every value it writes is measured from a file that
 * actually exists on disk.
 *
 * Usage (from the repository root):
 *
 *   node scripts/sync-release-to-website.mjs <artifact> [<artifact> ...]
 *   node scripts/sync-release-to-website.mjs --version-only
 *
 * Example:
 *
 *   node scripts/sync-release-to-website.mjs \
 *     ~/Downloads/Veytaro_0.1.0_Windows_x64_Setup.exe \
 *     ~/Downloads/Veytaro_0.1.0_macOS_Universal.dmg
 *
 * `--version-only` refreshes the version, filenames and paths from
 * tauri.conf.json without touching availability — useful right after a version
 * bump, before any artifact exists.
 */

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = join(ROOT, "website", "src", "config", "releases.ts");
const DOWNLOADS = join(ROOT, "website", "public", "downloads");
const TAURI_CONF = join(ROOT, "src-tauri", "tauri.conf.json");

/** Filename shape -> platform. Anything else is rejected rather than guessed. */
const PATTERNS = [
  { platform: "windows", re: /_Windows_x64_Setup\.exe$/i },
  { platform: "macos", re: /_macOS_Universal\.dmg$/i },
];

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readVersion() {
  const conf = JSON.parse(readFileSync(TAURI_CONF, "utf8"));
  if (!conf.version) fail("src-tauri/tauri.conf.json has no version field");
  return conf.version;
}

/**
 * Replace one `key: value,` inside a single platform's object literal.
 * Scoped to the block so the two platforms never overwrite each other.
 *
 * Presence is checked with an explicit `.test()` rather than by comparing the
 * result to the input: rewriting a field to the value it already holds is a
 * legitimate no-op, not a failure to find it.
 */
function setField(source, platform, key, literal) {
  const anchor = source.indexOf(`platform: "${platform}"`);
  if (anchor === -1) fail(`no "${platform}" entry found in releases.ts`);

  const blockEnd = source.indexOf("\n    },", anchor);
  if (blockEnd === -1) fail(`malformed "${platform}" entry in releases.ts`);

  const head = source.slice(0, anchor);
  const block = source.slice(anchor, blockEnd);
  const tail = source.slice(blockEnd);

  const field = new RegExp(`(^|\\n)(\\s*)${key}:[^\\n]*`);
  if (!field.test(block)) {
    fail(`could not find field "${key}" in the "${platform}" entry`);
  }

  const updated = block.replace(
    field,
    (_m, lead, indent) => `${lead}${indent}${key}: ${literal},`,
  );
  return head + updated + tail;
}

function setVersion(source, version) {
  const field = /(\n\s*version:\s*)"[^"]*"/;
  if (!field.test(source)) {
    fail("could not find the version field in releases.ts");
  }
  return source.replace(field, `$1"${version}"`);
}

const args = process.argv.slice(2);
const versionOnly = args.includes("--version-only");
const inputs = args.filter((a) => !a.startsWith("--"));

if (!versionOnly && inputs.length === 0) {
  console.error("usage: node scripts/sync-release-to-website.mjs <artifact> [...]");
  console.error("       node scripts/sync-release-to-website.mjs --version-only");
  process.exit(2);
}

if (!existsSync(CONFIG)) fail(`missing ${CONFIG}`);

const version = readVersion();
let source = readFileSync(CONFIG, "utf8");
source = setVersion(source, version);

// Filenames always follow from the version, whether or not a build exists yet.
const expected = {
  windows: `Veytaro_${version}_Windows_x64_Setup.exe`,
  macos: `Veytaro_${version}_macOS_Universal.dmg`,
};
for (const [platform, filename] of Object.entries(expected)) {
  source = setField(source, platform, "filename", JSON.stringify(filename));
  source = setField(source, platform, "path", JSON.stringify(`/downloads/${filename}`));
}

const synced = [];

if (!versionOnly) {
  mkdirSync(DOWNLOADS, { recursive: true });

  for (const input of inputs) {
    const src = resolve(input);
    if (!existsSync(src)) fail(`artifact not found: ${src}`);
    if (!statSync(src).isFile()) fail(`not a file: ${src}`);

    const name = basename(src);
    const match = PATTERNS.find((p) => p.re.test(name));
    if (!match) {
      fail(
        `cannot classify "${name}".\n` +
          `       Expected one of:\n` +
          `         ${expected.windows}\n` +
          `         ${expected.macos}`,
      );
    }

    const { platform } = match;
    if (name !== expected[platform]) {
      fail(
        `"${name}" does not match the configured version ${version}.\n` +
          `       Expected "${expected[platform]}".\n` +
          `       Bump src-tauri/tauri.conf.json or rebuild before syncing.`,
      );
    }

    const dest = join(DOWNLOADS, name);
    copyFileSync(src, dest);

    const size = statSync(dest).size;
    const digest = sha256(dest);

    source = setField(source, platform, "sizeBytes", String(size));
    source = setField(source, platform, "sha256", JSON.stringify(digest));
    source = setField(source, platform, "status", '"available"');

    synced.push({ platform, name, size, digest });
  }
}

writeFileSync(CONFIG, source, "utf8");

console.log(`Veytaro ${version}`);
console.log(`updated ${CONFIG.replace(ROOT + "/", "")}`);

if (synced.length === 0) {
  console.log("\nNo artifacts synced. Download buttons stay disabled, which is correct");
  console.log("until real installers exist.");
} else {
  console.log("");
  for (const a of synced) {
    console.log(`  ${a.platform}`);
    console.log(`    file    ${a.name}`);
    console.log(`    size    ${a.size} bytes (${(a.size / 1024 / 1024).toFixed(1)} MB)`);
    console.log(`    sha256  ${a.digest}`);
  }
  console.log("\nNext: cd website && npm run build");
}

const stillPending = [...source.matchAll(/platform: "(\w+)"[\s\S]*?status: "(\w+)"/g)]
  .filter((m) => m[2] !== "available")
  .map((m) => m[1]);
if (stillPending.length > 0) {
  console.log(`\nStill pending (button disabled): ${stillPending.join(", ")}`);
}
