/**
 * The site's icon set.
 *
 * These are Lucide icons (ISC licence, bundled via `lucide-react`) rather than
 * hand-drawn paths: a real, maintained set is consistent at every size, has
 * correct optical alignment, and looks like the rest of the software industry
 * instead of like something improvised.
 *
 * Everything is re-exported through this one module so components import from a
 * single place and the defaults — size, stroke weight, and `aria-hidden` — are
 * applied in exactly one spot. Icons are decorative by default: the surrounding
 * text always carries the meaning, and no icon here is the only label for
 * anything.
 */

import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  FileSearch,
  Info,
  Laptop,
  ListChecks,
  Lock,
  Mail,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Table2,
  Terminal,
  TriangleAlert,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";

export interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Wraps a Lucide icon with this site's defaults.
 *
 * `absoluteStrokeWidth` keeps the stroke visually constant when the icon is
 * scaled, so a 32px icon does not look heavier than a 16px one.
 */
function icon(Component: LucideIcon, defaultSize = 20) {
  return function Icon({ size = defaultSize, className }: IconProps) {
    return (
      <Component
        size={size}
        className={className}
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden="true"
        focusable="false"
      />
    );
  };
}

/* --- Actions and navigation ---------------------------------------------- */

export const DownloadIcon = icon(Download, 18);
export const CopyIcon = icon(Copy, 16);
export const CheckIcon = icon(Check, 18);
export const ChevronIcon = icon(ChevronDown, 20);
export const ArrowRightIcon = icon(ArrowRight, 18);
export const ExternalIcon = icon(ExternalLink, 16);
export const MenuIcon = icon(Menu, 22);
export const CloseIcon = icon(X, 22);

/* --- Theme ---------------------------------------------------------------- */

export const SunIcon = icon(Sun, 20);
export const MoonIcon = icon(Moon, 20);

/* --- Product concepts ----------------------------------------------------- */

export const SaveIcon = icon(FileSearch, 22);
export const ShieldIcon = icon(ShieldCheck, 22);
export const TableIcon = icon(Table2, 22);
export const TrophyIcon = icon(Trophy, 22);
export const LaptopIcon = icon(Laptop, 22);
export const LockIcon = icon(Lock, 22);
export const MailIcon = icon(Mail, 20);
export const BookIcon = icon(BookOpen, 22);
export const InfoIcon = icon(Info, 20);
export const AlertIcon = icon(TriangleAlert, 20);
export const TerminalIcon = icon(Terminal, 20);
export const ChecklistIcon = icon(ListChecks, 22);
export const VerifiedIcon = icon(CheckCircle2, 20);

/* --- Platform marks -------------------------------------------------------
   Lucide deliberately ships no brand logos, so these two stay hand-drawn. They
   identify which operating system a download is for — nominative use, which is
   what an OS mark on a download page is for. */

const platformBase = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  "aria-hidden": true,
  focusable: false as const,
});

export function WindowsIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...platformBase(size)} className={className}>
      <path
        d="M3 6.2 10.2 5.2V11.4H3V6.2ZM11.6 5L21 3.7V11.4H11.6V5ZM3 12.7H10.2V18.9L3 17.9V12.7ZM11.6 12.7H21V20.4L11.6 19.1V12.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AppleIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...platformBase(size)} className={className}>
      <path
        d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2.1.8-1.2 1.1-2.4 1.2-2.4-.1 0-2.2-.9-2.2-3.3ZM14.2 5.9c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
