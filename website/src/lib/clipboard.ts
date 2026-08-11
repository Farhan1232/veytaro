/**
 * Copies text to the clipboard, resolving to whether it worked.
 *
 * `navigator.clipboard` is unavailable outside a secure context, which includes
 * plain-http previews and some in-app browsers. The `execCommand` path is
 * deprecated but still the only thing that works there, so it stays as a
 * fallback — the caller shows an error only when both routes fail.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;

  const area = document.createElement("textarea");
  area.value = text;
  // Off-screen but still focusable — `display: none` would make the selection
  // fail, and a visible element would scroll the page.
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-9999px";
  area.style.opacity = "0";
  document.body.appendChild(area);

  try {
    area.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(area);
  }
}
