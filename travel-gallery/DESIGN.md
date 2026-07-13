# DESIGN.md — Aufbau, Entscheidungen, Anpassungen

Diese Datei erklärt, wie das Projekt aufgebaut ist, warum bestimmte
Entscheidungen getroffen wurden, und wie du später Farben, Schriften und
Layout änderst — ohne dich durch den gesamten Code wühlen zu müssen.

---

## Ordnerstruktur

```
reise-galerie/
├── .github/workflows/deploy.yml   Automatische Veröffentlichung auf GitHub Pages
├── supabase/schema.sql            Datenbank- und Speicher-Regeln (einmalig ausführen)
├── src/
│   ├── config.js                  ZENTRALE Einstellungen (Farben, Schriften, Layout)
│   ├── App.jsx                    Verbindet alle Bausteine der Seite
│   ├── main.jsx                   Startpunkt der Anwendung
│   ├── components/
│   │   ├── Menu.jsx               Hamburger-Menü, Filter, Suche, Login-Link
│   │   ├── Gallery.jsx            Lädt Reisen/Fotos, zeigt das Bilderraster
│   │   ├── PhotoTile.jsx          Ein einzelnes quadratisches Vorschaubild
│   │   ├── Lightbox.jsx           Vollbildansicht eines Fotos
│   │   ├── ZoomSlider.jsx         Regler zur Rastergröße (Desktop)
│   │   ├── LoginForm.jsx          Login-Fenster (Benutzername/Passwort)
│   │   └── admin/
│   │       ├── AdminPanel.jsx     Verwaltungsoberfläche nach dem Login
│   │       ├── TripForm.jsx       Formular: Reise anlegen/bearbeiten
│   │       └── PhotoUploader.jsx  Mehrfach-Foto-Upload inkl. EXIF-Datum
│   ├── context/
│   │   ├── AuthContext.jsx        Merkt sich, ob der Admin eingeloggt ist
│   │   └── SettingsContext.jsx    Merkt sich Zoomstufe und Schriftart
│   ├── lib/supabase.js            Verbindung zu Supabase (Datenbank/Speicher/Login)
│   ├── utils/exif.js              Liest Aufnahmedatum aus Fotodateien
│   └── styles/                    Eine CSS-Datei je Themenbereich
│       ├── global.css             Grundlagen (Farben, Schrift, Fokus-Rahmen)
│       ├── menu.css
│       ├── gallery.css
│       ├── lightbox.css
│       ├── forms.css
│       └── admin.css
├── .env.example                   Vorlage für deine Supabase-Zugangsdaten
├── vite.config.js                 Build-Einstellungen (u. a. der GitHub-Pages-Pfad)
└── README.md                      Einrichtungsanleitung
```

**Faustregel:** Fast jede gewünschte Änderung findet in genau einer Datei
statt — meistens in `src/config.js` oder in einer der Dateien in
`src/styles/`.

---

## Warum diese Technologien?

| Baustein | Wahl | Begründung |
|---|---|---|
| Frontend-Bibliothek | React (über Vite) | Weit verbreitet, viele verständliche Lernressourcen, sehr schnelle Entwicklungsumgebung, produziert am Ende einfache statische Dateien — perfekt für GitHub Pages |
| Datenbank/Speicher/Login | Supabase | Ein einziges kostenloses Konto deckt alle drei Bedürfnisse ab (siehe README.md) |
| Styling | Reines CSS, keine Design-Bibliothek | Der Wunsch nach einem kompromisslos reduzierten, individuellen Look passt nicht zu vorgefertigten Bibliotheken, die eigene visuelle Muster mitbringen |
| EXIF-Auslesung | `exifr` (kleine JS-Bibliothek) | Liest Aufnahmedatum/GPS direkt im Browser, ohne eigenen Server |

---

## Design-Entscheidungen

* **Kein CSS-Framework**: Jede Klasse in `src/styles/` wurde bewusst für
  dieses Projekt geschrieben, damit nichts nach "Standard-Template" aussieht.
