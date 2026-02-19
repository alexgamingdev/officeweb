# Sicherheitsrichtlinie

## Unterstützte Versionen

| Version | Support |
|---------|---------|
| Latest  | ✅ Aktiv |

## Sicherheitslücke melden

Wir nehmen Sicherheitsprobleme ernst. Wenn du eine Sicherheitslücke in OfficeWeb gefunden hast, melde sie bitte **nicht** öffentlich als GitHub Issue.

### So meldest du eine Sicherheitslücke

1. **Öffne ein privates Security Advisory** auf GitHub:  
   `https://github.com/alexgamingdev/sus_2026/security/advisories/new`

2. Beschreibe in deinem Report:
   - Art der Sicherheitslücke
   - Betroffene Datei(en) und Zeilen
   - Schritte zur Reproduktion
   - Mögliche Auswirkungen
   - Optional: Vorgeschlagener Fix

### Was danach passiert

- Du erhältst innerhalb von **48 Stunden** eine Bestätigung.
- Wir untersuchen das Problem und erstellen einen Fix.
- Du wirst über den Fortschritt informiert.
- Nach dem Fix wirst du in den Release Notes genannt (sofern gewünscht).

## Sicherheitshinweise für Nutzer

OfficeWeb speichert alle Daten ausschließlich lokal im Browser (`localStorage`). Es werden **keine Daten an externe Server** gesendet. Dennoch empfehlen wir:

- Verwende OfficeWeb nur über HTTPS oder lokal.
- Öffne keine HTML-Exporte aus unbekannten Quellen direkt im Browser.
- Halte deinen Browser aktuell.
