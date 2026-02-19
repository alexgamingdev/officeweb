const editor = document.getElementById('editor');
let savedSel = null;

// Formatting
function fmt(cmd) { editor.focus(); document.execCommand(cmd, false, null); updateRibbon(); }
function execFont() { editor.focus(); document.execCommand('fontName', false, document.getElementById('fontFamily').value); }
function execFontSize() { editor.focus(); document.execCommand('fontSize', false, document.getElementById('fontSize').value); }
function applyTextColor() { editor.focus(); document.execCommand('foreColor', false, document.getElementById('textColor').value); }
function applyHilite() { editor.focus(); document.execCommand('hiliteColor', false, document.getElementById('hiliteColor').value); }
function clearFormatting() { editor.focus(); document.execCommand('removeFormat'); }

function insertHeading(n) {
  editor.focus();
  document.execCommand('formatBlock', false, 'h' + n);
}
function insertBlockquote() {
  editor.focus();
  document.execCommand('formatBlock', false, 'blockquote');
}
function insertHR() {
  editor.focus();
  document.execCommand('insertHTML', false, '<hr />');
}
function insertPageBreak() {
  editor.focus();
  document.execCommand('insertHTML', false, '<div style="page-break-after:always; border-bottom:2px dashed #ccc; margin:16px 0;"></div>');
}

// Ribbon state
function updateRibbon() {
  ['bold','italic','underline','strikeThrough','justifyLeft','justifyCenter','justifyRight','justifyFull'].forEach(cmd => {
    const btn = document.getElementById('btn-' + cmd);
    if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
  });
}
editor.addEventListener('keyup', updateRibbon);
editor.addEventListener('mouseup', updateRibbon);
editor.addEventListener('selectionchange', updateWordCount);
document.addEventListener('selectionchange', updateWordCount);

function updateWordCount() {
  const text = editor.innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  document.getElementById('wordCount').textContent = t('writer.info.words', 'Wörter:') + ' ' + words;
  document.getElementById('charCount').textContent = t('writer.info.chars', 'Zeichen:') + ' ' + text.length;
}
updateWordCount();

// Menus
function toggleMenu(el) {
  const wasActive = el.classList.contains('active');
  document.querySelectorAll('.menu-item.active').forEach(m => m.classList.remove('active'));
  if (!wasActive) el.classList.add('active');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.menu-item')) document.querySelectorAll('.menu-item.active').forEach(m => m.classList.remove('active'));
});

// Modals
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));

// Table
function insertTable() { saveSelection(); openModal('tableModal'); }
function doInsertTable() {
  const rows = parseInt(document.getElementById('tblRows').value) || 3;
  const cols = parseInt(document.getElementById('tblCols').value) || 3;
  let html = '<table><thead><tr>';
  for (let c = 0; c < cols; c++) html += `<th>Col ${c+1}</th>`;
  html += '</tr></thead><tbody>';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) html += '<td>&nbsp;</td>';
    html += '</tr>';
  }
  html += '</tbody></table><p></p>';
  restoreSelection();
  editor.focus();
  document.execCommand('insertHTML', false, html);
  closeModal('tableModal');
}

// Image
function insertImage() { saveSelection(); document.getElementById('imgURL').value=''; document.getElementById('imgFile').value=''; document.getElementById('imgAlt').value=''; openModal('imgModal'); }
function handleImgFile() {
  const file = document.getElementById('imgFile').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('imgURL').value = e.target.result; };
  reader.readAsDataURL(file);
}
function doInsertImage() {
  const url = document.getElementById('imgURL').value.trim();
  const alt = document.getElementById('imgAlt').value.trim() || '';
  if (!url) return;
  restoreSelection();
  editor.focus();
  document.execCommand('insertHTML', false, `<img src="${url}" alt="${alt}" style="max-width:100%;"/>`);
  closeModal('imgModal');
}

// Link
function insertLink() { saveSelection(); document.getElementById('linkURL').value='https://'; document.getElementById('linkText').value = getSelText(); openModal('linkModal'); }
function doInsertLink() {
  const url = document.getElementById('linkURL').value.trim();
  const text = document.getElementById('linkText').value.trim() || url;
  if (!url) return;
  restoreSelection();
  editor.focus();
  document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
  closeModal('linkModal');
}

// Selection helpers
function saveSelection() {
  const sel = window.getSelection();
  if (sel.rangeCount > 0) savedSel = sel.getRangeAt(0).cloneRange();
}
function restoreSelection() {
  if (savedSel) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSel);
  }
}
function getSelText() {
  return window.getSelection().toString();
}

