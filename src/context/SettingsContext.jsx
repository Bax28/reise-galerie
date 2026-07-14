import { createContext, useContext, useEffect, useState } from "react";
import config from "../config";

const SettingsContext = createContext(null);
const STORAGE_KEY = "reisegalerie:settings";

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Ermittelt die passende Standard-Spaltenzahl für das aktuelle Gerät, falls
// noch keine gespeicherte Einstellung existiert (Vorgabe: 1 Spalte auf dem
// Smartphone, 2 auf dem Tablet, 3 auf dem Desktop).
function getDeviceDefaultColumns() {
  if (typeof window === "undefined") return config.layout.defaultColumns.desktop;
  const width = window.innerWidth;
  if (width < config.layout.breakpoints.tablet) return config.layout.defaultColumns.mobile;
  if (width < config.layout.breakpoints.desktop) return config.layout.defaultColumns.tablet;
  return config.layout.defaultColumns.desktop;
}

// Verwaltet Einstellungen, die sich der Besucher selbst merken soll:
// die gewählte Zoomstufe (Spaltenzahl) und die gewählte Schriftart.
// Beides wird im Browser gespeichert (localStorage), damit es beim
// nächsten Besuch erhalten bleibt.
export function SettingsProvider({ children }) {
  const stored = loadStoredSettings();

  const [columns, setColumns] = useState(
    stored.columns ?? getDeviceDefaultColumns()
  );
  const [fontId, setFontId] = useState(stored.fontId ?? config.fonts.default);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, fontId }));
  }, [columns, fontId]);

  useEffect(() => {
    // Lädt die gewählte Google Font dynamisch, falls nötig.
    const font = config.fonts.options.find((f) => f.id === fontId);
    if (font?.googleFont) {
      const linkId = "dynamic-google-font";
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
    }
  }, [fontId]);

  const activeFont =
    config.fonts.options.find((f) => f.id === fontId) ?? config.fonts.options[0];

  const value = { columns, setColumns, fontId, setFontId, activeFont };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
