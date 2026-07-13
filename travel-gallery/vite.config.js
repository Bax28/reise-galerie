import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// WICHTIG: "base" muss exakt dem Namen deines GitHub-Repositories entsprechen.
// Beispiel: Wenn dein Repository "meine-reisegalerie" heißt und unter
// https://DEINNAME.github.io/meine-reisegalerie/ erreichbar sein soll,
// dann trage hier "/meine-reisegalerie/" ein.
//
// Falls du stattdessen eine eigene Domain benutzt (z. B. reisen.deinename.de),
// trage einfach "/" ein.
export default defineConfig({
  plugins: [react()],
  base: "/reise-galerie/",
  build: {
    outDir: "dist",
  },
});
