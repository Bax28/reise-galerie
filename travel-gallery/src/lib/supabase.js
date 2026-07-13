import { createClient } from "@supabase/supabase-js";

// Diese beiden Werte kommen aus deiner .env Datei (siehe .env.example).
// Sie sind KEIN Geheimnis — der "anon key" ist dafür gemacht, öffentlich
// im Browser-Code zu stehen. Die eigentliche Sicherheit übernehmen die
// Row Level Security (RLS) Regeln in Supabase (siehe supabase/schema.sql).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Freundlicher Hinweis für Anfänger, falls die .env Datei fehlt.
  console.warn(
    "[Reisegalerie] Supabase-Zugangsdaten fehlen. Bitte lege eine .env Datei an " +
      "(siehe .env.example) und trage VITE_SUPABASE_URL sowie VITE_SUPABASE_ANON_KEY ein."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Name des Storage-Buckets, in dem alle Fotos liegen.
export const PHOTOS_BUCKET = "photos";

// Hilfsfunktion: baut aus einem gespeicherten Datei-Pfad die öffentliche URL.
export function getPublicPhotoUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}
