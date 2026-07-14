import { getPublicPhotoUrl } from "../lib/supabase";

/**
 * Ein einzelnes quadratisches Vorschaubild. Der Zuschnitt (Center Crop) auf
 * ein 1:1 Format passiert rein per CSS (object-fit: cover) — das
 * Originalbild wird dabei nicht verändert und bleibt in der Vollbildansicht
 * unbeschnitten sichtbar.
 */
export default function PhotoTile({ photo, onOpen }) {
  const url = getPublicPhotoUrl(photo.storage_path);

  return (
    <button className="photo-tile" onClick={() => onOpen(photo)} aria-label={photo.title || "Foto öffnen"}>
      <img src={url} alt={photo.title || ""} loading="lazy" />
    </button>
  );
}
