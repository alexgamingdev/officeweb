// ─── State ──────────────────────────────────────────────────────────────────
function _t(key, fallback) { return window.i18n ? window.i18n.t(key, fallback) : (fallback || key); }

let sections = [
  { id: 's1', name: 'Persönlich', icon: '📋', color: '#7719aa' },
  { id: 's2', name: 'Arbeit',     icon: '💼', color: '#0078d4' },
  { id: 's3', name: 'Aufgaben',   icon: '✅', color: '#217346' },
];
let currentSectionId = 's1';
let notes = loadNotes();
let currentNoteId = null;

function loadNotes() {
  try { return JSON.parse(localStorage.getItem('notes_data') || '{}'); } catch { return {}; }
}
function saveNotesStorage() {
  localStorage.setItem('notes_data', JSON.stringify(notes));
}
function getSections() {
  try {
    const s = JSON.parse(localStorage.getItem('notes_sections'));
    if (s && s.length) return s;
  } catch {}
  return sections;
}
function saveSections() {
  localStorage.setItem('notes_sections', JSON.stringify(sections));
}

// ─── Sections ────────────────────────────────────────────────────────────────
function renderSections() {
  const bar = document.getElementById('sectionsBar');
  bar.innerHTML = '';
  sections.forEach(s => {
    const btn = document.createElement('div');
    btn.className = 'section-btn' + (s.id === currentSectionId ? ' active' : '');
    btn.title = s.name;
    btn.textContent = s.icon;
    btn.style.setProperty('--sec-color', s.color);
    if (s.id === currentSectionId) btn.style.background = s.color;
    btn.addEventListener('click', () => switchSection(s.id));
    bar.appendChild(btn);
  });
  const add = document.createElement('div');
  add.className = 'section-add'; add.textContent = '+';
  add.title = _t('notes.newSection', 'Neuer Abschnitt');
  add.addEventListener('click', addSection);
  bar.appendChild(add);
}

function switchSection(id) {
  currentSectionId = id;
  currentNoteId = null;
  const sec = sections.find(s => s.id === id);
  if (sec) document.getElementById('sectionTitle').textContent = sec.name;
  renderSections();
  renderNoteList();
  showEmptyState();
}

function addSection() {
  const name = prompt(_t('notes.newSection', 'Neuer Abschnitt') + ':', _t('notes.newSection', 'Neuer Abschnitt'));
  if (!name) return;
  const icons = ['📋','📌','📎','🗒','🔖','📝','💡','⭐','🎯'];
  const colors = ['#7719aa','#0078d4','#217346','#c0392b','#d4830a','#00796b'];
  const s = { id: 's' + Date.now(), name, icon: icons[sections.length % icons.length], color: colors[sections.length % colors.length] };
  sections.push(s);
  saveSections();
  switchSection(s.id);
}

// ─── Notes list ──────────────────────────────────────────────────────────────
function getSectionNotes() {
  return Object.values(notes).filter(n => n.section === currentSectionId).sort((a, b) => b.modified - a.modified);
}

function renderNoteList(filter = '') {
  const container = document.getElementById('noteItems');
  let list = getSectionNotes();
  if (filter) list = list.filter(n => (n.title + ' ' + (n.body || '')).toLowerCase().includes(filter.toLowerCase()));
  container.innerHTML = '';
  list.forEach(n => {
    const item = document.createElement('div');
    item.className = 'note-item' + (n.id === currentNoteId ? ' active' : '');
    item.innerHTML = `
      <div class="note-item-title">${escHtml(n.title || _t('notes.noTitle', 'Ohne Titel'))}</div>
      <div class="note-item-preview">${escHtml(stripTags(n.body || '').slice(0, 60))}</div>
      <div class="note-item-date">${formatDate(n.modified)}</div>
      <button class="note-item-del" onclick="deleteNote(event, '${n.id}')">✕</button>
    `;
    item.addEventListener('click', () => openNote(n.id));
    container.appendChild(item);
  });
  document.getElementById('noteCount').textContent = list.length + ' ' + _t('notes.sectionTitle', 'Notizen');
}

function filterNotes() {
  renderNoteList(document.getElementById('searchInput').value);
}

// ─── Note operations ──────────────────────────────────────────────────────────
function newNote() {
  const id = 'n' + Date.now();
  notes[id] = { id, section: currentSectionId, title: '', body: '', tags: [], modified: Date.now(), created: Date.now() };
  saveNotesStorage();
  openNote(id);
  renderNoteList();
  setTimeout(() => document.getElementById('noteTitleInput').focus(), 50);
}

function openNote(id) {
  currentNoteId = id;
  const note = notes[id];
  if (!note) return;
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('editorPane').style.display = 'flex';
  document.getElementById('noteTitleInput').value = note.title || '';
  document.getElementById('noteBody').innerHTML = note.body || '';
  renderNoteTags(note);
  updateNoteWordCount();
  document.getElementById('noteModified').textContent = _t('notes.modified', 'Geändert: ') + formatDate(note.modified);
  renderNoteList();
}

