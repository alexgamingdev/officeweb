# Mitwirken an OfficeWeb

Vielen Dank für dein Interesse, zu OfficeWeb beizutragen! 🎉  
Jeder Beitrag – ob Bugfix, neues Feature, Dokumentation oder Übersetzung – ist willkommen.

---

## 📋 Verhaltenskodex

Bitte lies unseren [Code of Conduct](CODE_OF_CONDUCT.md). Wir erwarten von allen Beteiligten respektvolles und konstruktives Verhalten.

---

## 🐛 Fehler melden

1. Prüfe zuerst die [offenen Issues](https://github.com/alexgamingdev/officeweb/issues), ob der Fehler bereits gemeldet wurde.
2. Falls nicht, öffne ein neues Issue und verwende das **Bug Report** Template.
3. Beschreibe das Problem so detailliert wie möglich:
   - Browser und Version
   - Betriebssystem
   - Schritte zur Reproduktion
   - Erwartetes vs. tatsächliches Verhalten
   - Screenshots (falls hilfreich)

---

## 💡 Features vorschlagen

1. Prüfe zuerst die [offenen Issues](https://github.com/alexgamingdev/officeweb/issues) auf ähnliche Vorschläge.
2. Öffne ein neues Issue mit dem Label `enhancement`.
3. Beschreibe die gewünschte Funktionalität und den Anwendungsfall.

---

## 🛠️ Code beitragen

### Voraussetzungen

- Moderner Webbrowser (Chrome, Firefox, Edge, Safari)
- Git
- Optional: lokaler HTTP-Server (`npx serve .` oder `python3 -m http.server`)

### Entwicklungs-Workflow

1. **Fork** das Repository auf GitHub
2. **Klone** deinen Fork lokal:
   ```bash
   git clone https://github.com/DEIN_USERNAME/officeweb.git
   cd officeweb
   ```
3. Erstelle einen **Feature-Branch**:
   ```bash
   git checkout -b feature/mein-tolles-feature
   ```
4. Mache deine **Änderungen** in den HTML-Dateien
5. Teste die Änderungen im Browser
6. **Committe** mit einer aussagekräftigen Nachricht:
   ```bash
   git commit -m "feat: füge Darkmode für Writer hinzu"
   ```
7. **Pushe** deinen Branch:
   ```bash
   git push origin feature/mein-tolles-feature
   ```
8. Öffne einen **Pull Request** auf GitHub

### Commit-Nachrichtenformat

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

| Präfix | Bedeutung |
|--------|-----------|
| `feat:` | Neues Feature |
| `fix:` | Bugfix |
| `docs:` | Dokumentationsänderungen |
| `style:` | Code-Stil (keine Logikänderung) |
| `refactor:` | Code-Refactoring |
| `chore:` | Sonstiges (Builds, Abhängigkeiten) |

### Code-Richtlinien

- **Kein externes Framework** – OfficeWeb verwendet reines HTML, CSS und JavaScript (Vanilla JS).
- **Keine externen Abhängigkeiten** – Alle Funktionen müssen ohne npm-Pakete oder CDN-Imports auskommen.
- **Responsive Design** – Alle Änderungen müssen auf Desktop und Mobilgeräten funktionieren.
- **Datenschutz** – Es dürfen keine Daten an externe Server gesendet werden.
- **Barrierefreiheit** – Achte auf sinnvolle ARIA-Attribute und Tastaturnavigation.

---

## 📝 Dokumentation verbessern

Die Dokumentation liegt in der `README.md` und den Markdown-Dateien im Repository-Root.  
Verbesserungen sind immer willkommen – auch Grammatikfehler oder bessere Erklärungen.

---

## ❓ Fragen?

Öffne ein [GitHub Discussion](https://github.com/alexgamingdev/officeweb/discussions) oder ein Issue mit dem Label `question`.
