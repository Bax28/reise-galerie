# Reisegalerie

Eine extrem minimalistische, persönliche Reise-Fotogalerie. Reiner weißer
Hintergrund, schwarze Schrift, quadratische Vorschaubilder, ein einziges
Hamburger-Menü — sonst nichts. Diese Anleitung richtet sich ausdrücklich an
Menschen ohne Programmiererfahrung. Sie überspringt keinen Schritt.

Am Ende hast du:

* eine Website unter `https://DEINNAME.github.io/reise-galerie/`
* einen kostenlosen Online-Speicher für deine Fotos (Supabase)
* einen einzigen Admin-Zugang, mit dem nur du Reisen und Fotos verwalten kannst

Alles, was hier verwendet wird, ist dauerhaft kostenlos nutzbar (siehe
Abschnitt "Kosten & Grenzen" ganz unten).

---

## Inhaltsverzeichnis

1. [Wie diese Website funktioniert](#wie-diese-website-funktioniert)
2. [Was du brauchst](#was-du-brauchst)
3. [Schritt 1: Supabase-Konto erstellen](#schritt-1-supabase-konto-erstellen)
4. [Schritt 2: Datenbank einrichten](#schritt-2-datenbank-einrichten)
5. [Schritt 3: Bilderspeicher (Storage) einrichten](#schritt-3-bilderspeicher-storage-einrichten)
6. [Schritt 4: Admin-Zugang einrichten](#schritt-4-admin-zugang-einrichten)
7. [Schritt 5: Zugangsdaten kopieren](#schritt-5-zugangsdaten-kopieren)
8. [Schritt 6: GitHub-Repository erstellen](#schritt-6-github-repository-erstellen)
9. [Schritt 7: Projektdateien hochladen](#schritt-7-projektdateien-hochladen)
10. [Schritt 8: Zugangsdaten in GitHub eintragen](#schritt-8-zugangsdaten-in-github-eintragen)
11. [Schritt 9: GitHub Pages aktivieren](#schritt-9-github-pages-aktivieren)
12. [Schritt 10: Website öffnen](#schritt-10-website-öffnen)
13. [Lokal testen (optional, aber empfohlen)](#lokal-testen-optional-aber-empfohlen)
14. [Fotos hochladen](#fotos-hochladen)
15. [Website aktualisieren](#website-aktualisieren)
16. [Fehlerbehebung](#fehlerbehebung)
17. [Kosten & Grenzen](#kosten--grenzen)
18. [Siehe auch](#siehe-auch)

---

## Wie diese Website funktioniert

Du hast GitHub Pages gewünscht. GitHub Pages kann aber nur fertige,
statische Dateien anzeigen — es kann keine Fotos speichern, keine
Datenbank führen und sich nicht merken, wer eingeloggt ist. Deshalb
kombiniert dieses Projekt zwei kostenlose Dienste:

| Dienst | Aufgabe | Warum genau dieser? |
|---|---|---|
| **GitHub Pages** | zeigt die fertige Website an | von dir gewünscht, kostenlos, keine eigene Serververwaltung nötig |
| **Supabase** | speichert Reisen, Fotos, Login | kostenloser "Free Plan" ohne Kreditkarte, enthält gleichzeitig Datenbank, Foto-Speicher und Login-System — du brauchst dadurch keine drei separaten Anbieter |

Die Alternative wäre gewesen, drei einzelne Dienste zu kombinieren (z. B.
eine Datenbank hier, ein Foto-Hoster dort, ein separates Login-System). Das
hätte mehr Konten, mehr Zugangsdaten und mehr mögliche Fehlerquellen
bedeutet — für ein persönliches Projekt unnötig kompliziert. Supabase deckt
alle drei Bedürfnisse in einem einzigen kostenlosen Konto ab.

**Der Ablauf im Alltag:** Du besuchst deine Website, klickst auf das
Hamburger-Menü, loggst dich ein, lädst Fotos hoch — fertig. Die Website
selbst muss dafür nicht neu veröffentlicht werden; nur wenn du am
*Code* etwas änderst (z. B. Farben), musst du das unten beschriebene
"Website aktualisieren" durchführen.

---

## Was du brauchst

* Einen Computer mit Internetzugang
* Eine E-Mail-Adresse
* Etwa 30–45 Minuten für die einmalige Einrichtung

Kein Kreditkarte, keine Vorkenntnisse.

---

## Schritt 1: Supabase-Konto erstellen

1. Öffne [https://supabase.com](https://supabase.com)
2. Klicke oben rechts auf **Start your project** bzw. **Sign Up**
3. Melde dich mit deiner GitHub- oder E-Mail-Adresse an
4. Klicke auf **New Project**
5. Vergib einen Projektnamen, z. B. `reisegalerie`
6. Vergib ein Datenbank-Passwort (notiere es dir sicher — du brauchst es normalerweise nicht mehr, aber besser aufheben)
7. Wähle eine Region in deiner Nähe (z. B. Frankfurt/EU)
8. Klicke auf **Create new project** und warte 1–2 Minuten, bis das Projekt bereit ist

---

## Schritt 2: Datenbank einrichten

1. Öffne in der linken Seitenleiste **SQL Editor**
2. Klicke auf **New query**
3. Öffne die Datei [`supabase/schema.sql`](./supabase/schema.sql) aus diesem Projekt
4. Kopiere den **gesamten Inhalt** dieser Datei
5. Füge ihn in den SQL-Editor ein
6. Klicke auf **Run** (oder drücke Strg/Cmd + Enter)

Wenn unten "Success. No rows returned" erscheint, hat es funktioniert. Damit
existieren jetzt die beiden Tabellen `trips` (Reisen) und `photos` (Fotos)
inklusive aller Sicherheitsregeln.

---

## Schritt 3: Bilderspeicher (Storage) einrichten

1. Öffne in der linken Seitenleiste **Storage**
2. Klicke auf **New bucket**
3. Name: `photos` (exakt so, klein geschrieben)
4. Aktiviere **Public bucket**
5. Klicke auf **Create bucket**

Die Zugriffsregeln für diesen Bucket wurden bereits in Schritt 2 durch die
`schema.sql` mit angelegt (der untere Teil der Datei betrifft `storage.objects`).

---

## Schritt 4: Admin-Zugang einrichten

Du hast dir als Beispiel-Zugangsdaten `Adrian` / `Adrian123` gewünscht. Aus
Sicherheitsgründen verwenden wir dafür Supabase Auth (statt die Zugangsdaten
offen im Code zu speichern, wo sie jeder im Quelltext lesen könnte) —
die Bedienung bleibt für dich trotzdem ein einfaches Feld
"Benutzername" + "Passwort".

1. Öffne in der linken Seitenleiste **Authentication** → **Users**
2. Klicke auf **Add user** → **Create new user**
3. Trage als E-Mail ein: `adrian@login.local` (oder deine echte
   E-Mail-Adresse, falls du das lieber magst)
4. Trage als Passwort dein gewünschtes Passwort ein, z. B. `Adrian123`
5. Aktiviere **Auto Confirm User** (falls die Option angezeigt wird)
6. Klicke auf **Create user**

Auf der Website meldest du dich später einfach mit `adrian` (dem Teil vor
dem `@`) und deinem Passwort an — das Eingabefeld heißt bewusst schlicht
"Benutzername".

Möchtest du Benutzername/Passwort später ändern? Das geht jederzeit über
**Authentication → Users** in Supabase (E-Mail/Passwort bearbeiten oder
löschen und neu anlegen).

---

## Schritt 5: Zugangsdaten kopieren

1. Öffne in der linken Seitenleiste **Project Settings** (Zahnrad-Symbol) → **API**
2. Kopiere den Wert bei **Project URL**
3. Kopiere den Wert bei **anon public** (unter "Project API keys")

Beide Werte brauchst du gleich in Schritt 8. Halte diese Seite offen oder
notiere die Werte kurz.

---

## Schritt 6: GitHub-Repository erstellen

1. Öffne [https://github.com](https://github.com) und melde dich an
   (oder erstelle ein kostenloses Konto über **Sign up**)
2. Klicke oben rechts auf das **+** und dann auf **New repository**
3. Repository-Name: `reise-galerie` (du kannst auch einen anderen Namen
   wählen — trage ihn dann aber auch in `vite.config.js` bei `base` ein,
   siehe Kommentar in dieser Datei)
4. Sichtbarkeit: **Public** (nötig für kostenloses GitHub Pages) oder
   **Private**, falls dein GitHub-Plan private Pages unterstützt
5. Klicke auf **Create repository**

---

## Schritt 7: Projektdateien hochladen

Die einfachste Variante ganz ohne Kommandozeile:

1. Öffne dein neues, leeres Repository auf GitHub
2. Klicke auf **uploading an existing file**
3. Ziehe **alle** Dateien und Ordner dieses Projekts in das Browserfenster
   (achte darauf, dass auch versteckte Ordner wie `.github` mit hochgeladen werden —
   lade dazu am besten den kompletten Projektordner als ZIP herunter,
   entpacke ihn lokal, und ziehe dann den entpackten Inhalt hinein)
4. Scrolle runter, trage eine kurze Commit-Nachricht ein, z. B. `Erste Version`
5. Klicke auf **Commit changes**

Alternative für später (empfohlen, sobald du dich wohler fühlst): installiere
[GitHub Desktop](https://desktop.github.com), das dir das Hoch- und
Herunterladen von Änderungen per Mausklick abnimmt.

---

## Schritt 8: Zugangsdaten in GitHub eintragen

Damit die Website beim Veröffentlichen weiß, wie sie sich mit Supabase
verbindet, hinterlegst du die beiden Werte aus Schritt 5 als "Secrets"
(GitHub speichert sie verschlüsselt, sie erscheinen nirgends öffentlich):

1. Öffne dein Repository auf GitHub
2. Klicke auf **Settings** (oben im Repository, nicht die globalen
   Kontoeinstellungen)
3. Klicke links auf **Secrets and variables** → **Actions**
4. Klicke auf **New repository secret**
5. Name: `VITE_SUPABASE_URL`, Wert: die Project URL aus Schritt 5 → **Add secret**
6. Klicke erneut auf **New repository secret**
7. Name: `VITE_SUPABASE_ANON_KEY`, Wert: der anon public Key aus Schritt 5 → **Add secret**

---

## Schritt 9: GitHub Pages aktivieren

1. Öffne im Repository **Settings** → **Pages**
2. Wähle bei **Source** die Option **GitHub Actions**

Das war's — GitHub baut die Website jetzt automatisch. Du kannst den
Fortschritt im Reiter **Actions** deines Repositorys verfolgen (ein gelber
Punkt bedeutet "läuft gerade", ein grünes Häkchen bedeutet "fertig").

---

## Schritt 10: Website öffnen

Nach ein bis zwei Minuten ist deine Website erreichbar unter:

```
https://DEIN-GITHUB-NAME.github.io/reise-galerie/
```

Ersetze `DEIN-GITHUB-NAME` durch deinen tatsächlichen GitHub-Benutzernamen.
Du findest die exakte Adresse auch unter **Settings → Pages** ganz oben.

Die Galerie ist zunächst leer — das ist normal. Logge dich über das
Hamburger-Menü ein und lege deine erste Reise an (siehe
["Fotos hochladen"](#fotos-hochladen)).

---

## Lokal testen (optional, aber empfohlen)

Bevor du Änderungen veröffentlichst, kannst du die Website auf deinem
eigenen Computer testen:

1. Installiere [Node.js](https://nodejs.org) (Version 20, "LTS"-Variante)
2. Lade dieses Projekt auf deinen Computer herunter (über GitHub Desktop
   oder **Code → Download ZIP**)
3. Öffne ein Terminal im Projektordner
4. Kopiere `.env.example` zu einer neuen Datei namens `.env` und trage
   dort deine echten Supabase-Werte ein (dieselben wie in Schritt 5)
5. Führe aus:
   ```
   npm install
   npm run dev
   ```
6. Öffne die im Terminal angezeigte Adresse (meist `http://localhost:5173`)

Änderungen an Dateien werden dabei sofort im Browser sichtbar.

---

## Fotos hochladen

1. Öffne deine Website
2. Öffne das Hamburger-Menü (oben rechts)
3. Klicke auf **Login**, melde dich an
4. Öffne erneut das Menü, klicke auf **Admin-Bereich**
5. Klicke auf **Neue Reise anlegen**, fülle Titel, Ort, Zeitraum und
   Beschreibung aus, speichere
6. Klicke bei der neuen Reise auf **Fotos verwalten**
7. Klicke auf **Fotos auswählen** und wähle mehrere Bilder gleichzeitig aus
8. Das Aufnahmedatum wird automatisch aus den Fotos gelesen. Ist es falsch
   oder fehlt es, klicke bei dem jeweiligen Foto auf das Datumsfeld und
   wähle das richtige Datum manuell — dieser Wert überschreibt dann das
   automatisch gelesene Datum
9. Klicke auf **Fotos hochladen**

Die Galerie sortiert automatisch nach dem tatsächlichen Aufnahmedatum, die
neuesten Reisen erscheinen zuerst.

---

## Website aktualisieren

Diese Website veröffentlicht sich **automatisch neu**, sobald du eine
Datei im Repository auf GitHub änderst und speicherst (z. B. eine Farbe in
`src/config.js` anpasst). Du musst dafür nichts weiter tun, außer die
Datei zu speichern ("Commit changes" klicken) — GitHub Actions baut die
Seite dann selbstständig neu (siehe Reiter **Actions**).

Reisen und Fotos hochladen/ändern/löschen benötigt **keine** Neu-Veröffentlichung
— das passiert sofort live über Supabase.

---

## Fehlerbehebung

**Die Website zeigt eine leere weiße Seite.**
Öffne die Browser-Konsole (Rechtsklick → Untersuchen → Konsole). Steht dort
ein Hinweis zu fehlenden Supabase-Zugangsdaten? Prüfe, ob die beiden
Secrets in Schritt 8 exakt so benannt wurden: `VITE_SUPABASE_URL` und
`VITE_SUPABASE_ANON_KEY`.

**"404" beim Öffnen der Website-Adresse.**
Prüfe unter **Settings → Pages**, ob dort bereits eine Adresse angezeigt
wird. Prüfe außerdem, ob der Wert bei `base` in `vite.config.js` exakt
deinem Repository-Namen entspricht (inklusive Schrägstrichen).

**Login funktioniert nicht.**
Prüfe unter Supabase **Authentication → Users**, ob der Benutzer existiert
und **Auto Confirm User** aktiviert war. Falls nicht, lösche den Nutzer und
lege ihn erneut an.

**Hochgeladene Fotos erscheinen nicht.**
Prüfe unter Supabase **Storage**, ob der Bucket exakt `photos` heißt und
als "Public" markiert ist. Prüfe, ob Schritt 2 (`schema.sql`) vollständig
und ohne Fehlermeldung ausgeführt wurde.

**Die GitHub Action (Veröffentlichung) schlägt fehl.**
Öffne den Reiter **Actions**, klicke auf den fehlgeschlagenen Lauf, um die
genaue Fehlermeldung zu lesen. Meist fehlt eines der beiden Secrets aus
Schritt 8, oder es wurde ein Tippfehler beim Namen gemacht.

---

## Kosten & Grenzen

Alle verwendeten Dienste sind im dauerhaft kostenlosen Tarif nutzbar, ohne
Kreditkarte:

* **GitHub Pages**: kostenlos für öffentliche Repositories
* **Supabase Free Plan** (Stand: Einrichtungszeitpunkt dieses Projekts):
  kostenlose Datenbank, kostenloser Storage (üblicherweise 1 GB, das
  entspricht je nach Bildgröße mehreren tausend Fotos), kostenloses
  Auth-System

Eine wichtige, ehrliche Einschränkung: Der Foto-Speicher (Storage-Bucket)
muss "public" sein, damit Bilder ohne komplizierte Zusatztechnik im Browser
angezeigt werden können. "Private" geschaltete Reisen/Fotos werden zwar in
der Galerie ausgeblendet, sind aber theoretisch über die exakte Bild-Adresse
erreichbar, falls jemand diese sehr lange, zufällige Adresse erraten oder
sie ihm zugespielt würde. Für ein rein privates Reisetagebuch ohne
sensible Inhalte ist das ein sinnvoller Kompromiss zwischen Einfachheit und
Sicherheit. Wer das nicht möchte, findet einen möglichen nächsten Schritt
dazu in `TODO.md`.

Bitte prüfe die aktuellen Konditionen direkt bei
[supabase.com/pricing](https://supabase.com/pricing), da sich Free-Tarife
mit der Zeit ändern können.

---

## Siehe auch

* [`DESIGN.md`](./DESIGN.md) — Ordnerstruktur, Design-Entscheidungen, wie du Farben/Schriften/Layout änderst
* [`TODO.md`](./TODO.md) — mögliche Erweiterungen für später
