import type { SiteContent } from "./types";

/**
 * Every user-visible string on the site, in German.
 *
 * Two rules govern the wording here:
 *
 * 1. Only claims the application actually supports. The copy was written
 *    against the app's own German UI strings and its README, not against
 *    marketing wishes. Nothing promises a feature that is not shipped in 0.1.0.
 * 2. No invented facts. There are no download counts, no testimonials, no
 *    ratings, no company details and no claim that the installers are signed —
 *    they are not.
 *
 * Release facts (version, size, checksum) are never written here. They are read
 * from `config/releases.ts` at render time.
 */
export const de: SiteContent = {
  meta: {
    skipToContent: "Zum Inhalt springen",
    titleSuffix: "Veytaro",
  },

  theme: {
    toLight: "Zu hellem Design wechseln",
    toDark: "Zu dunklem Design wechseln",
  },

  nav: {
    homeLabel: "Veytaro — zur Startseite",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    menuLabel: "Hauptnavigation",
    downloadCta: "Herunterladen",
  },

  hero: {
    eyebrow: "Desktop-Anwendung für Windows und macOS",
    headingLead: "Dein Spielstand.",
    headingAccent: "Klar analysiert.",
    description:
      "Veytaro öffnet deinen Football-Manager-Spielstand lesend und zeigt dir auf einen Blick, welchen Verein du verwaltest, in welchem Wettbewerb du spielst und in welcher Saison du dich befindest. Die Auswertung läuft vollständig auf deinem Rechner.",
    primaryCta: "Veytaro herunterladen",
    secondaryCta: "So funktioniert es",
    markAlt: "Veytaro",
    illustrationAlt:
      "Stilisierte Darstellung eines Spielfelds mit einer Taktikaufstellung und einer daneben liegenden Auswertungskarte, die Verein, Wettbewerb und Saison zeigt.",
    assurances: [
      "Spielstände werden ausschließlich gelesen",
      "Auswertung läuft lokal auf deinem Gerät",
      "Kein Konto erforderlich für den Download",
    ],
    platformNote: "Verfügbar für Windows 10/11 (64 Bit) und macOS 11 oder neuer.",
  },

  features: {
    id: "funktionen",
    eyebrow: "Funktionen",
    heading: "Was Veytaro aus deinem Spielstand liest",
    description:
      "Veytaro konzentriert sich auf die Angaben, die man beim Wechsel zwischen mehreren Spielständen am häufigsten sucht — und lässt alles weg, was es nicht zuverlässig bestimmen kann.",
    items: [
      {
        icon: "save",
        title: "Spielstand öffnen",
        body: "Öffne eine unterstützte .fm-Datei über „Datei → FM-Spielstand öffnen …“. Veytaro liest die Datei aus und zeigt die erkannten Angaben in der Übersicht an.",
      },
      {
        icon: "trophy",
        title: "Verein und Wettbewerb",
        body: "Veytaro folgt dem Weg vom menschlichen Manager über den verwalteten Verein bis zum aktuellen Hauptwettbewerb und zeigt beide Namen an — nicht nur interne Kennungen.",
      },
      {
        icon: "table",
        title: "Saison und Spieldatum",
        body: "Die laufende Saison und das Datum im Spiel werden mit angezeigt, damit du mehrere Spielstände auseinanderhalten kannst, ohne sie im Spiel zu laden.",
      },
      {
        icon: "shield",
        title: "Schreibgeschützt",
        body: "Spielstände werden ausschließlich zum Lesen geöffnet. Veytaro schreibt nicht in deine Dateien, benennt sie nicht um und kürzt sie nicht.",
      },
      {
        icon: "laptop",
        title: "Läuft lokal",
        body: "Die Auswertung findet auf deinem Rechner statt. Vollständige Spielstanddateien werden nicht hochgeladen.",
      },
      {
        icon: "lock",
        title: "Ohne Konto nutzbar",
        body: "Für Download und Installation ist keine Registrierung nötig. Es gibt auf dieser Seite weder Tracking noch Werbung noch Cookies.",
      },
    ],
  },

  howItWorks: {
    id: "ablauf",
    eyebrow: "In vier Schritten",
    heading: "So funktioniert Veytaro",
    description:
      "Vom Download bis zur ersten Auswertung sind es vier Schritte. Für keinen davon brauchst du ein Konto.",
    steps: [
      {
        title: "Herunterladen",
        body: "Lade das Installationsprogramm für dein Betriebssystem. Veytaro erkennt dein System und hebt die passende Variante hervor — beide bleiben jederzeit auswählbar.",
      },
      {
        title: "Prüfsumme vergleichen",
        body: "Bilde den SHA-256-Wert der geladenen Datei und vergleiche ihn mit dem hier angegebenen Wert. Stimmen beide überein, ist die Datei unverändert bei dir angekommen.",
      },
      {
        title: "Installieren und starten",
        body: "Führe das Installationsprogramm aus und starte Veytaro. Da die Programme nicht signiert sind, zeigen Windows und macOS beim ersten Start einen Sicherheitshinweis.",
      },
      {
        title: "Spielstand öffnen",
        body: "Wähle im Menü „Datei → FM-Spielstand öffnen …“ und suche deine .fm-Datei aus. Verein, Wettbewerb, Saison und Manager erscheinen anschließend in der Übersicht.",
      },
    ],
    footnote:
      "Die ausführliche Anleitung inklusive der genauen Befehle für die Prüfsumme steht in der Dokumentation.",
  },

  downloads: {
    id: "download",
    eyebrow: "Download",
    heading: "Veytaro herunterladen",
    description:
      "Beide Installationsprogramme stammen aus demselben Release. Zu jeder Datei stehen Größe und vollständige SHA-256-Prüfsumme, damit du den Download überprüfen kannst.",
    versionLabel: "Version",
    architectureLabel: "Architektur",
    sizeLabel: "Größe",
    sizeUnknown: "Unbekannt",
    checksumLabel: "SHA-256",
    checksumUnknown: "Noch nicht verfügbar",
    checksumCopy: "Kopieren",
    checksumCopied: "Kopiert",
    checksumCopyFailed: "Kopieren nicht möglich",
    checksumCopyLabel: (platform) => `SHA-256-Prüfsumme für ${platform} kopieren`,
    downloadCta: "Herunterladen",
    unavailableCta: "Nicht verfügbar",
    unavailableNote:
      "Für diese Plattform gibt es in dieser Version noch kein Installationsprogramm.",
    recommendedBadge: "Für dein System",
    signingLabel: "Signatur",
    signingUnsigned: "Nicht signiert",
    otherPlatformsHint:
      "Du nutzt ein anderes System? Beide Downloads stehen unabhängig von der Erkennung zur Verfügung.",
    mobileNote:
      "Veytaro ist eine Desktop-Anwendung. Auf einem Smartphone oder Tablet lässt sie sich nicht installieren — öffne diese Seite an einem Windows- oder macOS-Rechner.",
    platforms: {
      windows: {
        name: "Windows",
        requirement: "Windows 10 oder 11",
        architecture: "64 Bit (x64)",
      },
      macos: {
        name: "macOS",
        requirement: "macOS 11 oder neuer",
        architecture: "Apple Silicon und Intel",
      },
    },
  },

  security: {
    id: "sicherheit",
    eyebrow: "Sicherheit",
    heading: "Warum die Prüfsumme wichtig ist",
    description:
      "Eine SHA-256-Prüfsumme ist ein Fingerabdruck einer Datei. Ändert sich auch nur ein einziges Byte, ändert sich der Wert vollständig. Der Vergleich zeigt dir also, ob die heruntergeladene Datei exakt die ist, die hier veröffentlicht wurde.",
    points: [
      {
        icon: "shield",
        title: "Unverändert angekommen",
        body: "Stimmt die Prüfsumme überein, wurde die Datei auf dem Weg zu dir nicht verändert und der Download ist nicht abgebrochen.",
      },
      {
        icon: "save",
        title: "Deine Spielstände bleiben unberührt",
        body: "Veytaro öffnet .fm-Dateien ausschließlich lesend. Es schreibt nicht zurück, benennt nichts um und legt keine veränderten Kopien an.",
      },
      {
        icon: "laptop",
        title: "Verarbeitung auf deinem Gerät",
        body: "Das Auslesen des Spielstands passiert lokal. Vollständige Spielstanddateien werden nicht hochgeladen.",
      },
    ],
    verifyHeading: "Prüfsumme selbst bilden",
    verifyIntro:
      "Führe den Befehl für dein System im Ordner mit der heruntergeladenen Datei aus und vergleiche das Ergebnis mit dem Wert in der Download-Karte.",
    windowsLabel: "Windows (PowerShell)",
    macosLabel: "macOS (Terminal)",
    verifyOutro:
      "Weichen die Werte voneinander ab, lösche die Datei und lade sie erneut. Bleibt der Unterschied bestehen, melde dich bitte per E-Mail, bevor du das Programm ausführst.",
    unsignedHeading: "Die Installationsprogramme sind nicht signiert",
    unsignedBody:
      "Veytaro besitzt derzeit weder ein Windows-Code-Signing-Zertifikat noch eine Apple-Notarisierung. Deshalb warnen Windows SmartScreen und macOS Gatekeeper beim ersten Start. Das ist bei unsignierten Programmen normal und sagt nichts über den Inhalt der Datei aus — die Prüfsumme ist an dieser Stelle dein eigentliches Kontrollmittel. Wie du den Start trotzdem bestätigst, steht in der Dokumentation.",
  },

  installation: {
    id: "installation",
    heading: "Installation",
    description:
      "Die Schritte unterscheiden sich je nach Betriebssystem. Beide Wege dauern nur wenige Minuten.",
    windows: {
      title: "Windows 10 und 11",
      steps: [
        "Lade die Datei mit der Endung .exe herunter und vergleiche die SHA-256-Prüfsumme.",
        "Starte das Installationsprogramm mit einem Doppelklick.",
        "Windows SmartScreen meldet einen unbekannten Herausgeber. Wähle „Weitere Informationen“ und anschließend „Trotzdem ausführen“.",
        "Folge dem Installationsassistenten. Fehlt die WebView2-Laufzeit auf deinem System, wird sie dabei automatisch mitinstalliert.",
        "Starte Veytaro über das Startmenü.",
      ],
      securityNote:
        "Der SmartScreen-Hinweis erscheint, weil das Programm nicht signiert ist. Prüfe deshalb vorher die Prüfsumme.",
    },
    macos: {
      title: "macOS 11 oder neuer",
      steps: [
        "Lade die Datei mit der Endung .dmg herunter und vergleiche die SHA-256-Prüfsumme.",
        "Öffne das Abbild per Doppelklick und ziehe Veytaro in den Ordner „Programme“.",
        "Öffne Veytaro beim ersten Mal mit einem Rechtsklick und wähle „Öffnen“. Bestätige die Rückfrage anschließend erneut mit „Öffnen“.",
        "Erscheint stattdessen die Meldung, das Programm sei beschädigt, öffne die Systemeinstellungen unter „Datenschutz & Sicherheit“ und wähle dort „Dennoch öffnen“.",
        "Ab dem zweiten Start genügt ein normaler Doppelklick.",
      ],
      securityNote:
        "Der Umweg über den Rechtsklick ist nötig, weil das Programm nicht notarisiert ist. Zusätzliche Komponenten werden auf macOS nicht installiert.",
    },
  },

  requirements: {
    id: "systemvoraussetzungen",
    heading: "Systemvoraussetzungen",
    description:
      "Veytaro ist eine schlanke Desktop-Anwendung und stellt keine besonderen Anforderungen an die Hardware.",
    diskLabel: "Speicherplatz",
    diskUnknown: "Wenige Megabyte",
    diskValue: (installerSize) => `Installationsprogramm ${installerSize}, zuzüglich Programmdateien`,
    windows: {
      title: "Windows",
      rows: [
        ["Betriebssystem", "Windows 10 oder Windows 11"],
        ["Architektur", "64 Bit (x64)"],
        ["Zusätzliche Komponenten", "WebView2-Laufzeit — wird bei Bedarf mitinstalliert"],
      ],
    },
    macos: {
      title: "macOS",
      rows: [
        ["Betriebssystem", "macOS 11 (Big Sur) oder neuer"],
        ["Architektur", "Universal — Apple Silicon und Intel"],
        ["Zusätzliche Komponenten", "Keine — Veytaro nutzt die im System enthaltene WebKit-Engine"],
      ],
    },
  },

  faq: {
    id: "faq",
    eyebrow: "Häufige Fragen",
    heading: "Fragen und Antworten",
    description:
      "Die Punkte, nach denen vor dem ersten Download am häufigsten gefragt wird.",
    items: [
      {
        q: "Verändert Veytaro meine Spielstände?",
        a: "Nein. Spielstände werden ausschließlich lesend geöffnet. Veytaro schreibt nicht in die Datei, benennt sie nicht um und kürzt sie nicht.",
      },
      {
        q: "Werden meine Spielstände irgendwohin hochgeladen?",
        a: "Nein. Das Auslesen findet lokal auf deinem Rechner statt. Vollständige Spielstanddateien werden nicht hochgeladen.",
      },
      {
        q: "Warum warnt Windows oder macOS beim ersten Start?",
        a: "Weil die Installationsprogramme nicht signiert und nicht notarisiert sind. Beide Systeme zeigen diesen Hinweis bei jedem unsignierten Programm. Die veröffentlichte SHA-256-Prüfsumme ist deshalb die zuverlässigste Möglichkeit, den Download zu überprüfen; die nötigen Schritte stehen in der Dokumentation.",
      },
      {
        q: "Brauche ich ein Konto?",
        a: "Für Download und Installation nicht. Die Installationsprogramme lassen sich direkt von dieser Seite laden.",
      },
      {
        q: "Welche Spielstände werden unterstützt?",
        a: "Veytaro liest unterstützte .fm-Dateien. Da sich das Dateiformat zwischen Spielversionen unterscheiden kann, lässt sich nicht jeder Spielstand auswerten. Lässt sich deiner nicht öffnen, schreib uns bitte kurz, welche Spielversion du nutzt.",
      },
      {
        q: "Kostet Veytaro etwas?",
        a: "Der Download auf dieser Seite ist kostenlos. Veytaro ist eine frühe Version (0.1.0); Funktionsumfang und Verfügbarkeit können sich noch ändern.",
      },
      {
        q: "Gibt es eine Version für Linux oder für das Smartphone?",
        a: "Derzeit nicht. Veröffentlicht sind ausschließlich die Fassungen für Windows und macOS, die auf dieser Seite stehen.",
      },
      {
        q: "Steht Veytaro mit Sports Interactive oder SEGA in Verbindung?",
        a: "Nein. Veytaro ist ein eigenständiges Projekt und wird weder von Sports Interactive noch von SEGA herausgegeben, unterstützt oder geprüft.",
      },
    ],
  },

  cta: {
    heading: "Bereit für den ersten Spielstand?",
    body: "Lade Veytaro für Windows oder macOS, vergleiche die Prüfsumme und öffne deinen Spielstand.",
    primary: "Zum Download",
    secondary: "Dokumentation lesen",
  },

  footer: {
    tagline: "Dein Spielstand. Klar analysiert.",
    availability: "Für Windows 10/11 und macOS 11 oder neuer.",
    copyright: (year) => `© ${year} Veytaro`,
    markAlt: "Veytaro",
    navHeading: "Seiten",
    supportHeading: "Support",
    supportBody: "Fragen, Fehlerberichte und Rückmeldungen per E-Mail:",
    legalHeading: "Rechtliches",
    links: {
      terms: "Nutzungsbedingungen",
      imprint: "Impressum",
      privacy: "Datenschutz",
    },
    trademark:
      "Football Manager ist eine Marke von Sports Interactive Limited. Alle genannten Marken gehören ihren jeweiligen Inhabern.",
    noAffiliation:
      "Veytaro ist ein unabhängiges Projekt und steht in keiner Verbindung zu Sports Interactive oder SEGA.",
  },

  about: {
    intro:
      "Veytaro ist eine kleine Desktop-Anwendung für Windows und macOS, die einen Football-Manager-Spielstand öffnet und die wichtigsten Eckdaten daraus sichtbar macht — ohne dass du das Spiel dafür starten musst.",
    passages: [
      {
        heading: "Warum es Veytaro gibt",
        paragraphs: [
          "Wer über längere Zeit mehrere Karrieren parallel spielt, sammelt schnell einen Ordner voller Spielstände an, deren Dateinamen wenig verraten. Welcher Stand gehört zu welchem Verein? In welcher Saison steckt er? Um das herauszufinden, muss man den Spielstand normalerweise im Spiel laden — und das dauert.",
          "Veytaro beantwortet genau diese Frage: Spielstand öffnen, Verein, Wettbewerb und Saison ablesen, weiterarbeiten. Mehr will die Anwendung in ihrer jetzigen Fassung nicht leisten.",
        ],
      },
      {
        heading: "Wie das Auslesen funktioniert",
        paragraphs: [
          "Veytaro öffnet die ausgewählte .fm-Datei schreibgeschützt und sucht darin den menschlichen Manager. Von dort folgt es der Verknüpfung zum verwalteten Verein und weiter zum aktuellen Hauptwettbewerb. Aus denselben Daten stammen die laufende Saison und das Datum im Spiel.",
          "Gelingt ein Schritt dieser Kette nicht — etwa weil ein Spielstand aus einer nicht unterstützten Spielversion stammt —, zeigt Veytaro das offen an, statt einen Wert zu erfinden.",
        ],
      },
      {
        heading: "Umgang mit deinen Daten",
        paragraphs: [
          "Die Auswertung läuft vollständig auf deinem Rechner. Vollständige Spielstanddateien werden nicht hochgeladen.",
          "Diese Website selbst setzt keine Cookies, bindet keine Werbung ein und lädt keine Ressourcen von fremden Servern. Schriften und Bilder liegen auf demselben Server wie die Seite.",
        ],
      },
    ],
    audienceHeading: "Für wen Veytaro gedacht ist",
    audience: [
      {
        icon: "save",
        title: "Für Sammler vieler Spielstände",
        body: "Wenn mehrere Karrieren parallel laufen, ersetzt ein kurzer Blick in Veytaro das Laden im Spiel.",
      },
      {
        icon: "trophy",
        title: "Für lange Karrieren",
        body: "Saison und Spieldatum machen sofort erkennbar, wie weit ein älterer Spielstand fortgeschritten ist.",
      },
      {
        icon: "shield",
        title: "Für vorsichtige Nutzer",
        body: "Der Zugriff erfolgt ausschließlich lesend, und zu jedem Download steht die vollständige Prüfsumme.",
      },
    ],
    limitsHeading: "Was Veytaro nicht tut",
    limits: [
      "Es verändert, repariert oder konvertiert keine Spielstände.",
      "Es greift nicht in ein laufendes Spiel ein und beeinflusst keine Ergebnisse.",
      "Es lädt keine vollständigen Spielstanddateien hoch.",
      "Es ist kein Produkt von Sports Interactive oder SEGA und wird von dort weder unterstützt noch geprüft.",
    ],
  },

  docs: {
    intro:
      "Diese Seite begleitet dich von der Installation bis zum ersten ausgewerteten Spielstand: Systemvoraussetzungen, die Schritte für Windows und macOS, die Kontrolle der Prüfsumme und Lösungen für die häufigsten Stolpersteine.",
    tocHeading: "Auf dieser Seite",
    sections: [
      { id: "ueberblick", label: "Überblick" },
      { id: "systemvoraussetzungen", label: "Systemvoraussetzungen" },
      { id: "installation", label: "Installation" },
      { id: "pruefsumme", label: "Prüfsumme kontrollieren" },
      { id: "erste-schritte", label: "Ersten Spielstand öffnen" },
      { id: "fehlerbehebung", label: "Fehlerbehebung" },
      { id: "deinstallation", label: "Deinstallation" },
      { id: "hilfe", label: "Weitere Hilfe" },
    ],

    overviewHeading: "Überblick",
    overviewBody: [
      "Veytaro ist eine Desktop-Anwendung für Windows und macOS. Sie öffnet einen unterstützten Football-Manager-Spielstand, liest ihn aus und zeigt die wichtigsten Eckdaten an: den verwalteten Verein, den aktuellen Wettbewerb, die Saison, das Datum im Spiel und den Namen des Managers.",
      "Der Zugriff erfolgt ausschließlich lesend. Die Auswertung läuft vollständig auf deinem Rechner; vollständige Spielstanddateien werden nicht hochgeladen.",
    ],
    overviewPoints: [
      {
        icon: "laptop",
        title: "Lokal",
        body: "Die Auswertung findet auf deinem Gerät statt. Es ist kein Konto und keine Internetverbindung nötig, um einen Spielstand zu öffnen.",
      },
      {
        icon: "shield",
        title: "Schreibgeschützt",
        body: "Spielstände werden nur gelesen. Veytaro schreibt nicht zurück, benennt nichts um und kürzt keine Datei.",
      },
      {
        icon: "lock",
        title: "Nicht signiert",
        body: "Die Installationsprogramme sind weder signiert noch notarisiert. Beim ersten Start erscheint deshalb ein Sicherheitshinweis des Betriebssystems.",
      },
    ],

    requirementsHeading: "Systemvoraussetzungen",
    installHeading: "Installation",
    installIntro:
      "Die Schritte unterscheiden sich je nach Betriebssystem. Beide Wege dauern nur wenige Minuten. Kontrolliere vor der Ausführung die Prüfsumme der heruntergeladenen Datei.",

    unsignedNote: {
      title: "Die Installationsprogramme sind nicht signiert",
      body: "Veytaro besitzt derzeit weder ein Windows-Code-Signing-Zertifikat noch eine Apple-Notarisierung. Deshalb warnen Windows SmartScreen und macOS Gatekeeper beim ersten Start. Das ist bei unsignierten Programmen normal und sagt nichts über den Inhalt der Datei aus. Die Schritte oben zeigen, wie du den Start bestätigst — vergleiche vorher die Prüfsumme.",
    },

    checksumHeading: "Prüfsumme kontrollieren",
    checksumIntro:
      "Eine SHA-256-Prüfsumme ist ein Fingerabdruck einer Datei: Ändert sich auch nur ein einziges Byte, ändert sich der Wert vollständig. Führe den Befehl für dein System in dem Ordner aus, in dem die heruntergeladene Datei liegt, und vergleiche das Ergebnis mit dem hier angegebenen Wert. Groß- und Kleinschreibung darfst du dabei ignorieren.",
    copyCommandLabel: (platform) => `Befehl für ${platform} kopieren`,
    checksumExpected: "Erwarteter Wert",
    checksumMismatch: {
      title: "Wenn die Werte nicht übereinstimmen",
      body: "Lösche die Datei und lade sie erneut — meistens war der Download unvollständig. Bleibt der Unterschied bestehen, führe das Programm nicht aus und melde dich per E-Mail.",
    },

    usageHeading: "Ersten Spielstand öffnen",
    usageIntro: "Nach der Installation sind es drei Schritte bis zur Auswertung.",
    usageSteps: [
      {
        title: "Veytaro starten",
        body: "Starte die Anwendung über das Startmenü (Windows) oder aus dem Ordner „Programme“ (macOS).",
      },
      {
        title: "Spielstand auswählen",
        body: "Wähle im Menü „Datei → FM-Spielstand öffnen …“ und suche die gewünschte .fm-Datei aus. Alternativ kannst du die Schaltfläche in der Übersicht verwenden.",
      },
      {
        title: "Ergebnis ablesen",
        body: "Veytaro zeigt Manager, verwalteten Verein, aktuellen Wettbewerb, Saison und Datum im Spiel an. Lässt sich ein Wert nicht bestimmen, wird das ausdrücklich vermerkt.",
      },
    ],
    usageNote: {
      title: "Dein Spielstand bleibt unverändert",
      body: "Die Datei wird ausschließlich gelesen. Du kannst denselben Spielstand parallel im Spiel weiterverwenden.",
    },

    troubleHeading: "Fehlerbehebung",
    troubleIntro:
      "Wenn etwas nicht wie beschrieben funktioniert, hilft meistens einer dieser Punkte.",
    trouble: [
      {
        q: "Windows blockiert den Start („Der Computer wurde durch Windows geschützt“)",
        a: "Das ist der SmartScreen-Hinweis für unsignierte Programme. Wähle „Weitere Informationen“ und anschließend „Trotzdem ausführen“. Vergleiche vorher die SHA-256-Prüfsumme der Datei.",
      },
      {
        q: "macOS meldet, das Programm stamme von einem nicht verifizierten Entwickler",
        a: "Klicke Veytaro im Ordner „Programme“ mit der rechten Maustaste an und wähle „Öffnen“; bestätige die Rückfrage mit „Öffnen“. Diesen Umweg brauchst du nur beim ersten Start.",
      },
      {
        q: "macOS meldet, das Programm sei beschädigt",
        a: "Diese Meldung erscheint bei heruntergeladenen Programmen ohne Notarisierung. Öffne die Systemeinstellungen unter „Datenschutz & Sicherheit“; dort steht direkt nach dem Startversuch die Schaltfläche „Dennoch öffnen“.",
      },
      {
        q: "Die Prüfsummen stimmen nicht überein",
        a: "Lade die Datei erneut — meistens war der Download unvollständig. Weicht der Wert danach immer noch ab, führe das Programm nicht aus und melde dich per E-Mail.",
      },
      {
        q: "Der Spielstand lässt sich nicht öffnen",
        a: "Prüfe zuerst, ob es sich um eine .fm-Datei handelt und ob sie vollständig gespeichert wurde. Das Dateiformat unterscheidet sich zwischen Spielversionen, daher kann nicht jeder Spielstand ausgewertet werden. Schreib uns in dem Fall bitte, welche Spielversion du verwendest.",
      },
      {
        q: "Verein oder Wettbewerb werden als unbekannt angezeigt",
        a: "Dann konnte Veytaro die Verknüpfung im Spielstand nicht auflösen. Das kommt bei ungewöhnlichen Spielständen vor, etwa ohne aktiven menschlichen Manager. Eine kurze Beschreibung per E-Mail hilft dabei, solche Fälle zu ergänzen.",
      },
    ],

    uninstallHeading: "Deinstallation",
    uninstallWindows:
      "Windows: Öffne „Einstellungen → Apps → Installierte Apps“, suche Veytaro und wähle „Deinstallieren“.",
    uninstallMacos:
      "macOS: Ziehe Veytaro aus dem Ordner „Programme“ in den Papierkorb.",

    helpHeading: "Weitere Hilfe",
    helpBody:
      "Wenn dich keiner der Punkte weiterbringt, schreib uns. Hilfreich sind dein Betriebssystem, die verwendete Veytaro-Version und der genaue Wortlaut der Meldung.",
    helpCta: "Zum Kontakt",
  },

  terms: {
    intro:
      "Diese Bedingungen gelten für die Nutzung der Desktop-Anwendung Veytaro und der von dieser Website angebotenen Installationsprogramme.",
    updated: "Stand dieser Fassung: Version 0.1.0.",
    passages: [
      {
        heading: "1. Gegenstand",
        paragraphs: [
          "Veytaro ist eine Desktop-Anwendung, die unterstützte Football-Manager-Spielstände lesend auswertet und daraus den verwalteten Verein, den aktuellen Wettbewerb, die Saison und das Datum im Spiel ermittelt.",
          "Die Nutzung der Anwendung ist im Rahmen dieser Bedingungen unentgeltlich gestattet.",
        ],
      },
      {
        heading: "2. Zulässige Nutzung",
        paragraphs: [
          "Du darfst Veytaro für eigene, private Zwecke installieren und verwenden. Untersagt sind insbesondere:",
        ],
        bullets: [
          "Das Weiterverbreiten veränderter Fassungen der Installationsprogramme",
          "Das Anbieten der Anwendung als eigenes Produkt oder unter anderem Namen",
          "Der Einsatz zu Zwecken, die gegen geltendes Recht oder gegen die Nutzungsbedingungen des Spiels verstoßen",
        ],
      },
      {
        heading: "3. Keine Signierung",
        paragraphs: [
          "Die angebotenen Installationsprogramme sind weder mit einem Windows-Code-Signing-Zertifikat signiert noch von Apple notarisiert. Windows und macOS zeigen deshalb beim ersten Start eine Sicherheitswarnung an.",
          "Zu jedem Installationsprogramm wird die vollständige SHA-256-Prüfsumme veröffentlicht. Es wird empfohlen, diese vor der Ausführung zu vergleichen.",
        ],
      },
      {
        heading: "4. Umgang mit Daten",
        paragraphs: [
          "Die Auswertung eines Spielstands findet lokal auf dem Gerät der Nutzerin oder des Nutzers statt. Vollständige Spielstanddateien werden nicht hochgeladen.",
          "Diese Website setzt keine Cookies, bindet keine Analyse- oder Werbedienste ein und lädt keine Ressourcen von Servern Dritter.",
        ],
      },
      {
        heading: "5. Gewährleistung und Haftung",
        paragraphs: [
          "Veytaro befindet sich in einer frühen Entwicklungsfassung und wird ohne Zusicherung einer bestimmten Eignung oder Fehlerfreiheit bereitgestellt. Es besteht kein Anspruch auf Verfügbarkeit, Weiterentwicklung oder Unterstützung einer bestimmten Spielversion.",
          "Die Anwendung öffnet Spielstände ausschließlich lesend. Unabhängig davon wird empfohlen, von wichtigen Spielständen regelmäßig Sicherungskopien anzulegen.",
          "Die Haftung für Schäden aus der Nutzung der Anwendung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit gesetzlich zulässig.",
        ],
      },
      {
        heading: "6. Rechte Dritter",
        paragraphs: [
          "Football Manager ist eine Marke von Sports Interactive Limited. Veytaro ist ein unabhängiges Projekt und steht in keiner Verbindung zu Sports Interactive oder SEGA; es wird von dort weder herausgegeben noch unterstützt oder geprüft.",
          "Die Nutzung von Veytaro entbindet nicht von den Bedingungen, die für das Spiel selbst gelten.",
        ],
      },
      {
        heading: "7. Änderungen",
        paragraphs: [
          "Diese Bedingungen können mit einer neuen Version der Anwendung angepasst werden. Maßgeblich ist die zum Zeitpunkt des Downloads auf dieser Seite veröffentlichte Fassung.",
        ],
      },
    ],
  },

  contact: {
    intro:
      "Fragen zur Installation, Fehlerberichte und Rückmeldungen zu Spielständen, die sich nicht auswerten lassen, sind willkommen.",
    emailHeading: "E-Mail",
    emailBody: "Der Support läuft ausschließlich über diese Adresse:",
    emailCta: "E-Mail schreiben",
    checklistHeading: "Das hilft bei einer Anfrage",
    checklistIntro:
      "Je mehr davon in der Nachricht steht, desto eher lässt sich das Problem beim ersten Versuch nachvollziehen:",
    checklist: [
      "Betriebssystem und Version, zum Beispiel „Windows 11“ oder „macOS 14“",
      "Die verwendete Veytaro-Version — sie steht in der Download-Karte auf der Startseite",
      "Die genaue Meldung, die angezeigt wird — am besten als Text oder Bildschirmfoto",
      "Was du zuletzt getan hast, bevor der Fehler aufgetreten ist",
      "Bei Problemen mit einem Spielstand: die verwendete Spielversion",
    ],
    responseHeading: "Antwortzeit",
    responseBody:
      "Veytaro wird als kleines Projekt neben anderen Aufgaben entwickelt. Anfragen werden gelesen und beantwortet, eine feste Reaktionszeit lässt sich aber nicht zusagen.",
    noFormHeading: "Warum es hier kein Formular gibt",
    noFormBody:
      "Diese Website ist eine rein statische Seite ohne Server im Hintergrund, der Nachrichten entgegennehmen könnte. Ein Kontaktformular würde deshalb entweder gar nichts senden oder einen fremden Dienst einbinden — beides wäre schlechter als eine direkte E-Mail.",
  },

  notFound: {
    title: "Seite nicht gefunden",
    heading: "Diese Seite gibt es nicht.",
    body: "Die aufgerufene Adresse existiert nicht oder wurde verschoben.",
    cta: "Zur Startseite",
  },
};
