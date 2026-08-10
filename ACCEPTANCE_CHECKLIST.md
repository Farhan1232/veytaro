# Veytaro acceptance checklist

Two lists. The first is what a machine can prove; the second is what only a
person on real hardware can. A green CI run does **not** satisfy the second.

---

## A. Automated — run before every release

From the repository root:

```bash
# Desktop frontend
npm ci
npm run typecheck
npm run build

# Rust
cd src-tauri
cargo fmt --check
cargo test --release --lib
cargo build --release --features research-tools --bin fm_probe
cargo build --release --features research-tools --bin fm_catalogue
cd ..

# Website
cd website
npm ci
npm run typecheck
npm run lint
npm test
npm run build
cd ..
```

| # | Check | Expected |
| --- | --- | --- |
| A1 | `cargo test --release --lib` | `95 passed; 0 failed; 1 ignored` |
| A2 | `cargo build --release --bin fm_probe` **without** the feature | Fails: `requires the features: 'research-tools'` |
| A3 | `npm run typecheck` (app) | Exit 0 |
| A4 | `npm test` (website) | 17 passed |
| A5 | `cargo fmt --check` | Exit 0 |
| A6 | `.fm` files untouched | Size, mtime and SHA-256 identical before/after — asserted by `read_only_safety::parsing_a_save_leaves_the_file_untouched` |

With real saves available, re-run A1 as
`SCOUTIQ_TEST_SAVES=/path/to/saves cargo test --release --lib` — otherwise the
live-save checks print `SKIPPED …` and prove nothing about real files.

### Installer contents

Per built installer:

| # | Check | How |
| --- | --- | --- |
| A7 | No `fm_probe` / `fm_catalogue` inside | Windows: open the `.exe` with 7-Zip and list. macOS: `ls Veytaro.app/Contents/MacOS/` — only `Veytaro` |
| A8 | Competition catalogue bundled | macOS: `Veytaro.app/Contents/Resources/resources/competition_names/fm26.json` exists. Windows: `resources\competition_names\fm26.json` beside the exe |
| A9 | Product name and version | Windows: right-click → Properties → Details. macOS: `defaults read .../Veytaro.app/Contents/Info.plist CFBundleShortVersionString` |
| A10 | Bundle identifier | `app.veytaro.desktop` |
| A11 | macOS binary is universal | `lipo -archs .../Veytaro.app/Contents/MacOS/Veytaro` → `x86_64 arm64` |
| A12 | SHA-256 recorded | Matches the `.sha256` from the workflow and the value in `website/src/config/releases.ts` |

---

## B. Manual — requires real hardware

**None of the following have been performed.** They cannot be done from a Linux
development machine, and a passing CI build is not a substitute.

### B1. Windows 10 or 11, x64

- [ ] Installer downloads and opens
- [ ] SmartScreen behaves as the website describes (warning while unsigned)
- [ ] Installer shows the Veytaro icon and header artwork
- [ ] Installer language selector offers German and English
- [ ] Installs without prompting for administrator rights (`installMode: currentUser`)
- [ ] Start Menu entry reads **Veytaro**, under a **Veytaro** folder
- [ ] Desktop/Start icon is the Veytaro mark, not a generic icon
- [ ] App launches; window title reads **Veytaro**
- [ ] Taskbar icon is correct
- [ ] Sidebar and login screen show the Veytaro logo
- [ ] Menu *Hilfe → Über Veytaro* shows "Veytaro — Football Manager Assistant" and the right version
- [ ] Open a real `.fm` save: club, competition and season resolve
- [ ] Verify the save's size, timestamp and SHA-256 are unchanged afterwards
- [ ] *Apps & Features* lists **Veytaro** with the correct publisher and version
- [ ] Uninstall removes the app cleanly and disappears from the list
- [ ] On a machine **without** WebView2: installer fetches and installs it

### B2. macOS, Apple Silicon

- [ ] `.dmg` mounts and shows the drag-to-Applications window
- [ ] Dragging to Applications works
- [ ] Gatekeeper behaves as the website describes (warning while unsigned)
- [ ] App launches after *Trotzdem öffnen*
- [ ] Dock and Finder icons are the Veytaro mark
- [ ] Menu bar shows **Veytaro**; *Über Veytaro* is correct
- [ ] Open a real `.fm` save from `~/Documents` and from an external volume
- [ ] Verify the save is byte-identical afterwards
- [ ] Native file dialog opens and filters correctly
- [ ] Quit and relaunch: theme, language and recent saves persist

### B3. macOS, Intel

- [ ] Same `.dmg` installs and launches natively (not under Rosetta)
- [ ] Confirm with Activity Monitor → *Kind* column → **Intel**
- [ ] Open a real `.fm` save; identity resolves identically to B2

### B4. Website, in a real browser

- [ ] Windows visitor: Windows card marked *Empfohlen für dich*, macOS still visible
- [ ] macOS visitor: macOS card recommended, Windows still visible
- [ ] iPhone/Android: both offered equally, no horizontal scrolling
- [ ] Nothing downloads without a click
- [ ] Both download buttons deliver the real installer, and the downloaded file's
      SHA-256 matches the one shown on the page
- [ ] Tab through the whole page: focus is always visible, order is sensible
- [ ] With *Reduce Motion* enabled: no entrance animation, all content visible
- [ ] A bad URL renders `/404.html`, not the host's default error page

---

## C. Before flipping the site to "signed"

- [ ] `signtool verify /pa` passes on the `.exe`
- [ ] `spctl -a -vvv -t install` reports `accepted` **and** `Notarized Developer ID`
- [ ] `xcrun stapler validate` passes on the `.dmg`
- [ ] Only then set `signing` in `website/src/config/releases.ts`

Changing that field removes the security warnings from the install instructions
and the FAQ. Setting it early means the site tells users something untrue.
