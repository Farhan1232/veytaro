# Releasing Veytaro

How a version becomes two installers and a live download page.

Installers **cannot** be cross-compiled: a Windows `.exe` needs a Windows
machine and a macOS `.dmg` needs a Mac. The GitHub Actions workflow at
`.github/workflows/release.yml` exists precisely so neither has to be built by
hand.

---

## 0. Prerequisite: a GitHub remote

The repository **is** initialised locally, on branch `master`, with one commit
containing 366 files. `.gitignore` was audited before that commit: `node_modules`,
`target/`, `dist/`, `.env`, `.fm` saves, every certificate/key extension and all
built installers are excluded, and a `git add -n .` dry run was checked to
confirm none of them were staged.

What does **not** exist is a remote — so the release workflow has nowhere to run.

Creating one publishes the code, so it is your call:

```bash
cd <this directory>

# Private only. GitHub is used here purely as Windows/macOS build
# infrastructure, not as website hosting.
gh repo create veytaro --private --source=. --remote=origin --push
```

Then trigger a build:

```bash
gh workflow run release.yml
gh run list --workflow release.yml --limit 1
gh run watch <run-id>
```

Verify before pushing anything:

```bash
git log --oneline           # expect one commit
git ls-files | wc -l        # expect 366
git status --short          # expect empty
```

---

## 1. Set the version

`src-tauri/tauri.conf.json` is the single source of truth for the version. Every
artifact name and the website's download metadata are derived from it.

```bash
# 1. Edit "version" in src-tauri/tauri.conf.json
# 2. Match it in package.json (npm metadata only, but keep them in step)
# 3. Propagate to the website's download config
node scripts/sync-release-to-website.mjs --version-only
```

---

## 2. Build the installers

### Automated (recommended)

```bash
# Manual run, no release created:
gh workflow run release.yml

# Or tag a version — this also drafts a GitHub release with the files attached:
git tag v0.1.0
git push origin v0.1.0
```

The workflow refuses to continue if the tag and `tauri.conf.json` disagree.

Jobs, in order:

| Job | Runner | Does |
| --- | --- | --- |
| `meta` | ubuntu | Reads the version, validates the tag |
| `checks` | ubuntu | Typecheck + build the app frontend; typecheck, lint, test and build the website |
| `rust-tests` | ubuntu | `cargo fmt --check`, `cargo test --release --lib`, and asserts the `research-tools` gate holds |
| `windows` | **windows-latest** | NSIS `.exe`, renamed and checksummed |
| `macos` | **macos-14** | Universal `.dmg`, `lipo`-verified, renamed and checksummed |
| `release` | ubuntu | Tag pushes only: drafts a GitHub release with all artifacts |

Artifacts are uploaded under `veytaro-windows-x64` and `veytaro-macos-universal`
and kept for 14 days. Download them from the run's summary page.

### By hand

On a Windows 10/11 x64 machine, with Node 22, Rust (MSVC toolchain) and the
WebView2 runtime:

```powershell
npm ci
npm run tauri build -- --target x86_64-pc-windows-msvc --bundles nsis
# -> src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\*.exe
```

On a Mac (Apple Silicon or Intel), with Node 22, Rust and Xcode command-line
tools:

```bash
rustup target add aarch64-apple-darwin x86_64-apple-darwin
npm ci
npm run tauri build -- --target universal-apple-darwin --bundles dmg
# -> src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg
```

Confirm the build really is universal:

```bash
lipo -archs src-tauri/target/universal-apple-darwin/release/bundle/macos/Veytaro.app/Contents/MacOS/Veytaro
# expect: x86_64 arm64
```

`lipo -archs` only prints — it exits 0 even for a single-architecture binary, so
reading the output is the check. The workflow asserts both slices explicitly and
fails when either is missing.

**Minimum macOS is 11.0 (Big Sur), not 10.15.** The Apple Silicon half of a
universal binary cannot target anything older: `rustc --print deployment-target
--target aarch64-apple-darwin` reports `MACOSX_DEPLOYMENT_TARGET=11.0`. The
Intel slice could reach 10.12, but a single `LSMinimumSystemVersion` covers the
whole bundle, so 11.0 is the honest floor to advertise.

If a universal build is impossible on your machine, build the two slices
separately and name them
`Veytaro_<version>_macOS_AppleSilicon.dmg` and `Veytaro_<version>_macOS_Intel.dmg`.
The website's `releases.ts` then needs two macOS entries instead of one, and
`scripts/sync-release-to-website.mjs` needs matching filename patterns.

---

## 3. Where the artifacts are

| Platform | Path |
| --- | --- |
| Windows | `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/Veytaro_<version>_x64-setup.exe` |
| macOS | `src-tauri/target/universal-apple-darwin/release/bundle/dmg/Veytaro_<version>_universal.dmg` |
| Linux (dev only) | `src-tauri/target/release/bundle/deb/Veytaro_<version>_amd64.deb` |

The workflow renames them to the published names:

- `Veytaro_<version>_Windows_x64_Setup.exe`
- `Veytaro_<version>_macOS_Universal.dmg`

---

## 4. Publish to the website

Download both artifacts from the workflow run, then, from this directory:

```bash
node scripts/sync-release-to-website.mjs \
  ~/Downloads/Veytaro_0.1.0_Windows_x64_Setup.exe \
  ~/Downloads/Veytaro_0.1.0_macOS_Universal.dmg
```

This is the **only** supported way to activate a download button. It:

1. copies each file into `website/public/downloads/`,
2. measures its real byte size,
3. computes its real SHA-256,
4. writes those into `website/src/config/releases.ts` and flips `status` to
   `"available"`.

It refuses to run on a file whose name does not match the configured version, so
a stale artifact cannot be published by accident.

Verify the checksums the script wrote against the workflow's `.sha256` files:

```bash
sha256sum website/public/downloads/*        # Linux
shasum -a 256 website/public/downloads/*    # macOS
certutil -hashfile <file> SHA256            # Windows
```

Then rebuild and eyeball it:

```bash
cd website
npm run build
npm run preview          # click both download buttons
```

If only one platform has been built, sync just that one — the other button stays
honestly disabled.

### Updating the signing status

`releases.ts` carries a `signing` field per asset (`"unsigned"`, `"signed"`,
`"notarized"`). The install instructions show the SmartScreen / Gatekeeper
warning **only while it is `"unsigned"`**, so update it by hand once signing is
in place, or the site will keep warning about a problem that no longer exists.

---

## 5. Deploying

Out of scope here, and nothing in this repository configures it. The build
output is `website/dist/` — a plain static directory. Domain, DNS, TLS and
hosting are handled separately.

Serve `website/dist/` with any static host, and point its 404 handler at
`/404.html`.
