// ─── Config ────────────────────────────────────────────────────────────────
function _t(key, fallback) { return window.i18n ? window.i18n.t(key, fallback) : (fallback || key); }

const ROWS = 50, COLS = 26;
const COL_LETTERS = Array.from({length: COLS}, (_, i) => String.fromCharCode(65 + i));

// ─── State ──────────────────────────────────────────────────────────────────
let sheets = [{ name: 'Tabelle1', data: {} }];
let currentSheet = 0;
let selectedCell = { r: 0, c: 0 };
let selRange = null; // {r1,c1,r2,c2}
let isEditing = false;

function cellData() { return sheets[currentSheet].data; }
function cellKey(r, c) { return COL_LETTERS[c] + (r + 1); }
function getCellObj(r, c) { return cellData()[cellKey(r, c)] || {}; }
function setCellObj(r, c, obj) {
  const key = cellKey(r, c);
  cellData()[key] = Object.assign(getCellObj(r, c), obj);
}

// ─── Build Grid ─────────────────────────────────────────────────────────────
function buildGrid() {
  const grid = document.getElementById('grid');
  let html = '<colgroup><col style="width:48px">';
  for (let c = 0; c < COLS; c++) html += '<col style="width:80px">';
  html += '</colgroup><thead><tr><th class="corner"></th>';
  for (let c = 0; c < COLS; c++) html += `<th class="col-header" data-c="${c}">${COL_LETTERS[c]}</th>`;
  html += '</tr></thead><tbody>';
  for (let r = 0; r < ROWS; r++) {
    html += `<tr><th class="row-header" data-r="${r}">${r + 1}</th>`;
    for (let c = 0; c < COLS; c++) {
      html += `<td id="cell-${r}-${c}" data-r="${r}" data-c="${c}"><span class="cell-display"></span></td>`;
    }
    html += '</tr>';
  }
  html += '</tbody>';
  grid.innerHTML = html;

  // Events
  grid.addEventListener('mousedown', onCellMouseDown);
  grid.addEventListener('dblclick', onCellDblClick);
  grid.addEventListener('mousemove', onCellMouseMove);
  grid.addEventListener('mouseup', () => { isDragging = false; });
  document.addEventListener('keydown', onGridKeyDown);
}

let isDragging = false, dragStart = null;

function onCellMouseDown(e) {
  const td = e.target.closest('td');
  if (!td) return;
  const r = +td.dataset.r, c = +td.dataset.c;
  if (isEditing) commitEdit();
  isDragging = true;
  dragStart = {r, c};
  selectCell(r, c);
  selRange = null;
  e.preventDefault();
}

function onCellMouseMove(e) {
  if (!isDragging) return;
  const td = e.target.closest('td');
  if (!td) return;
  const r = +td.dataset.r, c = +td.dataset.c;
  if (r !== dragStart.r || c !== dragStart.c) {
    selRange = {
      r1: Math.min(dragStart.r, r), c1: Math.min(dragStart.c, c),
      r2: Math.max(dragStart.r, r), c2: Math.max(dragStart.c, c)
    };
    renderRange();
    updateSelStats();
  }
}

function onCellDblClick(e) {
  const td = e.target.closest('td');
  if (!td) return;
  startEdit(+td.dataset.r, +td.dataset.c);
}

function onGridKeyDown(e) {
  if (isEditing) return;
  const {r, c} = selectedCell;
  const tag = document.activeElement.tagName;
  if (['INPUT','TEXTAREA','SELECT'].includes(tag) && document.activeElement.id !== 'formulaInput') return;

  if (e.key === 'Delete' || e.key === 'Backspace') {
    clearCell(); e.preventDefault(); return;
  }
  if (e.key === 'F2' || e.key === 'Enter') {
    startEdit(r, c); e.preventDefault(); return;
  }
  const moves = {ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1],Tab:[0,1]};
  if (moves[e.key]) {
    const [dr, dc] = moves[e.key];
    selectCell(Math.max(0, Math.min(ROWS-1, r+dr)), Math.max(0, Math.min(COLS-1, c+dc)));
    selRange = null; renderRange();
    e.preventDefault(); return;
  }
  // Start typing → edit
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    startEdit(r, c, e.key);
    e.preventDefault();
  }
}

// ─── Cell selection ──────────────────────────────────────────────────────────
function selectCell(r, c) {
  selectedCell = {r, c};
  renderRange();
  updateFormulaBar();
  updateCellRef();
}

