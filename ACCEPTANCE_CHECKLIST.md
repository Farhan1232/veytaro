# Veytaro acceptance checklist

Three lists, kept apart on purpose:

- **A. Automated, already run** — executed on this machine, with real results.
- **B. Automated in CI** — runs on the GitHub Windows/macOS runners. Proves the
  build; proves nothing about real-world use.
- **C. Manual** — only a person on real hardware can do these. A green CI run is
  **not** a substitute, and nothing here may be ticked off from a build log.

---

## A. Automated — status on the development machine (Linux)

Last run: 2026-08-11.

| # | Check | Command | Result |
| --- | --- | --- | --- |
| A1 | Rust suite | `cargo test --release --lib` | 95 passed, 0 failed, 1 ignored |
| A2 | …of which genuinely executed | `-- --nocapture` | **87 real, 8 vacuous** — see the warning below |
| A3 | Formatting | `cargo fmt --check` | pass |
| A4 | Research tools build behind the gate | `cargo build --release --features research-tools --bin fm_probe` / `fm_catalogue` | both build |
| A5 | Research tools blocked without the gate | `cargo build --release --bin fm_probe` | exit 101, `requires the features: research-tools` |
| A6 | App typecheck | `npx tsc --noEmit` | exit 0 |
| A7 | App frontend build | `npm run build` | pass |
| A8 | Linux bundle | `npm run tauri build -- --bundles deb` | `Veytaro_0.1.0_amd64.deb` |
| A9 | Bundle excludes research binaries | `dpkg -c` | only `usr/bin/Veytaro` |
| A10 | Bundle includes the catalogue | `dpkg -c` | `resources/competition_names/fm26.json` present |
| A11 | Website typecheck / lint / test / build | see `website/README.md` | pass / pass / 17 passed / pass |

> ### ⚠️ A2: eight tests pass without testing anything
>
> `cargo test` reports 95 passing, but with no `.fm` saves on the machine these
> eight print `SKIPPED …` and return success:
>
> | Test | Skip reason |
> | --- | --- |
> | `live_save_tests::resolves_manager_and_club_on_calibration_saves` | live save checks |
> | `live_save_tests::competition_uids_are_unchanged_by_name_resolution` | uid regression check |
> | `live_save_tests::save_embedded_names_are_preferred_and_labelled` | name-source check |
> | `live_save_tests::resolves_current_league_from_the_section_directory` | live save checks |
> | `live_save_tests::tracks_a_club_across_a_division_change` | cross-save check |
> | `live_save_tests::macclesfield_saves_are_two_league_one_and_one_championship` | Macclesfield check |
> | `read_only_safety::parsing_a_save_leaves_the_file_untouched` | read-only check |
> | `read_only_safety::parses_a_save_whose_file_is_write_protected` | write-protection check |
>
> **The read-only guarantee is therefore unproven on this machine.** It is the
> single most important claim the product makes, so treat A2 as open until the
> calibration saves are supplied. See section D.

---

## B. Automated in CI — `.github/workflows/release.yml`

Tick only after reading the actual run log.

### Windows runner (`windows-latest`)

- [ ] `cargo fmt --check`, `cargo test --release --lib`, research-tool gate assertions pass
- [ ] NSIS installer builds
- [ ] Artifact ≥ 1 MB and starts with the `MZ` PE magic
- [ ] Version metadata reads Veytaro / 0.1.0
- [ ] `Get-AuthenticodeSignature` status recorded (expect `NotSigned`)
- [ ] Silent `/S` install exits 0
- [ ] `Veytaro.exe` present after install
- [ ] `resources\competition_names\fm26.json` present after install
- [ ] No `fm_probe*` / `fm_catalogue*` anywhere in the install tree
- [ ] Uninstall registry entry exists with the right DisplayName/Publisher
- [ ] Silent uninstall removes the executable
- [ ] SHA-256 generated and uploaded

### macOS runner (`macos-14`)

- [ ] Universal DMG builds
- [ ] `lipo -archs` on the built binary lists **both** `arm64` and `x86_64` (asserted, not just printed)
- [ ] `Info.plist` shows `CFBundleIdentifier = app.veytaro.desktop` and `LSMinimumSystemVersion = 11.0`
- [ ] DMG mounts via `hdiutil attach`
- [ ] `Veytaro.app` is present inside the mounted DMG
- [ ] `lipo` on the binary **inside the DMG** lists both architectures
- [ ] Bundled catalogue present inside the `.app`
- [ ] No research binaries inside the `.app`
- [ ] `codesign` / `spctl` output recorded (expect rejection while unsigned)
- [ ] SHA-256 generated and uploaded

> CI mounts and inspects the DMG; it does **not** install or launch the app.
> That is section C.

---

