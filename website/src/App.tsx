import { useEffect, useState } from "react";
import { Downloads } from "./components/Downloads";
import { Faq } from "./components/Faq";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Installation } from "./components/Installation";
import { Requirements } from "./components/Requirements";
import { content } from "./content";
import { detectCurrentOs, type DetectedOs } from "./lib/osDetection";

export function App() {
  /**
   * Starts as "unknown" so the first paint shows both platforms equally, then
   * narrows once the client has been read. Detection only re-orders emphasis;
   * it never hides a platform and never triggers a download.
   */
  const [os, setOs] = useState<DetectedOs>("unknown");

  useEffect(() => {
    setOs(detectCurrentOs());
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        {content.meta.skipToContent}
      </a>

      <Header />

      <main id="main">
        <Hero os={os} />
        <Downloads os={os} />
        <Features />
        <Installation />
        <Requirements />
        <Faq />
      </main>

      <Footer />
    </>
  );
}