function getCell(r, c) { return document.getElementById(`cell-${r}-${c}`); }

function renderRange() {
  document.querySelectorAll('td.selected, td.in-range').forEach(td => {
    td.classList.remove('selected', 'in-range');
  });
  if (selRange) {
    for (let r = selRange.r1; r <= selRange.r2; r++) {
      for (let c = selRange.c1; c <= selRange.c2; c++) {
        const td = getCell(r, c);
        if (td) td.classList.add(r === selectedCell.r && c === selectedCell.c ? 'selected' : 'in-range');
      }
    }
  }
  const td = getCell(selectedCell.r, selectedCell.c);
  if (td) { td.classList.add('selected'); }
}

function updateCellRef() {
  document.getElementById('cellRef').textContent = cellKey(selectedCell.r, selectedCell.c);
}

function updateFormulaBar() {
  const obj = getCellObj(selectedCell.r, selectedCell.c);
  document.getElementById('formulaInput').value = obj.formula || obj.raw || '';
}

function formulaChange() {
  const val = document.getElementById('formulaInput').value;
  const {r, c} = selectedCell;
  setCellValue(r, c, val);
  renderAll();
}

function formulaKeyDown(e) {
  if (e.key === 'Enter') {
    const {r, c} = selectedCell;
    selectCell(Math.min(ROWS-1, r+1), c);
    e.preventDefault();
  }
  if (e.key === 'Escape') {
    updateFormulaBar();
  }
}

// ─── Cell editing ────────────────────────────────────────────────────────────
const editInput = document.getElementById('cellEditInput');
let editCell = null;

function startEdit(r, c, initial = null) {
  if (isEditing) commitEdit();
  isEditing = true;
  editCell = {r, c};
  const td = getCell(r, c);
  const obj = getCellObj(r, c);
  const rect = td.getBoundingClientRect();
  const scrollEl = document.getElementById('sheetScroll');
  const scrollRect = scrollEl.getBoundingClientRect();
  editInput.style.left = (rect.left - scrollRect.left + scrollEl.scrollLeft) + 'px';
  editInput.style.top = (rect.top - scrollRect.top + scrollEl.scrollTop) + 'px';
  editInput.style.width = Math.max(80, rect.width) + 'px';
  editInput.style.height = rect.height + 'px';
  editInput.style.display = 'block';
  editInput.value = initial !== null ? initial : (obj.formula || obj.raw || '');
  editInput.focus();
  editInput.onkeydown = editKeyDown;
  editInput.oninput = () => {
    document.getElementById('formulaInput').value = editInput.value;
  };
}

function commitEdit() {
  if (!isEditing || !editCell) return;
  const val = editInput.value;
  setCellValue(editCell.r, editCell.c, val);
  editInput.style.display = 'none';
  isEditing = false;
  renderAll();
  updateFormulaBar();
  editCell = null;
}

function editKeyDown(e) {
  if (e.key === 'Enter') {
    commitEdit();
    selectCell(Math.min(ROWS-1, selectedCell.r+1), selectedCell.c);
    e.preventDefault();
  } else if (e.key === 'Tab') {
    commitEdit();
    selectCell(selectedCell.r, Math.min(COLS-1, selectedCell.c+1));
    e.preventDefault();
  } else if (e.key === 'Escape') {
    editInput.style.display = 'none';
    isEditing = false;
    editCell = null;
  }
}

// ─── Cell value / formula ────────────────────────────────────────────────────
function setCellValue(r, c, raw) {
  const key = cellKey(r, c);
  const obj = getCellObj(r, c);
  if (raw === '' || raw === null) {
    delete cellData()[key];
    return;
  }
  obj.raw = raw;
  if (raw.startsWith('=')) {
    obj.formula = raw;
  } else {
    delete obj.formula;
  }
  cellData()[key] = obj;
}

function evaluateCell(r, c) {
  const obj = getCellObj(r, c);
  if (!obj || (!obj.raw && obj.raw !== 0)) return '';
  const raw = obj.raw;
  if (obj.formula) {
    try { return evalFormula(obj.formula.substring(1), r, c); }
    catch(e) { return '#FEHLER'; }
  }
  if (!isNaN(raw) && raw.trim() !== '') return parseFloat(raw);
  return raw;
}

