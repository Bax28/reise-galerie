import { useEffect, useRef } from "react";
import { getPublicPhotoUrl } from "../lib/supabase";

/**
 * Vollbildansicht eines Fotos. Zeigt immer das Originalbild ohne Zuschnitt.
 * Bedienung: Pfeiltasten (Desktop), Wischen (Mobil), Escape oder Klick
 * außerhalb des Bildes schließt die Ansicht.
 */
export default function Lightbox({ photo, photos, onClose, onNavigate }) {
  const touchStartX = useRef(null);
  const index = photos.findIndex((p) => p.id === photo.id);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function goTo(nextIndex) {
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    onNavigate(photos[nextIndex]);
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    }
    touchStartX.current = null;
  }

  const url = getPublicPhotoUrl(photo.storage_path);

  return (
    <div
      className="lightbox"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      {index > 0 && (
        <button className="lightbox-nav lightbox-nav--prev" onClick={() => goTo(index - 1)} aria-label="Vorheriges Foto">
          ‹
        </button>
      )}

      <figure className="lightbox-figure">
        <img src={url} alt={photo.title || ""} />
        {(photo.title || photo.description) && (
          <figcaption className="lightbox-caption">
            {photo.title && <span className="lightbox-caption__title">{photo.title}</span>}
            {photo.description && <span className="lightbox-caption__description">{photo.description}</span>}
          </figcaption>
        )}
      </figure>

      {index < photos.length - 1 && (
        <button className="lightbox-nav lightbox-nav--next" onClick={() => goTo(index + 1)} aria-label="Nächstes Foto">
          ›
        </button>
      )}

      <button className="lightbox-close" onClick={onClose} aria-label="Schließen">
        Schließen
      </button>
    </div>
  );
}
