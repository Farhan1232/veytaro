import { useEffect, useRef, useState } from "react";
import { content } from "../content";
import { copyText } from "../lib/clipboard";
import { CheckIcon, CopyIcon } from "./Icons";
import "./CodeBlock.css";

/**
 * A command the reader is expected to run, with a copy button.
 *
 * Commands wrap rather than scroll: a verification command that runs off the
 * edge of its box reads as truncated, and anyone retyping it would miss the
 * tail — the whole point is that they can reproduce it exactly.
 */
export function CodeBlock({
  code,
  label,
  copyLabel,
}: {
  code: string;
  /** Shown above the block, e.g. "Windows (PowerShell)". */
  label?: string;
  /** Accessible name for the copy button. */
  copyLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onCopy = async () => {
    const ok = await copyText(code);
    setCopied(ok);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="codeblock">
      <div className="codeblock__bar">
        {label && <span className="codeblock__label">{label}</span>}
        <button
          type="button"
          className={copied ? "codeblock__copy is-copied" : "codeblock__copy"}
          onClick={onCopy}
          aria-label={copyLabel}
        >
          {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
          <span>{copied ? content.downloads.checksumCopied : content.downloads.checksumCopy}</span>
        </button>
      </div>

      <pre className="codeblock__pre">
        <code>{code}</code>
      </pre>

      <span role="status" aria-live="polite" className="visually-hidden">
        {copied ? content.downloads.checksumCopied : ""}
      </span>
    </div>
  );
}
