# TODO.md — mögliche Erweiterungen

Dieses Projekt erfüllt bewusst genau den beschriebenen Umfang — nicht mehr,
nicht weniger. Hier sind durchdachte Ideen für später, falls du das Projekt
mit der Zeit ausbauen möchtest. Keine davon ist notwendig, um die Website
wie beschrieben zu benutzen.

## Sicherheit

- [ ] **Signierte URLs für private Fotos.** Aktuell liegt der gesamte
  Foto-Speicher in einem öffentlichen Bucket (siehe README.md,
  "Kosten & Grenzen"). Eine sauberere Lösung wäre ein *privater* Bucket
  kombiniert mit kurzlebigen, signierten Download-Links
  (`supabase.storage.from('photos').createSignedUrl(...)`), die nur für
  eingeloggte Nutzer bzw. für öffentliche Fotos erzeugt werden. Das
  verlangt etwas mehr Code (eine kleine serverseitige Funktion, z. B. über
  Supabase Edge Functions), macht "privat" dann aber wirklich privat.
- [ ] Rate-Limiting/Bot-Schutz für das Login-Formular (z. B. über eine
  Supabase Edge Function), falls die Adresse öffentlich bekannt wird.

## Fotos & Reisen

- [ ] Fotos innerhalb einer Reise per Drag-and-drop neu anordnen
  (nutzt die bereits vorhandene, aber noch ungenutzte Spalte `sort_order`).
- [ ] Bilder vor dem Hochladen automatisch verkleinern/komprimieren
  (spart Speicherplatz im kostenlosen Storage-Kontingent).
- [ ] GPS-Daten (werden bereits ausgelesen, aber nicht gespeichert) in
  einer eigenen Spalte ablegen und optional eine kleine Kartenansicht
  pro Reise anzeigen.
- [ ] Mehrfachauswahl bei Filtern (z. B. zwei Orte gleichzeitig anzeigen).

## Bedienung

- [ ] Tastaturkürzel zum Durchblättern der gesamten Galerie (nicht nur
  innerhalb einer Reise).
- [ ] Eigene 404-Seite für GitHub Pages (falls jemand einen falschen Link teilt).
- [ ] Offline-Ansicht zuletzt geladener Fotos (PWA/Service Worker).

## Pflege

- [ ] Automatisches Backup der Datenbank (Supabase bietet tägliche Backups
  im kostenpflichtigen Plan; im Free Plan lohnt sich ein gelegentlicher
  manueller Export über den SQL-Editor: `Database → Backups`).
- [ ] Eigene Domain statt `github.io` (in GitHub Pages Settings unter
  "Custom domain" eintragbar, weiterhin kostenlos nutzbar, eine Domain
  selbst kostet meist etwas).
