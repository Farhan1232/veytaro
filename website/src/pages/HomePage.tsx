import { CtaBand } from "../components/CtaBand";
import { Downloads } from "../components/Downloads";
import { Faq } from "../components/Faq";
import { Features } from "../components/Features";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Security } from "../components/Security";
import type { DetectedOs } from "../lib/osDetection";

/**
 * Section order follows the question a visitor actually asks, in order: what is
 * this, what does it do, how does it work, where do I get it, is it safe, and
 * what about the rest.
 *
 * Backgrounds alternate section by section, so each block reads as its own
 * band without needing a divider.
 */
export function HomePage({ os }: { os: DetectedOs }) {
  return (
    <>
      <Hero os={os} />
      <Features />
      <HowItWorks />
      <Downloads os={os} />
      <Security />
      <Faq />
      <CtaBand />
    </>
  );
}
