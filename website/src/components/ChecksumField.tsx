import { useEffect, useRef, useState } from "react";
import { content } from "../content";
import { copyText } from "../lib/clipboard";
import { CheckIcon, CopyIcon } from "./Icons";
import "./ChecksumField.css";

type CopyState = "idle" | "copied" | "failed";

interface ChecksumFieldProps {
  /** The full 64-character hex digest. */
  value: string;
  /** Platform name, used to build a unique accessible label. */
  platformName: string;
}

/**
 * Shows a full SHA-256 digest with a copy button.
 *
 * The digest is never truncated — a shortened hash cannot be used to verify
 * anything, which is the only reason it is on the page. It wraps instead, and
 * the <code> element keeps it selectable for people who copy by hand.
 */
export function ChecksumField({ value, platformName }: ChecksumFieldProps) {
  const t = content.downloads;
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clearing on unmount stops a state update after the card has gone.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onCopy = async () => {
    const ok = await copyText(value);
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  };

  const label =
    state === "copied" ? t.checksumCopied : state === "failed" ? t.checksumCopyFailed : t.checksumCopy;

  return (
    <div className="checksum">
      <div className="checksum__head">
        <span className="checksum__label">{t.checksumLabel}</span>
        <button
          type="button"
          className={`checksum__copy${state === "copied" ? " is-copied" : ""}`}
          onClick={onCopy}
          aria-label={t.checksumCopyLabel(platformName)}
        >
          {state === "copied" ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
          <span>{label}</span>
        </button>
      </div>

      <code className="checksum__value hash">{value}</code>

      {/* The visual label change is not announced on its own, so the result is
          mirrored into a live region. */}
      <span role="status" aria-live="polite" className="visually-hidden">
        {state === "copied" ? t.checksumCopied : state === "failed" ? t.checksumCopyFailed : ""}
      </span>
    </div>
  );
}
