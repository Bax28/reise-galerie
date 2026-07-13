import exifr from "exifr";

// Liest das Aufnahmedatum (und optional GPS-Koordinaten) direkt aus der
// Bilddatei aus, bevor sie hochgeladen wird. Das erlaubt es, die Galerie
// nach dem echten Aufnahmedatum statt nach dem Upload-Zeitpunkt zu sortieren.
export async function readExifData(file) {
  try {
    const data = await exifr.parse(file, { gps: true, pick: ["DateTimeOriginal", "CreateDate"] });
    const takenAt = data?.DateTimeOriginal || data?.CreateDate || null;
    const gps =
      data?.latitude != null && data?.longitude != null
        ? { lat: data.latitude, lng: data.longitude }
        : null;
    return {
      takenAt: takenAt ? new Date(takenAt).toISOString() : null,
      gps,
    };
  } catch (error) {
    // Manche Dateien haben keine oder beschädigte EXIF-Daten — das ist kein
    // Fehler, sondern ein normaler Fall (z. B. Screenshot oder Scan).
    console.warn("EXIF konnte nicht gelesen werden:", error.message);
    return { takenAt: null, gps: null };
  }
}
