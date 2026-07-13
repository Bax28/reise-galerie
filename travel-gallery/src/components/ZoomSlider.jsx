import { useSettings } from "../context/SettingsContext";
import config from "../config";

/**
 * Zoom-Regler für Desktop (unten rechts, sehr dezent). Steuert, wie viele
 * Spalten das Bilderraster hat. Auf Mobilgeräten übernimmt stattdessen
 * Pinch-to-Zoom (siehe useGalleryZoomGestures in Gallery.jsx) diese Aufgabe,
 * daher wird der Regler dort ausgeblendet.
 */
export default function ZoomSlider({ device }) {
  const { columns, setColumns } = useSettings();
  const levels = config.layout.zoomLevels[device] ?? config.layout.zoomLevels.desktop;

  const min = Math.min(...levels);
  const max = Math.max(...levels);

  return (
    <div className="zoom-slider" aria-label="Zoomstufe der Galerie">
      <span className="zoom-slider__label">−</span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={columns}
        // Kleinerer Wert = weniger Spalten = größere Bilder.
        // Der Regler ist deshalb umgekehrt: rechts = mehr, kleinere Bilder.
        onChange={(e) => setColumns(Number(e.target.value))}
      />
      <span className="zoom-slider__label">+</span>
    </div>
  );
}
