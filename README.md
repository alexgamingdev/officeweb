<div align="center">
  <img src="logo.svg" alt="OfficeWeb Logo" width="120" height="120" />

  <h1>OfficeWeb</h1>
  <p><strong>Free, open-source office suite with Writer, Calc, Impress &amp; Notes – runs entirely in the browser, no installation, no cloud.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red.svg)](https://github.com/alexgamingdev/officeweb)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  [**🚀 Launch Demo**](https://alexgamingdev.github.io/officeweb/) · [Report a Bug](https://github.com/alexgamingdev/officeweb/issues) · [Request a Feature](https://github.com/alexgamingdev/officeweb/issues)
</div>

---

## 📖 About the Project

**OfficeWeb** is a free, open-source office platform that runs entirely in the browser – no installation, no sign-up, no cloud required. Inspired by Microsoft Office, OfficeWeb provides all essential productivity tools directly in the browser, with a modern design and full privacy.

> All data stays locally on your device. Nothing is sent to any server.

---

## ✨ Apps

| App | Description | Similar to |
|-----|-------------|------------|
| 📝 **Writer** | Word processor with WYSIWYG editor, formatting, tables, images | Microsoft Word |
| 📊 **Calc** | Spreadsheet with formulas, cell formatting, charts | Microsoft Excel |
| 🎨 **Impress** | Presentations with slides, themes, animations | Microsoft PowerPoint |
| 📋 **Notes** | Notes and task lists with notebook structure | Microsoft OneNote |

---

## 🚀 Features

- **🌐 100 % in the browser** – No installation needed. Works in any modern browser.
- **🌍 Multilingual** – Supports all 24 official EU languages via the built-in language selector.
- **💾 Local storage** – Documents are saved via `localStorage` in the browser.
- **🔒 Privacy** – All data stays on your device. No server, no cloud.
- **🎨 Professional design** – Modern, clean interface inspired by Microsoft Office.
- **📤 Export & Print** – Print documents or export as HTML/text.
- **📱 Responsive** – Works on desktop, tablet and smartphone.
- **⌨️ Keyboard shortcuts** – Ctrl+S, Ctrl+N, Ctrl+O, Ctrl+B, Ctrl+I, Ctrl+U and more.
- **🔍 Find & Replace** – Full-text search with replace functionality in Writer.

---

## 🏁 Quick Start

Since OfficeWeb consists entirely of static HTML files, no build step is required:

```bash
# Clone the repository
git clone https://github.com/alexgamingdev/officeweb.git
cd officeweb

# Open index.html in your browser
# Simply double-click the file, or start a local server:
npx serve .
# or
python3 -m http.server 8080
```

Then open in your browser: `http://localhost:8080`

---

## 🗂️ Project Structure

```
officeweb/
├── index.html              # Home page / app overview
├── writer.html             # Word processor app
├── calc.html               # Spreadsheet app
├── impress.html            # Presentation app
├── notes.html              # Notes app
├── logo.svg                # Project logo
├── css/
│   ├── common.css          # Shared styles (title bar, modals, language selector)
│   ├── index.css           # Home page styles
│   ├── writer.css          # Writer styles
│   ├── calc.css            # Calc styles
│   ├── impress.css         # Impress styles
│   └── notes.css           # Notes styles
├── js/
│   ├── i18n.js             # Internationalization system (all 24 EU languages)
│   ├── writer.js           # Writer JavaScript
│   ├── calc.js             # Calc JavaScript
│   ├── impress.js          # Impress JavaScript
│   └── notes.js            # Notes JavaScript
├── locales/
│   ├── de.json             # German (default)
│   ├── en.json             # English
│   ├── fr.json             # French
│   ├── es.json             # Spanish
│   ├── it.json             # Italian
│   ├── nl.json             # Dutch
│   ├── pl.json             # Polish
│   ├── pt.json             # Portuguese
│   ├── sv.json             # Swedish
│   ├── da.json             # Danish
│   ├── fi.json             # Finnish
│   ├── cs.json             # Czech
│   ├── sk.json             # Slovak
│   ├── hu.json             # Hungarian
│   ├── ro.json             # Romanian
│   ├── bg.json             # Bulgarian
│   ├── hr.json             # Croatian
│   ├── sl.json             # Slovenian
│   ├── el.json             # Greek
│   ├── lt.json             # Lithuanian
│   ├── lv.json             # Latvian
│   ├── et.json             # Estonian
│   ├── ga.json             # Irish
│   └── mt.json             # Maltese
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contributing guide
├── CODE_OF_CONDUCT.md      # Code of Conduct
├── SECURITY.md             # Security policy
└── CHANGELOG.md            # Version history
```

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 🛡️ Security

Please do **not** report security vulnerabilities publicly as a GitHub Issue. Instead, report them privately according to the [Security Policy](SECURITY.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Copyright © 2026 [alexgamingdev](https://github.com/alexgamingdev)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/alexgamingdev">alexgamingdev</a>
</div>