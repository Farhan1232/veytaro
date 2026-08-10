# Veytaro

Football Manager 26 save-file assistant — Rust + Tauri + React + TypeScript.

The application reads `.fm` saves and resolves the
`Human Manager → Managed Club → Current Primary Competition` path. Saves are
opened read-only and are never written, renamed or truncated.

| | |
| --- | --- |
| Desktop app | this directory |
| Download website | [`website/`](website/) — see [`website/README.md`](website/README.md) |
| Release process | [`RELEASE.md`](RELEASE.md) |
| Code signing | [`SIGNING.md`](SIGNING.md) |
| Pre-release checks | [`ACCEPTANCE_CHECKLIST.md`](ACCEPTANCE_CHECKLIST.md) |

## Run the desktop application

```bash
npm install                 # first time only
npm run tauri dev           # app in a native window, with hot reload
```

`npm run dev` alone serves the frontend at <http://localhost:1420> in a browser,
but Tauri commands (the FM parser, native dialogs, the menu bar) are unavailable
there — the app detects this and degrades rather than crashing.

## Build

```bash
# Frontend only
npm run build               # tsc && vite build
npm run typecheck           # tsc --noEmit

# Rust library and desktop binary
cd src-tauri && cargo build --release

# Installer for the machine you are on
npm run tauri build
```

`npm run tauri build` on Linux produces `.deb`/`.rpm`/`.AppImage`. **Windows
`.exe` and macOS `.dmg` installers must be built on Windows and macOS
respectively** — see [`RELEASE.md`](RELEASE.md).

Artifacts land in `src-tauri/target/release/bundle/<format>/`.

## Branding

The logo lives at `brand/veytaro-logo.png` and is **never edited**. Every other
brand asset is derived from it:

```bash
python3 -m pip install --user Pillow    # once
python3 scripts/generate-brand-assets.py
npx tauri icon brand/veytaro-icon-master.png
```

That regenerates the app icons (`src-tauri/icons/`), the NSIS installer artwork
(`src-tauri/installer/windows/`), the in-app marks (`public/`) and the website's
favicons, manifest icons and Open Graph image (`website/public/`).

### Names deliberately left as `scoutiq`

The product is Veytaro everywhere a user can see it. These internal identifiers
kept their old spelling on purpose, because renaming them would break something
without changing anything a user reads:

| Identifier | Why it stays |
| --- | --- |
| `scoutiq://…` Tauri event names | A contract between `src-tauri/src/lib.rs` and the frontend listeners. Renaming means changing both sides in lockstep for zero user-visible gain. |
| `scoutiq.*` localStorage keys | Theme, language, recent saves, squad and cloud state. Renaming silently resets every existing user's settings. |
| `SCOUTIQ_COMPETITION_NAMES` | Read by the packaged app to locate the bundled catalogue, and documented as a deployment override. |
| `SCOUTIQ_TEST_SAVES` | Documented in every test-running instruction; renaming would silently turn live save checks into skips. |
| Supabase column and table values | Database values. Renaming requires a migration against live data. |

The Rust crate itself **was** renamed (`scoutiq` → `veytaro`, lib
`scoutiq_lib` → `veytaro_lib`): that is package metadata, the compiler verifies
every reference, and the full test suite passes unchanged.

## Research and validation binaries

`fm_probe` and `fm_catalogue` are **QA tools, not part of the shipped app**.
They sit behind the `research-tools` feature so `tauri build` cannot mistake one
of them for the application binary — without the gate the packaged `.deb`
shipped `fm_probe` in `/usr/bin` instead of the app.

Because of that gate, every command that touches them needs the feature flag:

```bash
cargo build --release --features research-tools --bin fm_probe
cargo build --release --features research-tools --bin fm_catalogue
```

`cargo build --release --bin fm_probe` on its own fails by design, with
`target 'fm_probe' requires the features: 'research-tools'`. The release
workflow asserts both halves of that: the tools compile with the flag, and the
build fails without it.

### fm_probe

Read-only. Resolves one or more saves and prints what the parser recovers.

```bash
P=./target/release/fm_probe

$P --deep <save.fm>          # directory-driven resolver + game_db name table
$P --identity <save.fm>      # the exact path the Tauri command uses
$P --identity --json <s.fm>  # the full result payload, for diffing
$P --sections <save.fm>      # section directory listing
$P --clubrecords <save.fm>   # every club record answering to the club's name
$P --names 200 <save.fm>     # name-table records below an id
```

`--clubrecords` is how a club uid resolved without an inline hint is checked for
ambiguity: it prints each candidate record and whether they agree.

## Validation

```bash
cd src-tauri

# Unit tests. Live save checks skip loudly without SCOUTIQ_TEST_SAVES.
cargo test --release --lib

# The full suite, including read-only safety and the eight calibration saves.
SCOUTIQ_TEST_SAVES=/path/to/saves cargo test --release --lib

cargo build --release --features research-tools --bin fm_probe
cargo fmt --check
```

Frontend:

```bash
npm run typecheck
npm run build
```

`SCOUTIQ_TEST_SAVES` points at a directory of `.fm` files. Without it the live
checks print `SKIPPED …` rather than passing silently — they were once keyed on
absolute paths from one machine and passed vacuously everywhere else.

### Read-only guarantee

Saves are opened with `File::open` only and are never written, renamed or
truncated. `read_only_safety::parsing_a_save_leaves_the_file_untouched` asserts
the property rather than the intent: it records size, modification time and
SHA-256 for every save, runs the full identity parser, and re-checks all three.

## Competition-name catalogue

`src-tauri/resources/competition_names/fm26.json` maps `competition uid →
default display name`. It only ever *labels* a uid; it holds no club data and
cannot influence which league a club is in. See that directory's README for
regeneration and for the known uid 22 gap.

The packaged app locates it through Tauri's resource directory and exports
`SCOUTIQ_COMPETITION_NAMES` at startup; set that variable yourself to override.

## Recommended IDE setup

[VS Code](https://code.visualstudio.com/) +
[Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
