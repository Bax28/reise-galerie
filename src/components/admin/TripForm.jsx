import { useState } from "react";
import { supabase } from "../../lib/supabase";

const emptyTrip = {
  title: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
  visibility: "public",
};

/**
 * Formular zum Anlegen oder Bearbeiten einer Reise.
 * Zeitraum wird als Monat/Jahr gewählt (z. B. "August 2022"), da für ein
 * Reisetagebuch der genaue Tag selten relevant ist. Wer ein exaktes Datum
 * möchte, kann trotzdem ein volles Datum eintragen — das Feld akzeptiert
 * jedes gültige Kalenderdatum.
 */
export default function TripForm({ trip, onClose, onSaved }) {
  const [form, setForm] = useState(
    trip
      ? {
          title: trip.title,
          location: trip.location ?? "",
          start_date: trip.start_date ?? "",
          end_date: trip.end_date ?? "",
          description: trip.description ?? "",
          visibility: trip.visibility ?? "public",
        }
      : emptyTrip
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      location: form.location || null,
      start_date: form.start_date || null,
      end_date: form.end_date || form.start_date || null,
      description: form.description || null,
      visibility: form.visibility,
    };

    const query = trip
      ? supabase.from("trips").update(payload).eq("id", trip.id)
      : supabase.from("trips").insert(payload).select().single();

    const { data, error } = await query;
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    onSaved(trip ? { ...trip, ...payload } : data);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="login-form admin-form" onSubmit={handleSubmit}>
        <h2 className="login-title">{trip ? "Reise bearbeiten" : "Neue Reise"}</h2>

        <label className="form-label" htmlFor="title">Titel</label>
        <input
          id="title"
          className="form-input"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />

        <label className="form-label" htmlFor="location">Ort</label>
        <input
          id="location"
          className="form-input"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />

        <label className="form-label" htmlFor="start">Beginn</label>
        <input
          id="start"
          className="form-input"
          type="date"
          value={form.start_date}
          onChange={(e) => update("start_date", e.target.value)}
          required
        />

        <label className="form-label" htmlFor="end">Ende (optional)</label>
        <input
          id="end"
          className="form-input"
          type="date"
          value={form.end_date}
          onChange={(e) => update("end_date", e.target.value)}
        />

        <label className="form-label" htmlFor="description">Beschreibung</label>
        <textarea
          id="description"
          className="form-textarea"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <label className="form-checkbox-row" htmlFor="visibility">
          <input
            id="visibility"
            type="checkbox"
            checked={form.visibility === "private"}
            onChange={(e) => update("visibility", e.target.checked ? "private" : "public")}
          />
          Privat (nur nach Login sichtbar)
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="form-submit" type="submit" disabled={saving}>
          {saving ? "Speichern…" : "Speichern"}
        </button>
        <button type="button" className="form-cancel" onClick={onClose}>
          Abbrechen
        </button>
      </form>
    </div>
  );
}