function evalFormula(expr, selfR, selfC) {
  // Replace cell references A1 → numeric value
  const refRe = /([A-Z]{1,2})(\d+)/g;
  let withVals = expr.toUpperCase().replace(refRe, (m, col, row) => {
    const c = COL_LETTERS.indexOf(col);
    const r = parseInt(row) - 1;
    if (c < 0 || r < 0) return '0';
    const v = evaluateCell(r, c);
    return (v === '' || v === null) ? '0' : v;
  });

  // Aggregate functions with ranges
  withVals = withVals.replace(/SUM\(([A-Z]\d+):([A-Z]\d+)\)/gi, (_, a, b) => rangeValues(a, b).reduce((s,x)=>s+x,0));
  withVals = withVals.replace(/AVERAGE\(([A-Z]\d+):([A-Z]\d+)\)/gi, (_, a, b) => { const v=rangeValues(a,b); return v.length ? v.reduce((s,x)=>s+x,0)/v.length : 0; });
  withVals = withVals.replace(/AVG\(([A-Z]\d+):([A-Z]\d+)\)/gi, (_, a, b) => { const v=rangeValues(a,b); return v.length ? v.reduce((s,x)=>s+x,0)/v.length : 0; });
  withVals = withVals.replace(/COUNT\(([A-Z]\d+):([A-Z]\d+)\)/gi, (_, a, b) => rangeValues(a,b).length);
  withVals = withVals.replace(/MAX\(([A-Z]\d+):([A-Z]\d+)\)/gi, (_, a, b) => { const v=rangeValues(a,b); return v.length ? Math.max(...v) : 0; });
  withVals = withVals.replace(/MIN\(([A-Z]\d+):([A-Z]\d+)\)/gi, (_, a, b) => { const v=rangeValues(a,b); return v.length ? Math.min(...v) : 0; });

  // Single-value functions (only operate on already-substituted numeric strings)
  withVals = withVals.replace(/SQRT\(([-\d.]+)\)/gi, (_, v) => Math.sqrt(parseFloat(v)));
  withVals = withVals.replace(/ABS\(([-\d.]+)\)/gi,  (_, v) => Math.abs(parseFloat(v)));
  withVals = withVals.replace(/ROUND\(([-\d.]+),([-\d]+)\)/gi, (_, v, d) => parseFloat(parseFloat(v).toFixed(parseInt(d))));

  // IF(condition, true_val, false_val) — condition: <num> <op> <num>
  withVals = withVals.replace(/IF\(([-\d.]+)\s*([=<>!]{1,2})\s*([-\d.]+),([-\d.]+),([-\d.]+)\)/gi,
    (_, lhs, op, rhs, tv, fv) => {
      const l = parseFloat(lhs), r2 = parseFloat(rhs);
      let result = false;
      if (op === '='  || op === '==') result = l === r2;
      else if (op === '<>')         result = l !== r2;
      else if (op === '<')          result = l <   r2;
      else if (op === '>')          result = l >   r2;
      else if (op === '<=')         result = l <=  r2;
      else if (op === '>=')         result = l >=  r2;
      return result ? tv : fv;
    });

  // Safety: allow only numbers, operators, parentheses, dots, commas, spaces
  if (/[^0-9+\-*/()., \t]/.test(withVals)) throw new Error('Ungültige Formel');

  // Safe arithmetic parser (no eval / Function constructor)
  return safeEval(withVals.replace(/,/g, '.'));
}

// ─── Safe arithmetic expression parser ──────────────────────────────────────
function safeEval(expr) {
  const tokens = tokenize(expr);
  let pos = 0;

  function peek() { return tokens[pos]; }
  function consume() { return tokens[pos++]; }

  function parseExpr() { return parseAddSub(); }

  function parseAddSub() {
    let left = parseMulDiv();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseMulDiv();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseMulDiv() {
    let left = parseUnary();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parseUnary();
      if (op === '/' && right === 0) throw new Error('#DIV/0');
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }

  function parseUnary() {
    if (peek() === '-') { consume(); return -parsePrimary(); }
    if (peek() === '+') { consume(); return parsePrimary(); }
    return parsePrimary();
  }

  function parsePrimary() {
    const tok = peek();
    if (tok === '(') {
      consume();
      const val = parseExpr();
      if (peek() !== ')') throw new Error('Fehlende )');
      consume();
      return val;
    }
    if (tok !== undefined && !isNaN(tok)) { consume(); return parseFloat(tok); }
    throw new Error('Unbekanntes Token: ' + tok);
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error('Ungültige Formel');
  return result;
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if (/[+\-*/()]/.test(expr[i])) { tokens.push(expr[i++]); continue; }
    if (/[\d.]/.test(expr[i])) {
      let num = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) num += expr[i++];
      tokens.push(num); continue;
    }
    throw new Error('Ungültiges Zeichen: ' + expr[i]);
  }
  return tokens;
}

