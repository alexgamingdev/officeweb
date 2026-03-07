/* OfficeWeb – Promo Code System
 * A single permanent code with unlimited uses that unlocks Pro features
 * for an infinite duration (no expiry).
 * Code: OFFICEWEB1000
 */
(function () {
  'use strict';

  var PROMO_CODE = 'OFFICEWEB1000';
  var STORAGE_KEY = 'ow_promo';

  function _loadRecord() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  /** Returns Infinity – the activation never expires. */
  function expiresAt() {
    return Infinity;
  }

  function isActivated() {
    var record = _loadRecord();
    return record !== null && record.code === PROMO_CODE && record.expires === null;
  }

  function activate(code) {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: PROMO_CODE, expires: null }));
      return true;
    }
    return false;
  }

  function deactivate() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function addProBadge() {
    if (document.getElementById('promo-pro-badge')) return;
    var headerNav = document.querySelector('.header-nav');
    if (!headerNav) return;
    var badge = document.createElement('span');
    badge.id = 'promo-pro-badge';
    badge.className = 'promo-pro-badge';
    badge.textContent = '\u2B50 Pro';
    var langPicker = headerNav.querySelector('.lang-picker');
    if (langPicker) {
      headerNav.insertBefore(badge, langPicker);
    } else {
      headerNav.appendChild(badge);
    }
  }

  function removeProBadge() {
    var badge = document.getElementById('promo-pro-badge');
    if (badge) badge.remove();
  }

  function showActivatedState() {
    var formWrap = document.getElementById('promo-form-wrap');
    var successWrap = document.getElementById('promo-success-wrap');
    if (formWrap) formWrap.style.display = 'none';
    if (successWrap) successWrap.style.display = '';
    addProBadge();
  }

  function showFormState() {
    var formWrap = document.getElementById('promo-form-wrap');
    var successWrap = document.getElementById('promo-success-wrap');
    if (formWrap) formWrap.style.display = '';
    if (successWrap) successWrap.style.display = 'none';
    removeProBadge();
  }

  /** Called when the promo form is submitted. */
  window.promoSubmit = function (e) {
    e.preventDefault();
    var input = document.getElementById('promo-input');
    var errorEl = document.getElementById('promo-error');
    if (!input) return false;
    if (activate(input.value)) {
      if (errorEl) errorEl.style.display = 'none';
      showActivatedState();
    } else {
      if (errorEl) errorEl.style.display = '';
      input.select();
    }
    return false;
  };

  /** Called when the user deactivates the promo code. */
  window.promoDeactivate = function () {
    deactivate();
    var input = document.getElementById('promo-input');
    if (input) input.value = '';
    showFormState();
  };

  function init() {
    if (isActivated()) {
      showActivatedState();
    } else {
      showFormState();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PromoCode = {
    isActivated: isActivated,
    activate: activate,
    deactivate: deactivate,
    expiresAt: expiresAt
  };
}());
