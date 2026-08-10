# website/public/downloads/

Real installer artifacts belong here, and nothing else.

This directory is intentionally empty in the repository. The download buttons on
the site are driven by `website/src/config/releases.ts`; a platform whose
`status` is `"pending"` renders a disabled button, so an empty directory is a
correct, honest state rather than a broken one.

**Never** place a placeholder, renamed text file or zero-byte stub here to make
a button light up. The button is wired to the real file or to nothing.

## Filling it

From the repository root, after a release build has produced real artifacts:

```bash
node scripts/sync-release-to-website.mjs <path-to-installer> [<path-to-installer> ...]
```

The script copies each artifact in, measures its real size, computes its
SHA-256, and rewrites the matching entry in `releases.ts` — including flipping
`status` to `"available"`. See `RELEASE.md` for the full flow.

Expected filenames:

- `Veytaro_<version>_Windows_x64_Setup.exe`
- `Veytaro_<version>_macOS_Universal.dmg`
