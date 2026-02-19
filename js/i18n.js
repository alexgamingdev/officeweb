/**
 * OfficeWeb i18n – Internationalization for all 24 EU official languages
 * Usage: include this script, then optionally call i18n.t('key') for JS strings.
 * HTML elements: use data-i18n="key" for textContent/innerHTML,
 *                     data-i18n-placeholder="key" for placeholder attribute,
 *                     data-i18n-title="key" for title attribute.
 */
(function () {
  'use strict';

  // All 24 EU official language codes → native language name
  const EU_LANGS = {
    bg: 'Български',
    cs: 'Čeština',
    da: 'Dansk',
    de: 'Deutsch',
    el: 'Ελληνικά',
    en: 'English',
    es: 'Español',
    et: 'Eesti',
    fi: 'Suomi',
    fr: 'Français',
    ga: 'Gaeilge',
    hr: 'Hrvatski',
    hu: 'Magyar',
    it: 'Italiano',
    lt: 'Lietuvių',
    lv: 'Latviešu',
    mt: 'Malti',
    nl: 'Nederlands',
    pl: 'Polski',
    pt: 'Português',
    ro: 'Română',
    sk: 'Slovenčina',
    sl: 'Slovenščina',
    sv: 'Svenska'
  };

  let _translations = {};
  let _lang = (function () {
    const stored = localStorage.getItem('owlang');
    if (stored && EU_LANGS[stored]) return stored;
    const nav = (navigator.language || navigator.userLanguage || 'de').split('-')[0];
    return EU_LANGS[nav] ? nav : 'de';
  }());

  /** Look up a dot-separated key in the loaded translations. */
  function t(key, fallback) {
    const parts = key.split('.');
    let val = _translations;
    for (const p of parts) {
      if (val && typeof val === 'object' && Object.prototype.hasOwnProperty.call(val, p)) {
        val = val[p];
      } else {
        return (fallback !== undefined) ? fallback : key;
      }
    }
    return (typeof val === 'string') ? val : ((fallback !== undefined) ? fallback : key);
  }

  /** Apply translations to all data-i18n* elements in the document. */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var text = t(el.getAttribute('data-i18n'));
      if (text !== el.getAttribute('data-i18n')) el.innerHTML = text;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var text = t(el.getAttribute('data-i18n-placeholder'));
      if (text !== el.getAttribute('data-i18n-placeholder')) el.placeholder = text;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var text = t(el.getAttribute('data-i18n-title'));
      if (text !== el.getAttribute('data-i18n-title')) el.title = text;
    });
    document.documentElement.lang = _lang;
  }

  /** Persist language choice and reload. */
  function setLang(lang) {
    if (!EU_LANGS[lang]) return;
    localStorage.setItem('owlang', lang);
    location.reload();
  }

  /** Create and return a <select> language picker element. */
  function createPicker() {
    var select = document.createElement('select');
    select.className = 'lang-picker';
    select.setAttribute('aria-label', 'Language / Sprache');
    Object.keys(EU_LANGS).forEach(function (code) {
      var opt = document.createElement('option');
      opt.value = code;
      opt.textContent = EU_LANGS[code];
      if (code === _lang) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () { setLang(select.value); });
    return select;
  }

  /** Inject the language picker into the page header / titlebar. */
  function injectPicker() {
    // Index page header nav
    var headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.appendChild(createPicker());
      return;
    }
    // App pages titlebar
    var titlebar = document.querySelector('.titlebar');
    if (titlebar) {
      titlebar.appendChild(createPicker());
    }
  }

  /** Called after translations are loaded. */
  function init(translations) {
    _translations = translations || {};
    applyTranslations();
    injectPicker();
  }

  // Determine base path (handles being called from sub-directories or root)
  var scriptTag = document.currentScript;
  var basePath = '';
  if (scriptTag) {
    var src = scriptTag.src;
    // Walk up from js/ to the site root
    basePath = src.replace(/js\/i18n\.js.*$/, '');
  }

  // Fetch locale JSON; fall back to German on error or missing locale.
  var localeUrl = basePath + 'locales/' + _lang + '.json';
  fetch(localeUrl)
    .then(function (r) {
      return r.ok ? r.json() : fetch(basePath + 'locales/de.json').then(function (r2) { return r2.json(); });
    })
    .then(init)
    .catch(function () { init({}); });

  // Expose public API
  window.i18n = {
    t: t,
    setLang: setLang,
    lang: _lang,
    EU_LANGS: EU_LANGS
  };
}());