function rangeValues(a, b) {
  const c1 = COL_LETTERS.indexOf(a[0]), r1 = parseInt(a.slice(1)) - 1;
  const c2 = COL_LETTERS.indexOf(b[0]), r2 = parseInt(b.slice(1)) - 1;
  const vals = [];
  for (let r = Math.min(r1,r2); r <= Math.max(r1,r2); r++)
    for (let c = Math.min(c1,c2); c <= Math.max(c1,c2); c++) {
      const v = evaluateCell(r, c);
      if (v !== '' && !isNaN(v)) vals.push(parseFloat(v));
    }
  return vals;
}

// ─── Render ──────────────────────────────────────────────────────────────────
function renderAll() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      renderCell(r, c);
    }
  }
  renderRange();
}

function renderCell(r, c) {
  const td = getCell(r, c);
  if (!td) return;
  const obj = getCellObj(r, c);
  const val = evaluateCell(r, c);
  const span = td.querySelector('.cell-display');

  td.className = '';
  let display = '';
  if (val === '' || val === undefined) {
    display = '';
  } else if (typeof val === 'number' || (typeof val === 'string' && !isNaN(val) && val !== '')) {
    const num = typeof val === 'number' ? val : parseFloat(val);
    const fmt = obj.numFormat || 'general';
    display = formatNumber(num, fmt);
    td.classList.add('num');
  } else if (typeof val === 'string' && val.startsWith('#')) {
    display = val;
    td.classList.add('err');
  } else {
    display = String(val);
  }

  if (obj.bold) td.classList.add('bold');
  if (obj.italic) td.classList.add('italic');
  if (obj.align) td.classList.add('align-' + obj.align);
  if (obj.bg) td.style.background = obj.bg;
  else td.style.background = '';
  if (obj.color) span.style.color = obj.color;
  else span.style.color = '';

  span.textContent = display;
}

function formatNumber(num, fmt) {
  switch (fmt) {
    case 'number': return num.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2});
    case 'integer': return Math.round(num).toLocaleString('de-DE');
    case 'currency': return num.toLocaleString('de-DE', {style:'currency', currency:'EUR'});
    case 'percent': return (num / 100).toLocaleString('de-DE', {style:'percent', minimumFractionDigits:1});
    case 'date': { const d = new Date(num); return isNaN(d) ? num : d.toLocaleDateString('de-DE'); }
    default: return String(num % 1 !== 0 ? parseFloat(num.toPrecision(10)) : num);
  }
}

// ─── Cell formatting ─────────────────────────────────────────────────────────
function applyCellFmt(prop) {
  forEachSelected((r, c) => {
    const obj = getCellObj(r, c);
    obj[prop] = !obj[prop];
    setCellObj(r, c, obj);
  });
  renderAll();
}

function setCellAlign(align) {
  forEachSelected((r, c) => setCellObj(r, c, {align}));
  renderAll();
}

function applyNumFormat() {
  const fmt = document.getElementById('numFormat').value;
  forEachSelected((r, c) => setCellObj(r, c, {numFormat: fmt}));
  renderAll();
}

function clearCell() {
  forEachSelected((r, c) => { delete cellData()[cellKey(r, c)]; });
  renderAll();
  updateFormulaBar();
}

function forEachSelected(fn) {
  if (selRange) {
    for (let r = selRange.r1; r <= selRange.r2; r++)
      for (let c = selRange.c1; c <= selRange.c2; c++) fn(r, c);
  } else {
    fn(selectedCell.r, selectedCell.c);
  }
}

