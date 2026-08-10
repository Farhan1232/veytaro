#!/usr/bin/env python3
"""Derive every Veytaro brand asset from the single source logo.

The source (``brand/veytaro-logo.png``) is never modified. Everything else in
``brand/``, ``src-tauri/icons/`` and ``website/public/`` is generated from it, so
re-running this script after a logo change refreshes the whole set.

Why a dark plate for the app icons: the mark is roughly half white and half
green. On a white surface (light-theme Windows taskbar, macOS Finder, a browser
tab strip) the white wings vanish. Plating the mark on the application's own
near-black shell colour keeps it legible on every background, and matches how
the desktop app already frames its sidebar logo.

Requires Pillow:  python3 -m pip install --user Pillow

Usage:
    python3 scripts/generate-brand-assets.py [path/to/source-logo.png]

After running, regenerate the Tauri icon set:
    npx tauri icon brand/veytaro-icon-master.png
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "brand"
WEB_PUBLIC = ROOT / "website" / "public"
NSIS_DIR = ROOT / "src-tauri" / "installer" / "windows"
APP_PUBLIC = ROOT / "public"

# Pulled from src/styles/themes.css so the icon plate matches the running app.
SHELL_TOP = (20, 24, 29)  # near --bg-elevated #111316, lifted slightly
SHELL_BOTTOM = (8, 9, 11)  # --bg-base #08090b
ACCENT = (57, 255, 103)  # --brand-accent #39ff67

# Apple's continuous-corner icon radius is ~22.37% of the edge.
CORNER_RATIO = 0.2237


def trimmed_mark(source: Path) -> Image.Image:
    """The logo cropped to its own opaque pixels, so padding is ours to choose."""
    logo = Image.open(source).convert("RGBA")
    box = logo.getchannel("A").getbbox()
    if box is None:
        raise SystemExit(f"{source} has no opaque pixels")
    return logo.crop(box)


def rounded_mask(size: int, radius: int, supersample: int = 4) -> Image.Image:
    """Anti-aliased rounded-square mask (drawn large, then downsampled)."""
    big = Image.new("L", (size * supersample, size * supersample), 0)
    ImageDraw.Draw(big).rounded_rectangle(
        (0, 0, size * supersample - 1, size * supersample - 1),
        radius=radius * supersample,
        fill=255,
    )
    return big.resize((size, size), Image.LANCZOS)


def vertical_gradient(size: int, top: tuple, bottom: tuple) -> Image.Image:
    grad = Image.new("RGB", (1, size))
    for y in range(size):
        t = y / max(size - 1, 1)
        grad.putpixel(
            (0, y),
            tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )
    return grad.resize((size, size), Image.BICUBIC)


def accent_glow(size: int) -> Image.Image:
    """Soft green bloom behind the mark — the app's --shadow-logo, as pixels."""
    glow = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(glow)
    cx, cy, r = size / 2, size * 0.54, size * 0.30
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.13))
    layer = Image.new("RGBA", (size, size), ACCENT + (0,))
    layer.putalpha(glow)
    return layer


