/**
 * Shape of a full site translation.
 *
 * Adding a language means adding one file that satisfies this interface —
 * TypeScript then reports any string that was forgotten.
 *
 * Nothing in here states a fact about a release. Version numbers, file sizes
 * and checksums come from `config/releases.ts`, so the copy can never drift out
 * of step with the actual installers.
 */

export type IconName =
  | "save"
  | "shield"
  | "table"
  | "trophy"
  | "laptop"
  | "lock"
  | "book"
  | "mail";

export interface FeatureItem {
  icon: IconName;
  title: string;
  body: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface PlatformSteps {
  title: string;
  steps: string[];
  securityNote: string;
}

/** [label, value] pairs rendered as a definition list. */
export type RequirementRow = readonly [string, string];

export interface RequirementGroup {
  title: string;
  rows: RequirementRow[];
}

export interface FaqItem {
  q: string;
  a: string;
}

/** A heading plus paragraphs, optionally with a bullet list underneath. */
export interface Passage {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SiteContent {
  meta: {
    skipToContent: string;
    /** Appended to every page title, e.g. "Kontakt — Veytaro". */
    titleSuffix: string;
  };

  theme: {
    toLight: string;
    toDark: string;
  };

  nav: {
    homeLabel: string;
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
    downloadCta: string;
  };

  hero: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    markAlt: string;
    illustrationAlt: string;
    /** Short, verifiable statements under the buttons — no numbers, no claims. */
    assurances: string[];
    platformNote: string;
  };

  features: {
    id: string;
    eyebrow: string;
    heading: string;
    description: string;
    items: FeatureItem[];
  };

  howItWorks: {
    id: string;
    eyebrow: string;
    heading: string;
    description: string;
    steps: StepItem[];
    footnote: string;
  };

  downloads: {
    id: string;
    eyebrow: string;
    heading: string;
    description: string;
    versionLabel: string;
    architectureLabel: string;
    sizeLabel: string;
    sizeUnknown: string;
    checksumLabel: string;
    checksumUnknown: string;
    checksumCopy: string;
    checksumCopied: string;
    checksumCopyFailed: string;
    /** Accessible name for the copy button, e.g. "SHA-256 für Windows kopieren". */
    checksumCopyLabel: (platform: string) => string;
    downloadCta: string;
    unavailableCta: string;
    unavailableNote: string;
    recommendedBadge: string;
    signingLabel: string;
    signingUnsigned: string;
    otherPlatformsHint: string;
    mobileNote: string;
    platforms: {
      windows: { name: string; requirement: string; architecture: string };
      macos: { name: string; requirement: string; architecture: string };
    };
  };

  security: {
    id: string;
    eyebrow: string;
    heading: string;
    description: string;
    points: FeatureItem[];
    verifyHeading: string;
    verifyIntro: string;
    windowsLabel: string;
    macosLabel: string;
    verifyOutro: string;
    unsignedHeading: string;
    unsignedBody: string;
  };

  installation: {
    id: string;
    heading: string;
    description: string;
    windows: PlatformSteps;
    macos: PlatformSteps;
  };

  requirements: {
    id: string;
    heading: string;
    description: string;
    diskLabel: string;
    diskUnknown: string;
    diskValue: (installerSize: string) => string;
    windows: RequirementGroup;
    macos: RequirementGroup;
  };

  faq: {
    id: string;
    eyebrow: string;
    heading: string;
    description: string;
    items: FaqItem[];
  };

  /** Repeated call to action above the footer. */
  cta: {
    heading: string;
    body: string;
    primary: string;
    secondary: string;
  };

  footer: {
    tagline: string;
    availability: string;
    copyright: (year: number) => string;
    markAlt: string;
    navHeading: string;
    supportHeading: string;
    supportBody: string;
    legalHeading: string;
    links: {
      terms: string;
      imprint: string;
      privacy: string;
    };
    /** Trademark attribution — factual, and required because the name is used. */
    trademark: string;
    noAffiliation: string;
  };

  about: {
    intro: string;
    passages: Passage[];
    audienceHeading: string;
    audience: FeatureItem[];
    limitsHeading: string;
    limits: string[];
  };

  docs: {
    intro: string;
    tocHeading: string;
    /** Sidebar entries; each id must match a section heading's id on the page. */
    sections: readonly { id: string; label: string }[];

    overviewHeading: string;
    overviewBody: string[];
    overviewPoints: FeatureItem[];

    requirementsHeading: string;
    installHeading: string;
    installIntro: string;

    /** Docs-page wording of the unsigned notice — the home page version ends
        by pointing at the documentation, which would be circular here. */
    unsignedNote: { title: string; body: string };

    checksumHeading: string;
    checksumIntro: string;
    /** Accessible name for a "copy this command" button. */
    copyCommandLabel: (platform: string) => string;
    checksumExpected: string;
    checksumMismatch: { title: string; body: string };

    usageHeading: string;
    usageIntro: string;
    usageSteps: StepItem[];
    usageNote: { title: string; body: string };

    troubleHeading: string;
    troubleIntro: string;
    trouble: FaqItem[];

    uninstallHeading: string;
    uninstallWindows: string;
    uninstallMacos: string;

    helpHeading: string;
    helpBody: string;
    helpCta: string;
  };

  terms: {
    intro: string;
    updated: string;
    passages: Passage[];
  };

  contact: {
    intro: string;
    emailHeading: string;
    emailBody: string;
    emailCta: string;
    checklistHeading: string;
    checklistIntro: string;
    checklist: string[];
    responseHeading: string;
    responseBody: string;
    noFormHeading: string;
    noFormBody: string;
  };

  notFound: {
    title: string;
    heading: string;
    body: string;
    cta: string;
  };
}
