import { useEffect, useState } from "react";
import { supabase, getPublicPhotoUrl, PHOTOS_BUCKET } from "../../lib/supabase";
import { useSettings } from "../../context/SettingsContext";
import config from "../../config";
import TripForm from "./TripForm";
import PhotoUploader from "./PhotoUploader";

/**
 * Der Admin-Modus. Erscheint nur nach erfolgreichem Login und erlaubt:
 * Reisen anlegen/bearbeiten/löschen, Fotos hochladen/bearbeiten/löschen,
 * Sichtbarkeit ändern und die Schriftart der Website wählen.
 */
export default function AdminPanel({ onClose, onDataChanged }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrip, setEditingTrip] = useState(null); // trip object or "new"
  const [expandedTripId, setExpandedTripId] = useState(null);
  const { fontId, setFontId } = useSettings();

  async function loadTrips() {
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("id, title, location, start_date, end_date, description, visibility, photos ( id, title, description, taken_at, storage_path, visibility )")
      .order("start_date", { ascending: false });
    setTrips(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTrips();
  }, []);

  async function handleDeleteTrip(trip) {
    if (!confirm(`"${trip.title}" inklusive aller Fotos wirklich löschen?`)) return;

    const paths = (trip.photos ?? []).map((p) => p.storage_path);
    if (paths.length > 0) {
      await supabase.storage.from(PHOTOS_BUCKET).remove(paths);
    }
    await supabase.from("trips").delete().eq("id", trip.id);
    await loadTrips();
    onDataChanged();
  }

  async function handleDeletePhoto(photo) {
    if (!confirm("Dieses Foto wirklich löschen?")) return;
    await supabase.storage.from(PHOTOS_BUCKET).remove([photo.storage_path]);
    await supabase.from("photos").delete().eq("id", photo.id);
    await loadTrips();
    onDataChanged();
  }

  async function togglePhotoVisibility(photo) {
    const next = photo.visibility === "public" ? "private" : "public";
    await supabase.from("photos").update({ visibility: next }).eq("id", photo.id);
    await loadTrips();
    onDataChanged();
  }

  async function toggleTripVisibility(trip) {
    const next = trip.visibility === "public" ? "private" : "public";
    await supabase.from("trips").update({ visibility: next }).eq("id", trip.id);
    await loadTrips();
    onDataChanged();
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel__header">
        <h1 className="admin-panel__title">Admin-Bereich</h1>
        <button className="form-cancel" onClick={onClose}>Schließen</button>
      </header>

      <section className="admin-section">
        <p className="menu-heading">Schriftart der Website</p>
        <select
          className="form-select"
          value={fontId}
          onChange={(e) => setFontId(e.target.value)}
        >
          {config.fonts.options.map((font) => (
            <option key={font.id} value={font.id}>{font.label}</option>
          ))}
        </select>
      </section>

      <section className="admin-section">
        <button className="form-submit admin-new-trip" onClick={() => setEditingTrip("new")}>
          Neue Reise anlegen
        </button>
      </section>

      {loading && <p className="state-message">Lädt…</p>}

      {trips.map((trip) => (
        <section key={trip.id} className="admin-trip">
          <div className="admin-trip__row">
            <div>
              <strong>{trip.title}</strong>
              <span className="admin-trip__meta">
                {" "}— {trip.location} · {trip.visibility === "public" ? "Öffentlich" : "Privat"}
              </span>
            </div>
            <div className="admin-trip__actions">
              <button className="form-cancel" onClick={() => setExpandedTripId(expandedTripId === trip.id ? null : trip.id)}>
                {expandedTripId === trip.id ? "Zuklappen" : "Fotos verwalten"}
              </button>
              <button className="form-cancel" onClick={() => setEditingTrip(trip)}>Bearbeiten</button>
              <button className="form-cancel" onClick={() => toggleTripVisibility(trip)}>
                {trip.visibility === "public" ? "Privat schalten" : "Öffentlich schalten"}
              </button>
              <button className="form-cancel admin-danger" onClick={() => handleDeleteTrip(trip)}>Löschen</button>
            </div>
          </div>

          {expandedTripId === trip.id && (
            <div className="admin-trip__details">
              <PhotoUploader tripId={trip.id} onUploaded={loadTrips} />

              <div className="admin-photo-list">
                {(trip.photos ?? []).map((photo) => (
                  <div className="admin-photo-list__item" key={photo.id}>
                    <img src={getPublicPhotoUrl(photo.storage_path)} alt="" />
                    <div className="admin-photo-list__meta">
                      <span>{photo.title || "(ohne Titel)"}</span>
                      <span className="admin-trip__meta">
                        {new Date(photo.taken_at).toLocaleDateString("de-DE")} ·{" "}
                        {photo.visibility === "public" ? "Öffentlich" : "Privat"}
                      </span>
                    </div>
                    <div className="admin-photo-list__actions">
                      <button className="form-cancel" onClick={() => togglePhotoVisibility(photo)}>
                        {photo.visibility === "public" ? "Privat" : "Öffentlich"}
                      </button>
                      <button className="form-cancel admin-danger" onClick={() => handleDeletePhoto(photo)}>
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {editingTrip && (
        <TripForm
          trip={editingTrip === "new" ? null : editingTrip}
          onClose={() => setEditingTrip(null)}
          onSaved={() => {
            setEditingTrip(null);
            loadTrips();
            onDataChanged();
          }}
        />
      )}
    </div>
  );
}
