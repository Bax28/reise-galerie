// ============================================================================
// ZENTRALE KONFIGURATION
// ============================================================================
// Hier stellst du fast alles ein, ohne im restlichen Code suchen zu müssen.
// Ändere einen Wert, speichere die Datei — fertig.
// ============================================================================

export const config = {
  // -- Administrator-Zugangsdaten -------------------------------------------
  // Diese Werte werden NICHT für die echte Anmeldung benutzt (das übernimmt
  // Supabase Auth, siehe README.md, Abschnitt "Admin-Zugang einrichten").
  // Sie dienen hier nur als Erinnerung/Kommentar, welche E-Mail als
  // Administrator hinterlegt ist.
  admin: {
    displayName: "Adrian",
  },

  // -- Farben ----------------------------------------------------------------
  colors: {
    background: "#ffffff",
    backgroundOverlay: "rgba(0, 0, 0, 0.95)", // Hintergrund der Vollbildansicht
    text: "#111111",
    textMuted: "#767676",
    border: "#eaeaea",
  },

  // -- Schriftarten ------------------------------------------------------------
  // "value" ist der CSS font-family Name.
  // "googleFont" (optional) ist der Name, wie er bei Google Fonts heißt —
  // wird automatisch geladen, falls angegeben.
  fonts: {
    options: [
      { id: "inter", label: "Inter", value: "'Inter', sans-serif", googleFont: "Inter:wght@300;400;500" },
      { id: "helvetica", label: "Helvetica", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
      { id: "arial", label: "Arial", value: "Arial, sans-serif" },
      { id: "times", label: "Times New Roman", value: "'Times New Roman', Times, serif" },
      { id: "georgia", label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
    ],
    // Standard-Schriftart, falls im Admin-Bereich noch keine gewählt wurde
    default: "inter",
  },

  // -- Layout / Raster ---------------------------------------------------------
  layout: {
    // Spaltenzahl je nach Zoomstufe (1 = groß ... hoch = klein)
    // Diese Werte werden vom Zoom-Regler / Pinch-to-Zoom verwendet.
    zoomLevels: {
      mobile: [1, 2, 3],
      tablet: [2, 3, 4, 5],
      desktop: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    // Standard-Spaltenzahl beim ersten Besuch (bevor etwas gespeichert wurde)
    defaultColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    gap: "2px", // Abstand zwischen den Bildern im Raster
    pagePadding: "24px", // Außenabstand der Seite
    breakpoints: {
      tablet: 640,
      desktop: 1024,
    },
  },

  // -- Übergänge / Animationen ---------------------------------------------
  motion: {
    transitionSpeed: "220ms",
    easing: "ease",
  },

  // -- Bildformat ------------------------------------------------------------
  images: {
    thumbnailAspectRatio: "1 / 1", // quadratisches Vorschauformat
    thumbnailSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },

  // -- Suche -------------------------------------------------------------------
  search: {
    placeholder: "Suche nach Ort, Jahr oder Reise…",
  },
};

export default config;
