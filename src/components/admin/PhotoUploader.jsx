import { useState } from "react";
import { supabase, PHOTOS_BUCKET } from "../../lib/supabase";
import { readExifData } from "../../utils/exif";

/**
 * Erlaubt das gleichzeitige Hochladen mehrerer Fotos für eine Reise.
 * Für jedes Foto wird automatisch versucht, das Aufnahmedatum aus den
 * EXIF-Daten zu lesen. Falls das nicht klappt (oder falsch ist), kann das
 * Datum manuell über ein Kalenderfeld überschrieben werden — dieser Wert
 * hat danach immer Vorrang vor dem EXIF-Datum.
 */
export default function PhotoUploader({ tripId, onUploaded }) {
  const [pending, setPending] = useState([]); // [{file, previewUrl, takenAt}]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files ?? []);
    const withExif = await Promise.all(
      files.map(async (file) => {
        const { takenAt } = await readExifData(file);
        return {
          file,
          previewUrl: URL.createObjectURL(file),
          takenAt: takenAt ?? new Date().toISOString(),
          title: "",
          description: "",
        };
      })
    );
    setPending((prev) => [...prev, ...withExif]);
  }

  function updatePending(index, field, value) {
    setPending((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removePending(index) {
    setPending((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUploadAll() {
    setUploading(true);
    setError(null);

    try {
      for (const item of pending) {
        const fileExt = item.file.name.split(".").pop();
        const path = `${tripId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(PHOTOS_BUCKET)
          .upload(path, item.file, { cacheControl: "31536000", upsert: false });

        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase.from("photos").insert({
          trip_id: tripId,
          storage_path: path,
          taken_at: item.takenAt,
          title: item.title || null,
          description: item.description || null,
          visibility: "public",
        });

        if (insertError) throw insertError;
      }

      setPending([]);
      onUploaded();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="photo-uploader">
      <label className="upload-button">
        Fotos auswählen
        <input type="file" accept="image/*" multiple onChange={handleFilesSelected} hidden />
      </label>

      {pending.length > 0 && (
        <div className="upload-queue">
          {pending.map((item, index) => (
            <div className="upload-queue__item" key={index}>
              <img src={item.previewUrl} alt="" className="upload-queue__thumb" />
              <div className="upload-queue__fields">
                <input
                  className="form-input"
                  placeholder="Titel (optional)"
                  value={item.title}
                  onChange={(e) => updatePending(index, "title", e.target.value)}
                />
                <input
                  className="form-input"
                  placeholder="Beschreibung (optional)"
                  value={item.description}
                  onChange={(e) => updatePending(index, "description", e.target.value)}
                />
                <label className="form-label">
                  Aufnahmedatum
                  <input
                    className="form-input"
                    type="date"
                    value={item.takenAt.slice(0, 10)}
                    onChange={(e) => updatePending(index, "takenAt", new Date(e.target.value).toISOString())}
                  />
                </label>
                <button type="button" className="form-cancel" onClick={() => removePending(index)}>
                  Entfernen
                </button>
              </div>
            </div>
          ))}

          {error && <p className="form-error">{error}</p>}

          <button className="form-submit" onClick={handleUploadAll} disabled={uploading}>
            {uploading ? "Wird hochgeladen…" : `${pending.length} Foto(s) hochladen`}
          </button>
        </div>
      )}
    </div>
  );
}