* **Quadratische Vorschaubilder per `object-fit: cover`**: Das Originalbild
  bleibt dabei unverändert gespeichert — nur die *Anzeige* im Raster wird
  zugeschnitten. In der Vollbildansicht (Lightbox) wird immer das
  unbeschnittene Original gezeigt (`object-fit: contain`).
  Datei: `src/styles/gallery.css`, Klasse `.photo-tile img`.
  Die Idee dazu und der zugrunde liegende Aufbau in `PhotoTile.jsx` /
  `Lightbox.jsx` folgen exakt der Vorgabe "Vorschau beschnitten,
  Vollbild original".
* **Ein einziges Icon**: Der Hamburger-Button ist das einzige grafische
  Symbol der Website — bewusst aus drei einfachen Linien in CSS gebaut
  (`src/components/Menu.jsx`), kein Icon-Set eingebunden.
* **Zoom per Pinch-Geste und Regler**: `Gallery.jsx` hört auf
  Touch-Events (Pinch) und auf `wheel`-Events mit gedrückter Ctrl-Taste
  (das Signal, das Trackpads beim Pinch senden). `ZoomSlider.jsx` bietet
  denselben Effekt über einen sichtbaren Regler für Mausnutzer.

---

## Wie ich Farben ändere

Öffne `src/config.js`, Abschnitt `colors`:

```js
colors: {
  background: "#ffffff",
  text: "#111111",
  ...
}
```

Ändere den Hex-Wert, speichere. Aktuell werden diese Werte als Kommentar-
Referenz geführt; die tatsächlich wirksamen Werte stehen (aus technischen
Gründen, damit reines CSS ohne Kompilierschritt funktioniert) parallel in
`src/styles/global.css` ganz oben im Abschnitt `:root`. Ändere dort die
gleichen Werte, damit beide Stellen übereinstimmen.

## Wie ich Schriftarten ändere

Im Admin-Bereich kannst du direkt zwischen den hinterlegten Schriftarten
wechseln (Inter, Helvetica, Arial, Times New Roman, Georgia). Möchtest du
eine weitere eigene Google Font hinzufügen, öffne `src/config.js`,
Abschnitt `fonts.options`, und ergänze einen Eintrag nach diesem Muster:

```js
{ id: "playfair", label: "Playfair Display", value: "'Playfair Display', serif", googleFont: "Playfair+Display:wght@400;600" }
```

`googleFont` ist der Name, wie er in der Adresse von
[fonts.google.com](https://fonts.google.com) erscheint, wenn du eine
Schriftart auswählst und "Get font" klickst.

## Wie ich das Layout ändere

Öffne `src/config.js`, Abschnitt `layout`:

* `zoomLevels` — welche Spaltenzahlen bei welcher Zoomstufe pro Gerät
  möglich sind
* `defaultColumns` — Startwert beim allerersten Besuch
* `gap` — Abstand zwischen den Bildern
* `pagePadding` — Außenabstand der gesamten Seite
* `breakpoints` — ab welcher Bildschirmbreite "Tablet" bzw. "Desktop"
  beginnt

---

## Wie ich später Funktionen erweitere

* Neue Filtermöglichkeit? Ergänze sie in `App.jsx` (Zustand `filters`),
  `Menu.jsx` (neue `MenuFilterGroup`) und `Gallery.jsx` (Filterlogik).
* Neues Datenfeld pro Foto (z. B. Kamera-Modell)? Ergänze die Spalte in
  `supabase/schema.sql`, dann in `PhotoUploader.jsx` beim Hochladen und in
  `Lightbox.jsx` bei der Anzeige.
* Ein weiterer Administrator? Lege in Supabase **Authentication → Users**
  einen zweiten Nutzer an — das reicht, es ist keine Codeänderung nötig.

Siehe `TODO.md` für konkrete, vorgedachte Erweiterungsideen.