// ─── Formula helpers ─────────────────────────────────────────────────────────
function insertFormulaSum() {
  const key = cellKey(selectedCell.r, selectedCell.c);
  const firstColKey = COL_LETTERS[selectedCell.c] + '1';
  const lastKey = COL_LETTERS[selectedCell.c] + selectedCell.r;
  const formula = `=SUM(${firstColKey}:${lastKey})`;
  startEdit(selectedCell.r, selectedCell.c, formula);
}
function insertFormulaAvg() {
  const firstColKey = COL_LETTERS[selectedCell.c] + '1';
  const lastKey = COL_LETTERS[selectedCell.c] + selectedCell.r;
  startEdit(selectedCell.r, selectedCell.c, `=AVERAGE(${firstColKey}:${lastKey})`);
}
function insertFormulaCount() {
  const firstColKey = COL_LETTERS[selectedCell.c] + '1';
  const lastKey = COL_LETTERS[selectedCell.c] + selectedCell.r;
  startEdit(selectedCell.r, selectedCell.c, `=COUNT(${firstColKey}:${lastKey})`);
}

// ─── Row/Col insert/delete ───────────────────────────────────────────────────
function insertRow() {
  const r = selectedCell.r;
  const newData = {};
  Object.entries(cellData()).forEach(([key, val]) => {
    const col = key.match(/[A-Z]+/)[0];
    const row = parseInt(key.match(/\d+/)[0]);
    if (row > r) newData[col + (row + 1)] = val;
    else newData[key] = val;
  });
  sheets[currentSheet].data = newData;
  renderAll();
}

function insertCol() {
  const c = selectedCell.c;
  const newData = {};
  Object.entries(cellData()).forEach(([key, val]) => {
    const colIdx = COL_LETTERS.indexOf(key.match(/[A-Z]+/)[0]);
    const row = key.match(/\d+/)[0];
    if (colIdx >= c) newData[COL_LETTERS[colIdx + 1] + row] = val;
    else newData[key] = val;
  });
  sheets[currentSheet].data = newData;
  renderAll();
}

function deleteRow() {
  const r = selectedCell.r;
  const newData = {};
  Object.entries(cellData()).forEach(([key, val]) => {
    const col = key.match(/[A-Z]+/)[0];
    const row = parseInt(key.match(/\d+/)[0]);
    if (row === r + 1) return;
    if (row > r + 1) newData[col + (row - 1)] = val;
    else newData[key] = val;
  });
  sheets[currentSheet].data = newData;
  renderAll();
}

function deleteCol() {
  const c = selectedCell.c;
  const newData = {};
  Object.entries(cellData()).forEach(([key, val]) => {
    const colIdx = COL_LETTERS.indexOf(key.match(/[A-Z]+/)[0]);
    const row = key.match(/\d+/)[0];
    if (colIdx === c) return;
    if (colIdx > c) newData[COL_LETTERS[colIdx - 1] + row] = val;
    else newData[key] = val;
  });
  sheets[currentSheet].data = newData;
  renderAll();
}

// ─── Selection stats ─────────────────────────────────────────────────────────
function updateSelStats() {
  if (!selRange) { document.getElementById('selStats').textContent = ''; return; }
  const vals = [];
  for (let r = selRange.r1; r <= selRange.r2; r++)
    for (let c = selRange.c1; c <= selRange.c2; c++) {
      const v = evaluateCell(r, c);
      if (v !== '' && !isNaN(v)) vals.push(parseFloat(v));
    }
  if (vals.length) {
    const sum = vals.reduce((s,x)=>s+x,0);
    const avg = sum / vals.length;
    document.getElementById('selStats').textContent = `Summe: ${sum.toFixed(2)} | Mittelwert: ${avg.toFixed(2)} | Anzahl: ${vals.length}`;
  }
}

// ─── Sheets ──────────────────────────────────────────────────────────────────
function renderSheetTabs() {
  const tabs = document.getElementById('sheetTabs');
  tabs.innerHTML = '';
  sheets.forEach((s, i) => {
    const tab = document.createElement('div');
    tab.className = 'sheet-tab' + (i === currentSheet ? ' active' : '');
    tab.innerHTML = `<span ondblclick="renameSheet(${i})" onclick="switchSheet(${i})">${s.name}</span>`;
    if (sheets.length > 1) {
      const x = document.createElement('span');
      x.className = 'tab-close'; x.textContent = '✕';
      x.onclick = (e) => { e.stopPropagation(); removeSheet(i); };
      tab.appendChild(x);
    }
    tabs.appendChild(tab);
  });
  const add = document.createElement('div');
  add.className = 'tab-add'; add.textContent = '+'; add.title = 'Neues Blatt';
  add.onclick = addSheet;
  tabs.appendChild(add);
}