function saveCurrentNote() {
  if (!currentNoteId || !notes[currentNoteId]) return;
  const note = notes[currentNoteId];
  note.title = document.getElementById('noteTitleInput').value;
  note.body = document.getElementById('noteBody').innerHTML;
  note.modified = Date.now();
  saveNotesStorage();
  updateNoteWordCount();
  document.getElementById('noteModified').textContent = _t('notes.modified', 'Geändert: ') + formatDate(note.modified);
  // update preview in list
  const item = document.querySelector('.note-item.active');
  if (item) {
    const titleEl = item.querySelector('.note-item-title');
    const previewEl = item.querySelector('.note-item-preview');
    if (titleEl) titleEl.textContent = note.title || _t('notes.noTitle', 'Ohne Titel');
    if (previewEl) previewEl.textContent = stripTags(note.body || '').slice(0, 60);
  }
}

function deleteNote(e, id) {
  e.stopPropagation();
  if (!confirm(_t('notes.confirm.deleteNote', 'Notiz löschen?'))) return;
  delete notes[id];
  saveNotesStorage();
  if (currentNoteId === id) { currentNoteId = null; showEmptyState(); }
  renderNoteList();
}

function showEmptyState() {
  document.getElementById('emptyState').style.display = 'flex';
  document.getElementById('editorPane').style.display = 'none';
}

// ─── Tags ────────────────────────────────────────────────────────────────────
function renderNoteTags(note) {
  const el = document.getElementById('noteTags');
  el.innerHTML = '';
  (note.tags || []).forEach(tag => {
    const t = document.createElement('span');
    t.className = 'tag';
    t.innerHTML = `${escHtml(tag)} <span class="tag-del" onclick="removeTag('${escHtml(tag)}')">✕</span>`;
    el.appendChild(t);
  });
  const add = document.createElement('span');
  add.className = 'tag tag-add'; add.textContent = '+ Tag';
  add.addEventListener('click', addTag);
  el.appendChild(add);
}

function addTag() {
  const tag = prompt(_t('notes.tagPrompt', 'Tag-Name:'));
  if (!tag || !currentNoteId) return;
  const note = notes[currentNoteId];
  if (!note.tags.includes(tag)) note.tags.push(tag);
  saveNotesStorage();
  renderNoteTags(note);
}

function removeTag(tag) {
  if (!currentNoteId) return;
  const note = notes[currentNoteId];
  note.tags = note.tags.filter(t => t !== tag);
  saveNotesStorage();
  renderNoteTags(note);
}

// ─── Editor formatting ────────────────────────────────────────────────────────
const noteBody = document.getElementById('noteBody');
function nfmt(cmd) { noteBody.focus(); document.execCommand(cmd, false, null); }
function insertNoteHeading(n) { noteBody.focus(); document.execCommand('formatBlock', false, 'h' + n); }
function setNoteFont() { noteBody.focus(); document.execCommand('fontSize', false, document.getElementById('noteFontSize').value); }
function setNoteTextColor() { noteBody.focus(); document.execCommand('foreColor', false, document.getElementById('noteTextColor').value); }
function setNoteHilite() { noteBody.focus(); document.execCommand('hiliteColor', false, document.getElementById('noteHilite').value); }

function insertCheckbox() {
  noteBody.focus();
  document.execCommand('insertHTML', false, '<div><input type="checkbox" /> </div>');
}

function updateNoteWordCount() {
  const text = noteBody.innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('noteWordCount').textContent = _t('notes.words', 'Wörter:') + ' ' + words;
}

// ─── Export ──────────────────────────────────────────────────────────────────
function exportNote() {
  if (!currentNoteId || !notes[currentNoteId]) { setStatus(_t('notes.status.noNote', 'Keine Notiz ausgewählt')); return; }
  const note = notes[currentNoteId];
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escHtml(note.title)}</title><style>body{font-family:Segoe UI,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.7;}h1{font-size:28px;}</style></head><body><h1>${escHtml(note.title)}</h1>${note.body}</body></html>`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], {type:'text/html'}));
  a.download = (note.title || 'notiz') + '.html';
  a.click();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function stripTags(html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }
function formatDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString(window.i18n ? window.i18n.lang : 'de', {hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString(window.i18n ? window.i18n.lang : 'de', {day:'2-digit',month:'2-digit',year:'numeric'});
}

function setStatus(msg) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  setTimeout(() => { el.textContent = _t('notes.status.ready', 'Bereit'); }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'n') { e.preventDefault(); newNote(); }
  }
});

// ─── Init ────────────────────────────────────────────────────────────────────
sections = getSections();

renderSections();
document.getElementById('sectionTitle').textContent = sections[0]?.name || _t('notes.sectionTitle', 'Notizen');
renderNoteList();

// Auto-save
setInterval(() => { if (currentNoteId) saveCurrentNote(); }, 10000);
