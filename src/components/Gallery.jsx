import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSettings } from "../context/SettingsContext";
import PhotoTile from "./PhotoTile";
import config from "../config";

/**
 * Lädt alle Reisen samt Fotos, sortiert alles nach dem tatsächlichen
 * Aufnahmedatum (nicht nach Uploadzeit) und zeigt sie als ruhige,
 * fotobasierte Ausstellung. Reagiert auf Filter, Suche und Zoomstufe.
 */
export default function Gallery({ filters, search, onOpenPhoto, refreshKey }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { columns, setColumns } = useSettings();
  const gridRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("trips")
        .select(
          `id, title, location, start_date, end_date, description, visibility,
           photos ( id, title, description, location, taken_at, storage_path, visibility, sort_order )`
        )
        .order("start_date", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Fotos innerhalb jeder Reise chronologisch sortieren (nach Aufnahmedatum).
      const withSortedPhotos = (data ?? []).map((trip) => ({
        ...trip,
        photos: [...(trip.photos ?? [])].sort(
          (a, b) => new Date(a.taken_at) - new Date(b.taken_at)
        ),
      }));

      setTrips(withSortedPhotos);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // --- Pinch-to-Zoom (Mobilgeräte) und Trackpad-Pinch (Desktop, Ctrl+Wheel) ---
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    let initialDistance = null;
    let initialColumns = columns;

    function getDistance(touches) {
      const [a, b] = touches;
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }

    function onTouchStart(e) {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
        initialColumns = columns;
      }
    }

    function onTouchMove(e) {
      if (e.touches.length === 2 && initialDistance) {
        const distance = getDistance(e.touches);
        const ratio = distance / initialDistance;
        // Auseinanderziehen (ratio > 1) => Bilder größer => weniger Spalten.
        const delta = Math.round((1 - ratio) * 4);
        const next = Math.min(8, Math.max(1, initialColumns + delta));
        if (next !== columns) setColumns(next);
      }
    }

    function onTouchEnd() {
      initialDistance = null;
    }

    // Trackpads senden Pinch-Gesten auf Desktop meist als "wheel" mit ctrlKey.
    function onWheel(e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1; // runter = kleiner zoomen = mehr Spalten
      const next = Math.min(8, Math.max(1, columns + direction));
      if (next !== columns) setColumns(next);
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [columns, setColumns]);

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();

    return trips
      .map((trip) => {
        const year = trip.start_date ? new Date(trip.start_date).getFullYear().toString() : null;

        const matchesFilters =
          (!filters.year || year === filters.year) &&
          (!filters.place || trip.location === filters.place) &&
          (!filters.trip || trip.title === filters.trip);

        if (!matchesFilters) return null;

        const matchesSearch =
          !query ||
          [trip.title, trip.location, trip.description, year]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query));

        const photoMatches = trip.photos.filter((photo) => {
          if (!query) return true;
          return [photo.title, photo.description, photo.location]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query));
        });

        if (query && !matchesSearch && photoMatches.length === 0) return null;

        return {
          ...trip,
          photos: query && !matchesSearch ? photoMatches : trip.photos,
        };
      })
      .filter(Boolean);
  }, [trips, filters, search]);

  if (loading) {
    return <p className="state-message">Lädt…</p>;
  }

  if (error) {
    return <p className="state-message">Die Galerie konnte nicht geladen werden: {error}</p>;
  }

  if (filteredTrips.length === 0) {
    return <p className="state-message">Keine Fotos gefunden.</p>;
  }

  return (
    <div ref={gridRef}>
      {filteredTrips.map((trip) => (
        <section key={trip.id} className="trip-section">
          <header className="trip-header">
            <h2 className="trip-title">{trip.title}</h2>
            <p className="trip-meta">
              {trip.location}
              {trip.start_date && ` — ${formatPeriod(trip.start_date, trip.end_date)}`}
            </p>
            {trip.description && <p className="trip-description">{trip.description}</p>}
          </header>

          <div
            className="photo-grid"
            style={{ "--columns": columns, gap: config.layout.gap }}
          >
            {trip.photos.map((photo) => (
              <figure key={photo.id} className="photo-grid__item">
                <PhotoTile photo={photo} onOpen={() => onOpenPhoto(photo, trip.photos)} />
                {photo.description && <figcaption className="photo-caption">{photo.description}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function formatPeriod(start, end) {
  const formatter = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" });
  const startLabel = formatter.format(new Date(start));
  if (!end || end === start) return startLabel;
  const endLabel = formatter.format(new Date(end));
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
}
