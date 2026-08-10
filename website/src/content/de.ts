import type { SiteContent } from "./types";

/**
 * Every user-visible string on the site.
 *
 * German is the primary language. To add English later, create `en.ts`
 * implementing `SiteContent` and switch the export in `content/index.ts` —
 * no component needs to change. There is deliberately no half-built language
 * switcher in the UI until a second translation actually exists.
 */
export const de: SiteContent = {
  meta: {
    skipToContent: "Zum Hauptinhalt springen",
  },

  header: {
    homeLabel: "Veytaro — zur Startseite",
    downloadNav: "Download",
  },

  hero: {
    eyebrow: "Offizieller Download",
    headingLead: "Football-Manager-Spielstände",
    headingAccent: "verlässlich auslesen",
    description:
      "Veytaro ist eine Desktop-Anwendung für Windows und macOS. Sie öffnet deinen Football-Manager-26-Spielstand, erkennt den verwalteten Verein, den aktuellen Wettbewerb und die Saison — und schreibt dabei nie in die Datei zurück.",
    markAlt: "Veytaro Logo",
    screenshotAlt: "Die Veytaro-Anwendung unter Windows",
    primaryHint: "Für dein System empfohlen",
    platformNote: "Verfügbar für Windows 10/11 und macOS.",
  },

  downloads: {
    id: "download",
    heading: "Veytaro herunterladen",
    description:
      "Wähle die Version für dein Betriebssystem. Beide Installationsdateien enthalten die vollständige Anwendung.",
    versionLabel: "Version",
    sizeLabel: "Größe",
    sizeUnknown: "wird mit dem Release ergänzt",
    checksumLabel: "SHA-256",
    checksumUnknown: "wird mit dem Release veröffentlicht",
    downloadCta: "Herunterladen",
    unavailableCta: "Noch nicht verfügbar",
    unavailableNote:
      "Diese Installationsdatei wurde noch nicht veröffentlicht. Sobald der Release-Build erstellt ist, wird der Download hier aktiv.",
    recommendedBadge: "Empfohlen für dich",
    platforms: {
      windows: {
        name: "Veytaro für Windows",
        requirement: "Windows 10 / 11",
        architecture: "64-Bit (x64)",
      },
      macos: {
        name: "Veytaro für macOS",
        requirement: "macOS 11 oder neuer",
        architecture: "Universal — Apple Silicon und Intel",
      },
    },
  },

  features: {
    id: "funktionen",
    heading: "Was Veytaro heute kann",
    description:
      "Drei Funktionen, die in der aktuellen Version vollständig arbeiten.",
    items: [
      {
        icon: "save",
        title: "Spielstand einlesen",
        body: "Veytaro öffnet .fm-Dateien aus Football Manager 26 und ermittelt den von dir verwalteten Verein, den aktuellen Wettbewerb und die Saison direkt aus dem Spielstand — ohne manuelle Eingabe.",
      },
      {
        icon: "shield",
        title: "Ausschließlich lesend",
        body: "Spielstände werden nur zum Lesen geöffnet. Dateigröße, Änderungsdatum und Prüfsumme bleiben unverändert; die Anwendung prüft das in ihrer eigenen Testsuite bei jedem Build.",
      },
      {
        icon: "table",
        title: "Kaderdaten importieren",
        body: "Kaderlisten als CSV- oder JSON-Datei importieren, in einer sortierbaren Tabelle ansehen und filtern — als Ergänzung zu den Daten aus dem Spielstand.",
      },
    ],
  },

  installation: {
    id: "installation",
    heading: "Installation",
    description: "In wenigen Schritten einsatzbereit.",
    windows: {
      title: "Windows",
      steps: [
        "Lade die Datei mit der Endung .exe herunter.",
        "Öffne die heruntergeladene Datei per Doppelklick.",
        "Folge dem Installationsassistenten. Veytaro wird für dein Benutzerkonto installiert und benötigt keine Administratorrechte.",
        "Starte Veytaro anschließend über das Startmenü.",
      ],
      securityNote:
        "Da die Installationsdatei noch nicht signiert ist, zeigt Windows möglicherweise die Meldung „Der Computer wurde durch Windows geschützt“. Wähle dort „Weitere Informationen“ und anschließend „Trotzdem ausführen“.",
    },
    macos: {
      title: "macOS",
      steps: [
        "Lade die Datei mit der Endung .dmg herunter.",
        "Öffne die .dmg-Datei per Doppelklick.",
        "Ziehe Veytaro im geöffneten Fenster in den Ordner „Programme“.",
        "Starte Veytaro aus dem Ordner „Programme“ oder über das Launchpad.",
      ],
      securityNote:
        "Da die Anwendung noch nicht signiert und notarisiert ist, meldet macOS beim ersten Start, dass die Entwickler:in nicht überprüft werden konnte. Öffne in diesem Fall „Systemeinstellungen“ → „Datenschutz & Sicherheit“ und bestätige dort „Trotzdem öffnen“.",
    },
  },

  requirements: {
    id: "systemvoraussetzungen",
    heading: "Systemvoraussetzungen",
    description:
      "Die Angaben stammen aus der Build-Konfiguration der Anwendung.",
    diskLabel: "Speicherplatz",
    diskUnknown:
      "Der genaue Platzbedarf wird mit der ersten Veröffentlichung ergänzt.",
    diskValue: (installer: string) =>
      `Installationsdatei ${installer}, zuzüglich Platz für die installierte Anwendung.`,
    windows: {
      title: "Windows",
      rows: [
        ["Betriebssystem", "Windows 10 oder Windows 11"],
        ["Architektur", "64-Bit (x64)"],
        [
          "Weitere Komponenten",
          "Microsoft Edge WebView2 — falls nicht vorhanden, wird es vom Installationsprogramm automatisch nachinstalliert.",
        ],
      ],
    },
    macos: {
      title: "macOS",
      rows: [
        ["Betriebssystem", "macOS 11 (Big Sur) oder neuer"],
        ["Architektur", "Apple Silicon (arm64) und Intel (x86_64)"],
        ["Weitere Komponenten", "Keine — die Anwendung nutzt das System-WebKit."],
      ],
    },
  },

  faq: {
    id: "faq",
    heading: "Häufige Fragen",
    items: [
      {
        q: "Welche Version soll ich herunterladen?",
        a: "Nutze auf einem Windows-PC die .exe-Datei und auf einem Mac die .dmg-Datei. Die Seite hebt die passende Version für dein System automatisch hervor; beide bleiben jederzeit auswählbar.",
      },
      {
        q: "Unterstützt Veytaro Windows 10 und Windows 11?",
        a: "Ja. Veytaro läuft auf Windows 10 und Windows 11 in der 64-Bit-Version. Eine 32-Bit-Fassung wird nicht angeboten.",
      },
      {
        q: "Funktioniert Veytaro auf Apple Silicon und Intel Macs?",
        a: "Ja. Die macOS-Datei ist ein Universal-Build und läuft nativ auf Apple Silicon (M1 und neuer) sowie auf Intel-Macs. Vorausgesetzt wird macOS 11 (Big Sur) oder neuer — diese Grenze ergibt sich aus der Apple-Silicon-Hälfte des Universal-Builds.",
      },
      {
        q: "Warum zeigt Windows oder macOS eine Sicherheitswarnung?",
        a: "Die Installationsdateien sind derzeit nicht mit einem Entwicklerzertifikat signiert. Windows SmartScreen und macOS Gatekeeper warnen deshalb bei unbekannten Anwendungen. Wie du die Installation trotzdem bestätigst, steht im Abschnitt „Installation“.",
      },
      {
        q: "Wo finde ich die heruntergeladene Installationsdatei?",
        a: "In der Regel im Ordner „Downloads“ deines Benutzerkontos. Alternativ öffnest du die Download-Liste deines Browsers — unter Windows und macOS meist mit Strg+J beziehungsweise Cmd+Umschalt+J.",
      },
      {
        q: "Verändert Veytaro meinen Spielstand?",
        a: "Nein. Spielstände werden ausschließlich zum Lesen geöffnet. Veytaro schreibt weder in die .fm-Datei noch benennt es sie um; eigene Projektdaten legt die Anwendung in separaten Dateien ab.",
      },
    ],
  },

  footer: {
    tagline: "Football Manager Assistant für Windows und macOS.",
    availability: "Verfügbar für Windows 10/11 und macOS 11+",
    copyright: (year: number) => `© ${year} Veytaro`,
    markAlt: "Veytaro",
    links: {
      imprint: "Impressum",
      privacy: "Datenschutz",
      support: "Support",
    },
  },

  notFound: {
    title: "Seite nicht gefunden",
    heading: "Diese Seite gibt es nicht.",
    body: "Die aufgerufene Adresse existiert nicht oder wurde verschoben.",
    cta: "Zur Startseite",
  },
};
