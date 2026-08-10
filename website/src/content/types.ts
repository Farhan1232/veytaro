/**
 * Shape of a full site translation.
 *
 * Adding a language means adding one file that satisfies this interface —
 * TypeScript then reports any string that was forgotten.
 */

export type FeatureIcon = "save" | "shield" | "table";

export interface FeatureItem {
  icon: FeatureIcon;
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

export interface SiteContent {
  meta: {
    skipToContent: string;
  };
  header: {
    homeLabel: string;
    downloadNav: string;
  };
  hero: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    description: string;
    markAlt: string;
    screenshotAlt: string;
    primaryHint: string;
    platformNote: string;
  };
  downloads: {
    id: string;
    heading: string;
    description: string;
    versionLabel: string;
    sizeLabel: string;
    sizeUnknown: string;
    checksumLabel: string;
    checksumUnknown: string;
    downloadCta: string;
    unavailableCta: string;
    unavailableNote: string;
    recommendedBadge: string;
    platforms: {
      windows: { name: string; requirement: string; architecture: string };
      macos: { name: string; requirement: string; architecture: string };
    };
  };
  features: {
    id: string;
    heading: string;
    description: string;
    items: FeatureItem[];
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
    heading: string;
    items: FaqItem[];
  };
  footer: {
    tagline: string;
    availability: string;
    copyright: (year: number) => string;
    markAlt: string;
    links: {
      imprint: string;
      privacy: string;
      support: string;
    };
  };
  notFound: {
    title: string;
    heading: string;
    body: string;
    cta: string;
  };
}