// Find & Replace
function openFindReplace() { openModal('findModal'); }
function doFind() {
  const text = document.getElementById('findText').value;
  if (!text) return;
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  const found = window.find(text, false, false, true, false, false, false);
  if (!found) alert(t('writer.confirm.notFound', 'Nicht gefunden: ') + text);
}
function doReplace() {
  const sel = window.getSelection();
  if (sel.toString() === document.getElementById('findText').value) {
    document.execCommand('insertText', false, document.getElementById('replaceText').value);
  }
  doFind();
}
function doReplaceAll() {
  const find = document.getElementById('findText').value;
  const rep = document.getElementById('replaceText').value;
  if (!find) return;
  const html = editor.innerHTML;
  const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  editor.innerHTML = html.replace(regex, rep);
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  setStatus(t('writer.status.replaced', 'Alle Ersetzungen durchgeführt'));
}

// Save / Load
function saveDoc() {
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  const title = document.getElementById('docTitle').value.trim() || t('writer.newDoc', 'Unbenanntes Dokument');
  const data = { title, content: editor.innerHTML, saved: new Date().toISOString() };
  const docs = getSavedDocs();
  const idx = docs.findIndex(d => d.title === title);
  if (idx >= 0) docs[idx] = data; else docs.push(data);
  localStorage.setItem('writer_docs', JSON.stringify(docs));
  setStatus(t('writer.status.saved', '💾 Gespeichert: ') + title);
}
function getSavedDocs() {
  try { return JSON.parse(localStorage.getItem('writer_docs') || '[]'); } catch { return []; }
}
function newDoc() {
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  if (editor.innerHTML && !confirm(t('writer.confirm.newDoc', 'Neues Dokument? Nicht gespeicherte Änderungen gehen verloren.'))) return;
  editor.innerHTML = '<p></p>';
  document.getElementById('docTitle').value = t('writer.newDoc', 'Unbenanntes Dokument');
  updateWordCount();
  setStatus(t('writer.status.newDoc', 'Neues Dokument erstellt'));
}
function openDoc() {
  const docs = getSavedDocs();
  const list = document.getElementById('docList');
  list.innerHTML = '';
  docs.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = d.title + ' (' + new Date(d.saved).toLocaleString('de-DE') + ')';
    list.appendChild(opt);
  });
  openModal('openModal');
}
function loadSelectedDoc() {
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  const list = document.getElementById('docList');
  if (list.selectedIndex < 0) return;
  const docs = getSavedDocs();
  const doc = docs[parseInt(list.value)];
  if (!doc) return;
  editor.innerHTML = doc.content;
  document.getElementById('docTitle').value = doc.title;
  closeModal('openModal');
  updateWordCount();
  setStatus(t('writer.status.opened', 'Geöffnet: ') + doc.title);
}
function deleteSelectedDoc() {
  const list = document.getElementById('docList');
  if (list.selectedIndex < 0) return;
  const docs = getSavedDocs();
  docs.splice(parseInt(list.value), 1);
  localStorage.setItem('writer_docs', JSON.stringify(docs));
  openDoc();
}

// Export
function saveAsHTML() {
  const title = document.getElementById('docTitle').value.trim() || 'dokument';
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title></head><body>${editor.innerHTML}</body></html>`;
  downloadFile(title + '.html', html, 'text/html');
}
function saveAsTxt() {
  const title = document.getElementById('docTitle').value.trim() || 'dokument';
  downloadFile(title + '.txt', editor.innerText, 'text/plain');
}
function downloadFile(filename, content, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type: mime}));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function setStatus(msg) {
  const t = window.i18n ? window.i18n.t : (k, f) => f || k;
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  setTimeout(() => { el.textContent = t('writer.status.ready', 'Bereit'); }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 's') { e.preventDefault(); saveDoc(); }
    if (e.key === 'n') { e.preventDefault(); newDoc(); }
    if (e.key === 'o') { e.preventDefault(); openDoc(); }
    if (e.key === 'h') { e.preventDefault(); openFindReplace(); }
    if (e.key === 'p') { /* allow default print */ }
  }
});

// Auto-save
setInterval(() => {
  const title = document.getElementById('docTitle').value.trim();
  if (title && editor.innerHTML !== '<p>Neues Dokument...</p>') {
    saveDoc();
  }
}, 30000);
