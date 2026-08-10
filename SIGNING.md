# Code signing and notarization

**Current status: Veytaro is unsigned on both platforms.**

Nothing in this repository holds a certificate, and no signing has been
performed. The builds are *signing-ready* — the configuration hooks exist and
are documented below — but until real credentials are supplied, both installers
are unsigned and both operating systems will warn users about them.

The download page states this openly (see the "Warum zeigt Windows oder macOS
eine Sicherheitswarnung?" FAQ entry and the install steps), driven by the
`signing` field in `website/src/config/releases.ts`. Update that field when this
changes, or the site will keep describing a warning users no longer see.

---

## What users see today

**Windows.** SmartScreen shows *"Der Computer wurde durch Windows geschützt"*.
Users must click *Weitere Informationen* → *Trotzdem ausführen*. The warning
softens as the file accrues download reputation, but only signing removes it
reliably.

**macOS.** Gatekeeper refuses the first launch: *"Veytaro kann nicht geöffnet
werden, da der Entwickler nicht überprüft werden kann."* Users must go to
*Systemeinstellungen → Datenschutz & Sicherheit* and click *Trotzdem öffnen*.

Both are expected for unsigned software. Neither indicates a problem with the
build.

---

## Windows: Authenticode

### What to buy

An **OV code-signing certificate** (~€200–400/year) still triggers SmartScreen
until reputation builds. An **EV code-signing certificate** (~€300–600/year,
delivered on a hardware token or via a cloud HSM) gets instant SmartScreen
reputation. For a consumer download page, EV is the one worth paying for.

Since June 2023 the CA/Browser Forum requires all code-signing keys to live on
FIPS 140-2 hardware, so "just upload a .pfx" is no longer an option with a new
certificate from a public CA. Cloud signing services (Azure Trusted Signing,
SSL.com eSigner, DigiCert KeyLocker) exist to make this work in CI.

### Wiring it into the build

Tauri signs both the app binary and the NSIS installer when configured. Add to
`src-tauri/tauri.conf.json` under `bundle.windows`:

```jsonc
"certificateThumbprint": "A1B2C3…",   // SHA-1 thumbprint of the cert
"digestAlgorithm": "sha256",
"timestampUrl": "http://timestamp.digicert.com"
```

A timestamp URL is not optional in practice: without it, every signature stops
validating the day the certificate expires.

For a cloud/HSM signer, use a custom command instead:

```jsonc
"signCommand": {
  "cmd": "signtool",
  "args": ["sign", "/v", "/fd", "sha256", "/tr", "http://timestamp.digicert.com",
           "/td", "sha256", "/dlib", "eSigner.dll", "%1"]
}
```

Tauri substitutes `%1` with each file to sign.

### In GitHub Actions

Store the credentials as repository secrets and reference them by name only —
never `echo` a secret, and never paste one into `tauri.conf.json`:

| Secret | Contents |
| --- | --- |
| `WINDOWS_CERTIFICATE_THUMBPRINT` | Certificate thumbprint |
| `WINDOWS_SIGN_USERNAME` / `WINDOWS_SIGN_PASSWORD` | Cloud-signing account |
| `WINDOWS_SIGN_TOTP_SECRET` | TOTP seed, for eSigner-style flows |

Add them to the `windows` job's `env:` block. GitHub masks secret values in
logs, but only if they are never transformed (base64, substring) before printing.

### Verifying

```powershell
signtool verify /pa /v Veytaro_0.1.0_Windows_x64_Setup.exe
Get-AuthenticodeSignature .\Veytaro_0.1.0_Windows_x64_Setup.exe
```

---

## macOS: signing and notarization

Distribution outside the App Store needs **both** steps. Signing alone still
trips Gatekeeper on macOS 11+.

### What you need

1. An **Apple Developer Program** membership (US$99/year).
2. A **Developer ID Application** certificate (for the `.app`).
3. A **Developer ID Installer** certificate — only if you also ship a `.pkg`;
   a `.dmg` does not need it.
4. An **app-specific password** or an **App Store Connect API key** for
   notarization.

### Configuration

`src-tauri/tauri.conf.json` already sets `"hardenedRuntime": true`, which
notarization requires. Add the identity:

```jsonc
"macOS": {
  "signingIdentity": "Developer ID Application: Your Name (TEAMID)",
  "minimumSystemVersion": "11.0",
  "hardenedRuntime": true
}
```

Tauri notarizes automatically when these environment variables are present
during `tauri build`:

```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAMID)"
export APPLE_ID="you@example.com"
export APPLE_PASSWORD="app-specific-password"     # NOT your Apple ID password
export APPLE_TEAM_ID="TEAMID"
```

Or with an API key:

```bash
export APPLE_API_ISSUER="…"
export APPLE_API_KEY="…"
export APPLE_API_KEY_PATH="/path/to/AuthKey_XXXX.p8"
```

### In GitHub Actions

Add to the `macos` job, exporting the certificate as a base64 `.p12`:

| Secret | Contents |
| --- | --- |
| `APPLE_CERTIFICATE` | base64 of the `.p12` |
| `APPLE_CERTIFICATE_PASSWORD` | `.p12` password |
| `APPLE_SIGNING_IDENTITY` | `Developer ID Application: …` |
| `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID` | Notarization credentials |

Tauri's action imports `APPLE_CERTIFICATE` into a temporary keychain itself.
Do not add a step that prints the decoded certificate.

### Verifying

```bash
codesign -dv --verbose=4 /Applications/Veytaro.app
spctl -a -vvv -t install /Applications/Veytaro.app       # expect: accepted, Notarized Developer ID
xcrun stapler validate Veytaro_0.1.0_macOS_Universal.dmg
```

`spctl` reporting `accepted` **and** `source=Notarized Developer ID` is the only
proof that notarization worked. A successful build says nothing about it.

---

## Do not claim what has not happened

Mark an artifact `"signed"` or `"notarized"` in `releases.ts` only after the
verification commands above pass on the actual published file. A CI job that
finished green is not evidence: signing steps can be skipped silently when a
secret is absent, and the build will still succeed.
