import { de } from "./de";
import type { SiteContent } from "./types";

/**
 * The active translation. German is the only one that exists today, so the
 * site ships without a language switcher rather than with a half-finished one.
 * Adding English: create `en.ts`, then select it here.
 */
export const content: SiteContent = de;

export type * from "./types";
