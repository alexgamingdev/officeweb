<div align="center">
  <img src="logo.svg" alt="OfficeWeb Logo" width="120" height="120" />

  <h1>OfficeWeb</h1>
  <p><strong>Professionelle Büro-Software – vollständig im Browser</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)](https://github.com/alexgamingdev/sus_2026)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  [**🚀 Demo starten**](https://alexgamingdev.github.io/sus_2026/) · [Fehler melden](https://github.com/alexgamingdev/sus_2026/issues) · [Feature anfragen](https://github.com/alexgamingdev/sus_2026/issues)
</div>

---

## 📖 Über das Projekt

**OfficeWeb** ist eine kostenlose, quelloffene Office-Plattform, die vollständig im Browser läuft – ohne Installation, ohne Anmeldung, ohne Cloud-Zwang. Inspiriert von Microsoft Office bietet OfficeWeb alle wichtigen Bürowerkzeuge direkt im Browser, mit modernem Design und vollem Datenschutz.

> Alle Daten bleiben lokal auf deinem Gerät. Nichts wird an Server übertragen.

---

## ✨ Apps

| App | Beschreibung | Ähnlich wie |
|-----|-------------|-------------|
| 📝 **Writer** | Textverarbeitung mit WYSIWYG-Editor, Formatierung, Tabellen, Bilder | Microsoft Word |
| 📊 **Calc** | Tabellenkalkulation mit Formeln, Zellformatierung, Diagrammen | Microsoft Excel |
| 🎨 **Impress** | Präsentationen mit Folien, Themen, Animationen | Microsoft PowerPoint |
| 📋 **Notes** | Notizen und Aufgabenlisten mit Notizbuch-Struktur | Microsoft OneNote |

---

## 🚀 Features

- **🌐 100 % im Browser** – Keine Installation nötig. Funktioniert in jedem modernen Browser.
- **🌍 Mehrsprachig** – Unterstützt alle 24 offiziellen EU-Sprachen über das integrierte Sprachauswahlmenü.
- **💾 Lokaler Speicher** – Dokumente werden per `localStorage` im Browser gespeichert.
- **🔒 Datenschutz** – Alle Daten bleiben auf deinem Gerät. Kein Server, keine Cloud.
- **🎨 Professionelles Design** – Modernes, sauberes Interface inspiriert von Microsoft Office.
- **📤 Export & Druck** – Dokumente drucken oder als HTML/Text exportieren.
- **📱 Responsive** – Funktioniert auf Desktop, Tablet und Smartphone.
- **⌨️ Tastenkürzel** – Strg+S, Strg+N, Strg+O, Strg+B, Strg+I, Strg+U und mehr.
- **🔍 Suchen & Ersetzen** – Volltext-Suche mit Ersetzen-Funktion im Writer.

---

## 🏁 Schnellstart

Da OfficeWeb vollständig aus statischen HTML-Dateien besteht, ist kein Build-Schritt notwendig:

```bash
# Repository klonen
git clone https://github.com/alexgamingdev/sus_2026.git
cd sus_2026

# index.html im Browser öffnen
# Einfach die Datei doppelklicken, oder einen lokalen Server starten:
npx serve .
# oder
python3 -m http.server 8080
```

Danach im Browser öffnen: `http://localhost:8080`

---

## 🗂️ Projektstruktur

```
sus_2026/
├── index.html              # Startseite / App-Übersicht
├── writer.html             # Textverarbeitungs-App
├── calc.html               # Tabellenkalkulations-App
├── impress.html            # Präsentations-App
├── notes.html              # Notizen-App
├── logo.svg                # Projekt-Logo
├── css/
│   ├── common.css          # Gemeinsame Stile (Titelleiste, Modals, Sprachauswahl)
│   ├── index.css           # Stile der Startseite
│   ├── writer.css          # Stile des Writers
│   ├── calc.css            # Stile von Calc
│   ├── impress.css         # Stile von Impress
│   └── notes.css           # Stile von Notes
├── js/
│   ├── i18n.js             # Internationalisierungssystem (alle 24 EU-Sprachen)
│   ├── writer.js           # JavaScript des Writers
│   ├── calc.js             # JavaScript von Calc
│   ├── impress.js          # JavaScript von Impress
│   └── notes.js            # JavaScript von Notes
├── locales/
│   ├── de.json             # Deutsch (Standard)
│   ├── en.json             # Englisch
│   ├── fr.json             # Französisch
│   ├── es.json             # Spanisch
│   ├── it.json             # Italienisch
│   ├── nl.json             # Niederländisch
│   ├── pl.json             # Polnisch
│   ├── pt.json             # Portugiesisch
│   ├── sv.json             # Schwedisch
│   ├── da.json             # Dänisch
│   ├── fi.json             # Finnisch
│   ├── cs.json             # Tschechisch
│   ├── sk.json             # Slowakisch
│   ├── hu.json             # Ungarisch
│   ├── ro.json             # Rumänisch
│   ├── bg.json             # Bulgarisch
│   ├── hr.json             # Kroatisch
│   ├── sl.json             # Slowenisch
│   ├── el.json             # Griechisch
│   ├── lt.json             # Litauisch
│   ├── lv.json             # Lettisch
│   ├── et.json             # Estnisch
│   ├── ga.json             # Irisch
│   └── mt.json             # Maltesisch
├── LICENSE                 # MIT-Lizenz
├── CONTRIBUTING.md         # Beitragen zum Projekt
├── CODE_OF_CONDUCT.md      # Verhaltenskodex
├── SECURITY.md             # Sicherheitsrichtlinien
└── CHANGELOG.md            # Versionshistorie
```

---

## 🤝 Mitwirken

Beiträge sind herzlich willkommen! Bitte lies zuerst den [Contributing Guide](CONTRIBUTING.md).

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/mein-feature`)
3. Committe deine Änderungen (`git commit -m 'feat: füge mein Feature hinzu'`)
4. Pushe den Branch (`git push origin feature/mein-feature`)
5. Öffne einen Pull Request

---

## 🛡️ Sicherheit

Gefundene Sicherheitslücken bitte **nicht** öffentlich als Issue melden, sondern privat gemäß der [Sicherheitsrichtlinie](SECURITY.md) melden.

---

## 📄 Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).  
Copyright © 2026 [alexgamingdev](https://github.com/alexgamingdev)

---

<div align="center">
  Erstellt mit ❤️ von <a href="https://github.com/alexgamingdev">alexgamingdev</a>
</div>