## C. Manual — requires real hardware

**None of these have been performed.** They cannot be done from a Linux
development machine.

### C1. Windows 10 or 11, x64

- [ ] Installer downloads and opens
- [ ] SmartScreen behaves as the website describes (warning while unsigned)
- [ ] Installer shows the Veytaro icon and header artwork
- [ ] Language selector offers German and English
- [ ] Installs without prompting for administrator rights
- [ ] Start Menu entry reads **Veytaro**, under a **Veytaro** folder
- [ ] Desktop/Start icon is the Veytaro mark, not a generic icon
- [ ] Application launches; window title reads **Veytaro**
- [ ] Taskbar icon is correct
- [ ] Sidebar and sign-in screen show the Veytaro logo
- [ ] *Hilfe → Über Veytaro* shows "Veytaro — Football Manager Assistant" and version 0.1.0
- [ ] **Open a real `.fm` save** — club, competition and season resolve correctly
- [ ] **Save is unchanged afterwards** — size, timestamp and SHA-256 identical
- [ ] *Apps & Features* lists **Veytaro** with the correct publisher and version
- [ ] Uninstall removes the app and clears the list entry
- [ ] On a machine **without** WebView2: the installer fetches and installs it

### C2. macOS on Apple Silicon (M1 or newer, macOS 11+)

- [ ] `.dmg` mounts and shows the drag-to-Applications window
- [ ] Dragging Veytaro to Applications works
- [ ] Gatekeeper behaves as the website describes (warning while unsigned)
- [ ] Application launches after *Trotzdem öffnen*
- [ ] Dock and Finder icons are the Veytaro mark
- [ ] Menu bar shows **Veytaro**; *Über Veytaro* is correct
- [ ] Activity Monitor → *Kind* shows **Apple** (native, not Rosetta)
- [ ] **Open a real `.fm` save** from `~/Documents` and from an external volume
- [ ] **Save is byte-identical afterwards**
- [ ] Native file dialog opens and filters correctly
- [ ] Quit and relaunch: theme, language and recent saves persist
- [ ] Drag from Applications to Bin removes the app cleanly

### C3. macOS on Intel (macOS 11+)

- [ ] The same `.dmg` mounts and installs
- [ ] Application launches
- [ ] Activity Monitor → *Kind* shows **Intel** (native slice, not Rosetta)
- [ ] **Open a real `.fm` save** — identity resolves identically to C2
- [ ] **Save is byte-identical afterwards**

### C4. Website in a real browser

- [ ] Windows visitor: Windows card marked *Empfohlen für dich*, macOS still visible
- [ ] macOS visitor: macOS card recommended, Windows still visible
- [ ] iPhone/Android: both offered equally, no horizontal scrolling
- [ ] Nothing downloads without a click
- [ ] Each button delivers the real installer, and the downloaded file's SHA-256
      matches the value printed on the page
- [ ] Tab through the page: focus always visible, order sensible
- [ ] With *Reduce Motion* on: no entrance animation, all content visible
- [ ] A bad URL renders `/404.html`

---

## D. Blocked: real-save regression tests

The eight calibration saves are **not present on this machine** — a full
filesystem sweep found no `.fm` file anywhere.

To close A2, put the saves in one directory and run, from `src-tauri/`:

```bash
SCOUTIQ_TEST_SAVES="/absolute/path/to/saves" cargo test --release --lib -- --nocapture
```

Success looks like 95 passing with **no `SKIPPED` lines**.

From `expected_competitions()` in `src-tauri/src/fm/identity.rs`, the suite
expects saves covering:

| Club uid | Club | Expected competition uid |
| --- | --- | --- |
| 901 | Bayer Leverkusen | 22 (Bundesliga) |
| 933 | MSV Duisburg | 23 (2. Bundesliga) |
| 955 | TSV 1860 München | 91107111 (Regionalliga Bayern) |
| 5103842 | Salford City | 14 (EFL League Two) |
| 2000095665 | Macclesfield ×3 | 13 → 12 (League One, then Championship) |

The saves are only ever opened with `File::open`; the run cannot modify them.
Record size, mtime and SHA-256 before and after anyway — that is exactly what
`parsing_a_save_leaves_the_file_untouched` asserts, and having your own copy of
the numbers makes the guarantee checkable independently.

---

## E. Before marking anything "signed"

- [ ] `signtool verify /pa` passes on the `.exe`
- [ ] `spctl -a -vvv -t install` reports `accepted` **and** `Notarized Developer ID`
- [ ] `xcrun stapler validate` passes on the `.dmg`
- [ ] Only then set `signing` in `website/src/config/releases.ts`

Changing that field removes the security warnings from the install instructions
and the FAQ. Setting it early makes the site tell users something untrue.