def plated_icon(mark: Image.Image, size: int = 1024, scale: float = 0.70) -> Image.Image:
    """The square app icon: mark centred on a dark rounded plate."""
    radius = round(size * CORNER_RATIO)
    plate = vertical_gradient(size, SHELL_TOP, SHELL_BOTTOM).convert("RGBA")
    plate.alpha_composite(accent_glow(size))

    # Hairline accent border, matching --accent-border rgba(57,255,103,0.35).
    border = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(border).rounded_rectangle(
        (0, 0, size - 1, size - 1),
        radius=radius,
        outline=ACCENT + (90,),
        width=max(2, round(size * 0.004)),
    )
    plate.alpha_composite(border)

    target_w = round(size * scale)
    target_h = round(target_w * mark.height / mark.width)
    resized = mark.resize((target_w, target_h), Image.LANCZOS)
    plate.alpha_composite(
        resized,
        ((size - target_w) // 2, round(size * 0.5 - target_h / 2)),
    )

    plate.putalpha(rounded_mask(size, radius))
    return plate


def padded_square(mark: Image.Image, size: int = 1024, scale: float = 0.88) -> Image.Image:
    """Transparent square version — no stretching, letterboxed with empty space."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target_w = round(size * scale)
    target_h = round(target_w * mark.height / mark.width)
    resized = mark.resize((target_w, target_h), Image.LANCZOS)
    canvas.alpha_composite(
        resized, ((size - target_w) // 2, (size - target_h) // 2)
    )
    return canvas


def og_image(mark: Image.Image, width: int = 1200, height: int = 630) -> Image.Image:
    """Social preview: mark on the app's shell background, room for the wordmark
    to be rendered by the page itself rather than baked in at the wrong size."""
    canvas = vertical_gradient(height, SHELL_TOP, SHELL_BOTTOM).convert("RGBA")
    canvas = canvas.resize((width, height), Image.BICUBIC)

    glow = Image.new("L", (width, height), 0)
    ImageDraw.Draw(glow).ellipse(
        (width * 0.18, height * 0.05, width * 0.82, height * 0.95), fill=55
    )
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    bloom = Image.new("RGBA", (width, height), ACCENT + (0,))
    bloom.putalpha(glow)
    canvas.alpha_composite(bloom)

    target_h = round(height * 0.46)
    target_w = round(target_h * mark.width / mark.height)
    resized = mark.resize((target_w, target_h), Image.LANCZOS)
    canvas.alpha_composite(
        resized, ((width - target_w) // 2, round(height * 0.16))
    )
    return canvas


def nsis_banner(mark: Image.Image, width: int, height: int, scale: float) -> Image.Image:
    """NSIS wants 24-bit BMPs at exact sizes: 150x57 header, 164x314 sidebar.
    No alpha channel survives, so the dark plate colour is painted in."""
    canvas = vertical_gradient(max(width, height), SHELL_TOP, SHELL_BOTTOM)
    canvas = canvas.resize((width, height), Image.BICUBIC).convert("RGBA")

    glow = Image.new("L", (width, height), 0)
    r = min(width, height) * 0.9
    ImageDraw.Draw(glow).ellipse(
        (width / 2 - r, height * 0.5 - r, width / 2 + r, height * 0.5 + r), fill=45
    )
    glow = glow.filter(ImageFilter.GaussianBlur(min(width, height) * 0.25))
    bloom = Image.new("RGBA", (width, height), ACCENT + (0,))
    bloom.putalpha(glow)
    canvas.alpha_composite(bloom)

    target_h = round(height * scale)
    target_w = round(target_h * mark.width / mark.height)
    if target_w > width * 0.86:
        target_w = round(width * 0.86)
        target_h = round(target_w * mark.height / mark.width)
    resized = mark.resize((target_w, target_h), Image.LANCZOS)
    canvas.alpha_composite(
        resized, ((width - target_w) // 2, (height - target_h) // 2)
    )
    return canvas.convert("RGB")


def save_bmp(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "BMP")
    print(f"  {path.relative_to(ROOT)}  {image.size[0]}x{image.size[1]}  "
          f"{path.stat().st_size / 1024:.1f} KB")


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)
    print(f"  {path.relative_to(ROOT)}  {image.size[0]}x{image.size[1]}  "
          f"{path.stat().st_size / 1024:.1f} KB")


def main() -> None:
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else BRAND / "veytaro-logo.png"
    if not source.exists():
        raise SystemExit(f"source logo not found: {source}")

    mark = trimmed_mark(source)
    print(f"source: {source}  mark content: {mark.width}x{mark.height}")

    print("brand/")
    save_png(mark, BRAND / "veytaro-mark.png")
    save_png(plated_icon(mark), BRAND / "veytaro-icon-master.png")
    save_png(padded_square(mark), BRAND / "veytaro-mark-square.png")

    print("public/  (desktop app frontend)")
    # Tab icon for `npm run dev` in a browser; the packaged app uses src-tauri/icons.
    save_png(plated_icon(mark, 256), APP_PUBLIC / "veytaro-icon.png")
    # Sidebar brand mark — transparent, the app shell is dark in both themes.
    save_png(mark.resize((256, round(256 * mark.height / mark.width)), Image.LANCZOS),
             APP_PUBLIC / "veytaro-mark.png")

    print("website/public/")
    # Header/hero/footer use the transparent mark; the site is dark-themed.
    save_png(mark.resize((512, round(512 * mark.height / mark.width)), Image.LANCZOS),
             WEB_PUBLIC / "veytaro-mark.png")
    save_png(og_image(mark), WEB_PUBLIC / "og-image.png")
    # Opaque, no transparency: iOS composites transparent touch icons onto white.
    save_png(plated_icon(mark, 180).convert("RGB").convert("RGBA"),
             WEB_PUBLIC / "apple-touch-icon.png")
    for px in (192, 512):
        save_png(plated_icon(mark, px), WEB_PUBLIC / f"icon-{px}.png")
    for px in (32, 16):
        save_png(plated_icon(mark, px), WEB_PUBLIC / f"favicon-{px}.png")

    print("src-tauri/installer/windows/  (NSIS artwork, exact sizes required)")
    save_bmp(nsis_banner(mark, 150, 57, 0.72), NSIS_DIR / "header.bmp")
    save_bmp(nsis_banner(mark, 164, 314, 0.32), NSIS_DIR / "sidebar.bmp")

    ico = plated_icon(mark, 256)
    ico_path = WEB_PUBLIC / "favicon.ico"
    ico.save(ico_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"  {ico_path.relative_to(ROOT)}  multi-size  "
          f"{ico_path.stat().st_size / 1024:.1f} KB")

    print("\nNext: npx tauri icon brand/veytaro-icon-master.png")


if __name__ == "__main__":
    main()