function switchSheet(i) {
  if (isEditing) commitEdit();
  currentSheet = i;
  renderSheetTabs();
  renderAll();
  selectCell(0, 0);
}

function addSheet() {
  sheets.push({ name: 'Tabelle' + (sheets.length + 1), data: {} });
  switchSheet(sheets.length - 1);
}

function removeSheet(i) {
  if (!confirm('Tabellenblatt "' + sheets[i].name + '" löschen?')) return;
  sheets.splice(i, 1);
  currentSheet = Math.min(currentSheet, sheets.length - 1);
  renderSheetTabs();
  renderAll();
}

function renameSheet(i) {
  const name = prompt('Neuer Name:', sheets[i].name);
  if (name) { sheets[i].name = name; renderSheetTabs(); }
}

// ─── Save / Load ─────────────────────────────────────────────────────────────
function saveWorkbook() {
  const title = document.getElementById('docTitle').value.trim() || 'Unbenannte Tabelle';
  const wbs = getSaved();
  const idx = wbs.findIndex(w => w.title === title);
  const entry = { title, sheets: JSON.parse(JSON.stringify(sheets)), saved: new Date().toISOString() };
  if (idx >= 0) wbs[idx] = entry; else wbs.push(entry);
  localStorage.setItem('calc_wbs', JSON.stringify(wbs));
  setStatus(_t('calc.status.saved', '💾 Gespeichert: ') + title);
}

function getSaved() {
  try { return JSON.parse(localStorage.getItem('calc_wbs') || '[]'); } catch { return []; }
}

function newWorkbook() {
  if (!confirm('Neue Arbeitsmappe erstellen? Nicht gespeicherte Änderungen gehen verloren.')) return;
  sheets = [{ name: 'Tabelle1', data: {} }];
  currentSheet = 0;
  document.getElementById('docTitle').value = 'Unbenannte Tabelle';
  renderSheetTabs();
  renderAll();
  selectCell(0, 0);
}

function openWorkbook() {
  const wbs = getSaved();
  const list = document.getElementById('wbList');
  list.innerHTML = '';
  wbs.forEach((w, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = w.title + ' (' + new Date(w.saved).toLocaleString('de-DE') + ')';
    list.appendChild(opt);
  });
  openModal('openModal');
}

function loadSelectedWb() {
  const list = document.getElementById('wbList');
  if (list.selectedIndex < 0) return;
  const wbs = getSaved();
  const wb = wbs[parseInt(list.value)];
  if (!wb) return;
  sheets = wb.sheets;
  currentSheet = 0;
  document.getElementById('docTitle').value = wb.title;
  renderSheetTabs();
  renderAll();
  selectCell(0, 0);
  closeModal('openModal');
  setStatus(_t('calc.status.opened', 'Geöffnet: ') + wb.title);
}

function deleteSelectedWb() {
  const list = document.getElementById('wbList');
  if (list.selectedIndex < 0) return;
  const wbs = getSaved();
  wbs.splice(parseInt(list.value), 1);
  localStorage.setItem('calc_wbs', JSON.stringify(wbs));
  openWorkbook();
}

function exportCSV() {
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const v = evaluateCell(r, c);
      row.push(v === '' ? '' : '"' + String(v).replace(/"/g, '""') + '"');
    }
    rows.push(row.join(','));
  }
  // Trim empty rows
  while (rows.length && rows[rows.length-1].replace(/,/g,'').replace(/"/g,'').trim() === '') rows.pop();
  const title = document.getElementById('docTitle').value.trim() || 'tabelle';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([rows.join('\n')], {type:'text/csv;charset=utf-8;'}));
  a.download = title + '.csv';
  a.click();
}

// Modals
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));

function setStatus(msg) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  setTimeout(() => { el.textContent = _t('calc.status.ready', 'Bereit'); }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 's') { e.preventDefault(); saveWorkbook(); }
    if (e.key === 'n') { e.preventDefault(); newWorkbook(); }
    if (e.key === 'o') { e.preventDefault(); openWorkbook(); }
  }
});

// Auto-save
setInterval(() => { saveWorkbook(); }, 30000);

// Init
buildGrid();
renderSheetTabs();
renderAll();
selectCell(0, 0);
