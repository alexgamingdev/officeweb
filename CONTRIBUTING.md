# Contributing to OfficeWeb

Thank you for your interest in contributing to OfficeWeb! 🎉  
Every contribution – whether it's a bug fix, new feature, documentation or translation – is welcome.

---

## 📋 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). We expect respectful and constructive behavior from all participants.

---

## 🐛 Reporting Bugs

1. First check the [open issues](https://github.com/alexgamingdev/officeweb/issues) to see if the bug has already been reported.
2. If not, open a new issue and use the **Bug Report** template.
3. Describe the problem in as much detail as possible:
   - Browser and version
   - Operating system
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots (if helpful)

---

## 💡 Suggesting Features

1. First check the [open issues](https://github.com/alexgamingdev/officeweb/issues) for similar suggestions.
2. Open a new issue with the label `enhancement`.
3. Describe the desired functionality and the use case.

---

## 🛠️ Contributing Code

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Git
- Optional: local HTTP server (`npx serve .` or `python3 -m http.server`)

### Development Workflow

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/officeweb.git
   cd officeweb
   ```
3. Create a **feature branch**:
   ```bash
   git checkout -b feature/my-great-feature
   ```
4. Make your **changes** in the HTML files
5. Test the changes in the browser
6. **Commit** with a meaningful message:
   ```bash
   git commit -m "feat: add dark mode for Writer"
   ```
7. **Push** your branch:
   ```bash
   git push origin feature/my-great-feature
   ```
8. Open a **Pull Request** on GitHub

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Meaning |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (no logic change) |
| `refactor:` | Code refactoring |
| `chore:` | Miscellaneous (builds, dependencies) |

### Code Guidelines

- **No external frameworks** – OfficeWeb uses plain HTML, CSS and JavaScript (Vanilla JS).
- **No external dependencies** – All features must work without npm packages or CDN imports.
- **Responsive design** – All changes must work on desktop and mobile devices.
- **Privacy** – No data may be sent to external servers.
- **Accessibility** – Pay attention to meaningful ARIA attributes and keyboard navigation.

---

## 📝 Improving Documentation

Documentation lives in `README.md` and the Markdown files in the repository root.  
Improvements are always welcome – including grammar fixes or better explanations.

---

## ❓ Questions?

Open a [GitHub Discussion](https://github.com/alexgamingdev/officeweb/discussions) or an issue with the label `question`.
