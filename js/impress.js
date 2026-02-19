// ─── State ──────────────────────────────────────────────────────────────────
const SLIDE_W = 800, SLIDE_H = 450;
let slides = [];
let currentSlideIdx = 0;
let selectedEl = null;
let presentIdx = 0;

// ─── Slide model ─────────────────────────────────────────────────────────────
function newSlideData(layout = 'title') {
  const slide = { bg: '#ffffff', bgImg: '', elements: [], layout };
  if (layout === 'title') {
    slide.elements = [
      { id: uid(), type: 'text', x: 80, y: 150, w: 640, h: 80, text: 'Klicke hier für den Titel', fontSize: 36, fontFamily: 'Segoe UI', color: '#000000', bold: true, italic: false, align: 'center' },
      { id: uid(), type: 'text', x: 120, y: 260, w: 560, h: 60, text: 'Untertitel', fontSize: 20, fontFamily: 'Segoe UI', color: '#555555', bold: false, italic: false, align: 'center' },
    ];
  } else if (layout === 'content') {
    slide.elements = [
      { id: uid(), type: 'text', x: 40, y: 20, w: 720, h: 60, text: 'Folientitel', fontSize: 28, fontFamily: 'Segoe UI', color: '#000000', bold: true, italic: false, align: 'left' },
      { id: uid(), type: 'text', x: 40, y: 100, w: 720, h: 320, text: '• Punkt 1\n• Punkt 2\n• Punkt 3', fontSize: 18, fontFamily: 'Segoe UI', color: '#222222', bold: false, italic: false, align: 'left' },
    ];
  } else if (layout === 'two-col') {
    slide.elements = [
      { id: uid(), type: 'text', x: 40, y: 20, w: 720, h: 60, text: 'Folientitel', fontSize: 28, fontFamily: 'Segoe UI', color: '#000000', bold: true, italic: false, align: 'center' },
      { id: uid(), type: 'text', x: 20, y: 100, w: 360, h: 320, text: 'Linke Spalte\n\n• Punkt 1\n• Punkt 2', fontSize: 16, fontFamily: 'Segoe UI', color: '#222222', bold: false, italic: false, align: 'left' },
      { id: uid(), type: 'text', x: 420, y: 100, w: 360, h: 320, text: 'Rechte Spalte\n\n• Punkt A\n• Punkt B', fontSize: 16, fontFamily: 'Segoe UI', color: '#222222', bold: false, italic: false, align: 'left' },
    ];
  }
  return slide;
}

function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── Canvas scale ────────────────────────────────────────────────────────────
function getScale() {
  const area = document.getElementById('editArea');
  const maxW = area.clientWidth - 40;
  const maxH = area.clientHeight - 40;
  return Math.min(maxW / SLIDE_W, maxH / SLIDE_H, 1);
}

function setCanvasSize() {
  const scale = getScale();
  const canvas = document.getElementById('slideCanvas');
  canvas.style.width = SLIDE_W * scale + 'px';
  canvas.style.height = SLIDE_H * scale + 'px';
  canvas.dataset.scale = scale;
}

// ─── Render slide ────────────────────────────────────────────────────────────
function renderSlide() {
  const slide = slides[currentSlideIdx];
  const canvas = document.getElementById('slideCanvas');
  const scale = getScale();
  canvas.style.width = SLIDE_W * scale + 'px';
  canvas.style.height = SLIDE_H * scale + 'px';

  // Background
  if (slide.bgImg) {
    canvas.style.backgroundImage = `url(${slide.bgImg})`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
    canvas.style.backgroundColor = slide.bg || '#fff';
  } else {
    canvas.style.backgroundImage = 'none';
    canvas.style.backgroundColor = slide.bg || '#fff';
  }

  // Clear and re-render elements
  canvas.innerHTML = '';
  selectedEl = null;
  slide.elements.forEach(el => renderElement(el, scale));

  updateSlideBgControls(slide);
  updateSlideCounter();
}

function renderElement(el, scale) {
  const canvas = document.getElementById('slideCanvas');
  let dom;
  if (el.type === 'text') {
    dom = document.createElement('div');
    dom.className = 'element text-el';
    dom.contentEditable = false;
    dom.style.left = (el.x * scale) + 'px';
    dom.style.top = (el.y * scale) + 'px';
    dom.style.width = (el.w * scale) + 'px';
    dom.style.minHeight = (el.h * scale) + 'px';
    dom.style.fontSize = (el.fontSize * scale) + 'px';
    dom.style.fontFamily = el.fontFamily || 'Segoe UI';
    dom.style.color = el.color || '#000';
    dom.style.fontWeight = el.bold ? 'bold' : 'normal';
    dom.style.fontStyle = el.italic ? 'italic' : 'normal';
    dom.style.textAlign = el.align || 'left';
    dom.style.whiteSpace = 'pre-wrap';
    dom.style.lineHeight = '1.3';
    dom.textContent = el.text;
    dom.addEventListener('dblclick', () => startTextEdit(el, dom, scale));
  } else if (el.type === 'image') {
    dom = document.createElement('div');
    dom.className = 'element image-el';
    dom.style.left = (el.x * scale) + 'px';
    dom.style.top = (el.y * scale) + 'px';
    dom.style.width = (el.w * scale) + 'px';
    dom.style.height = (el.h * scale) + 'px';
    const img = document.createElement('img');
    img.src = el.src;
    img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
    dom.appendChild(img);
  } else if (el.type === 'shape') {
    dom = document.createElement('div');
    dom.className = 'element shape-el';
    dom.style.left = (el.x * scale) + 'px';
    dom.style.top = (el.y * scale) + 'px';
    dom.style.width = (el.w * scale) + 'px';
    dom.style.height = (el.h * scale) + 'px';
    dom.style.backgroundColor = el.fill || '#0078d4';
    dom.style.borderRadius = el.shape === 'circle' ? '50%' : '4px';
    dom.style.border = `2px solid ${el.stroke || '#005a9e'}`;
    dom.style.opacity = el.opacity || 1;
  }

  dom.dataset.id = el.id;

  // Delete button
  const del = document.createElement('div');
  del.className = 'el-delete'; del.textContent = '✕';
  del.addEventListener('click', (e) => { e.stopPropagation(); deleteElement(el.id); });
  dom.appendChild(del);

  // Resize handle
  const res = document.createElement('div');
  res.className = 'el-resize';
  res.addEventListener('mousedown', (e) => startResize(e, el, dom, scale));
  dom.appendChild(res);

  // Drag
  dom.addEventListener('mousedown', (e) => {
    if (e.target === del || e.target === res) return;
    if (e.target.closest('.el-resize')) return;
    e.preventDefault();
    selectElement(el.id);
    startDrag(e, el, dom, scale);
  });

  // Click to select
  dom.addEventListener('click', (e) => { e.stopPropagation(); selectElement(el.id); });

  canvas.appendChild(dom);
}

function startTextEdit(el, dom, scale) {
  dom.contentEditable = true;
  dom.focus();
  dom.addEventListener('blur', () => {
    el.text = dom.innerText;
    dom.contentEditable = false;
    renderThumbnail(currentSlideIdx);
  }, {once: true});
}

// ─── Drag ────────────────────────────────────────────────────────────────────
function startDrag(e, el, dom, scale) {
  const startX = e.clientX, startY = e.clientY;
  const origX = el.x, origY = el.y;
  function onMove(e) {
    el.x = origX + (e.clientX - startX) / scale;
    el.y = origY + (e.clientY - startY) / scale;
    dom.style.left = (el.x * scale) + 'px';
    dom.style.top = (el.y * scale) + 'px';
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    renderThumbnail(currentSlideIdx);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function startResize(e, el, dom, scale) {
  e.stopPropagation();
  const startX = e.clientX, startY = e.clientY;
  const origW = el.w, origH = el.h;
  function onMove(e) {
    el.w = Math.max(40, origW + (e.clientX - startX) / scale);
    el.h = Math.max(20, origH + (e.clientY - startY) / scale);
    dom.style.width = (el.w * scale) + 'px';
    if (el.type !== 'text') dom.style.height = (el.h * scale) + 'px';
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    renderThumbnail(currentSlideIdx);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  e.preventDefault();
}

// ─── Select element ──────────────────────────────────────────────────────────
function selectElement(id) {
  document.querySelectorAll('.element.selected').forEach(e => e.classList.remove('selected'));
  const dom = document.querySelector(`[data-id="${id}"]`);
  if (dom) dom.classList.add('selected');
  const slide = slides[currentSlideIdx];
  selectedEl = slide.elements.find(e => e.id === id);
  renderElProps();
}

document.getElementById('slideCanvas').addEventListener('click', e => {
  if (e.target === document.getElementById('slideCanvas')) {
    document.querySelectorAll('.element.selected').forEach(el => el.classList.remove('selected'));
    selectedEl = null;
    renderElProps();
  }
});

function deleteElement(id) {
  const slide = slides[currentSlideIdx];
  slide.elements = slide.elements.filter(e => e.id !== id);
  renderSlide();
  renderThumbnail(currentSlideIdx);
  selectedEl = null;
  renderElProps();
}

// ─── Element properties ──────────────────────────────────────────────────────
function renderElProps() {
  const panel = document.getElementById('elProps');
  if (!selectedEl) { panel.innerHTML = '<p style="color:#777; font-size:12px;">Kein Element ausgewählt</p>'; return; }
  const el = selectedEl;
  let html = '';
  if (el.type === 'text') {
    html = `
      <div class="prop-row"><label>Text</label><input type="text" value="${escHtml(el.text || '')}" oninput="updateElProp('text', this.value); refreshTextEl()" /></div>
      <div class="prop-row"><label>Schriftgröße</label><input type="number" value="${el.fontSize||18}" min="6" max="200" oninput="updateElProp('fontSize', +this.value); refreshTextEl()" /></div>
      <div class="prop-row"><label>Schriftart</label>
        <select onchange="updateElProp('fontFamily', this.value); refreshTextEl()">
          ${['Segoe UI','Arial','Georgia','Times New Roman','Courier New','Verdana'].map(f=>`<option ${el.fontFamily===f?'selected':''}>${f}</option>`).join('')}
        </select></div>
      <div class="prop-row"><label>Textfarbe</label><input type="color" value="${el.color||'#000000'}" oninput="updateElProp('color', this.value); refreshTextEl()" /></div>
      <div class="prop-row"><label>Ausrichtung</label>
        <select onchange="updateElProp('align', this.value); refreshTextEl()">
          ${['left','center','right'].map(a=>`<option value="${a}" ${el.align===a?'selected':''}>${a==='left'?'Links':a==='center'?'Mitte':'Rechts'}</option>`).join('')}
        </select></div>
      <div class="prop-row"><label><input type="checkbox" ${el.bold?'checked':''} onchange="updateElProp('bold', this.checked); refreshTextEl()"> Fett</label></div>
      <div class="prop-row"><label><input type="checkbox" ${el.italic?'checked':''} onchange="updateElProp('italic', this.checked); refreshTextEl()"> Kursiv</label></div>
    `;
  } else if (el.type === 'shape') {
    html = `
      <div class="prop-row"><label>Füllfarbe</label><input type="color" value="${el.fill||'#0078d4'}" oninput="updateElProp('fill', this.value); refreshShapeEl()" /></div>
      <div class="prop-row"><label>Rahmenfarbe</label><input type="color" value="${el.stroke||'#005a9e'}" oninput="updateElProp('stroke', this.value); refreshShapeEl()" /></div>
      <div class="prop-row"><label>Deckkraft</label><input type="range" min="0.1" max="1" step="0.05" value="${el.opacity||1}" oninput="updateElProp('opacity', +this.value); refreshShapeEl()" /></div>
    `;
  } else if (el.type === 'image') {
    html = `<div class="prop-row"><label>Bild-URL</label><input type="text" value="${escHtml(el.src||'')}" oninput="updateElProp('src', this.value); renderSlide()" /></div>`;
  }
  html += `
    <div class="prop-row"><label>X</label><input type="number" value="${Math.round(el.x)}" oninput="updateElProp('x', +this.value); renderSlide()" /></div>
    <div class="prop-row"><label>Y</label><input type="number" value="${Math.round(el.y)}" oninput="updateElProp('y', +this.value); renderSlide()" /></div>
    <div class="prop-row"><label>Breite</label><input type="number" value="${Math.round(el.w)}" oninput="updateElProp('w', +this.value); renderSlide()" /></div>
    ${el.type !== 'text' ? `<div class="prop-row"><label>Höhe</label><input type="number" value="${Math.round(el.h)}" oninput="updateElProp('h', +this.value); renderSlide()" /></div>` : ''}
    <button class="prop-btn prop-btn-secondary" style="margin-top:8px;" onclick="deleteElement('${el.id}')">🗑 Element löschen</button>
  `;
  panel.innerHTML = html;
}

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function updateElProp(key, val) {
  if (selectedEl) {
    selectedEl[key] = val;
    renderThumbnail(currentSlideIdx);
  }
}

function refreshTextEl() {
  if (!selectedEl) return;
  const el = selectedEl;
  const scale = getScale();
  const dom = document.querySelector(`[data-id="${el.id}"]`);
  if (!dom) return;
  dom.style.fontSize = (el.fontSize * scale) + 'px';
  dom.style.color = el.color;
  dom.style.fontFamily = el.fontFamily;
  dom.style.fontWeight = el.bold ? 'bold' : 'normal';
  dom.style.fontStyle = el.italic ? 'italic' : 'normal';
  dom.style.textAlign = el.align;
  dom.textContent = el.text;
  // re-add delete/resize
  const del = document.createElement('div');
  del.className = 'el-delete'; del.textContent = '✕';
  del.addEventListener('click', (e) => { e.stopPropagation(); deleteElement(el.id); });
  dom.appendChild(del);
  const res = document.createElement('div');
  res.className = 'el-resize';
  res.addEventListener('mousedown', (e) => startResize(e, el, dom, scale));
  dom.appendChild(res);
}

function refreshShapeEl() {
  if (!selectedEl) return;
  const el = selectedEl;
  const dom = document.querySelector(`[data-id="${el.id}"]`);
  if (!dom) return;
  dom.style.backgroundColor = el.fill;
  dom.style.borderColor = el.stroke;
  dom.style.opacity = el.opacity;
}

// ─── Slide background ────────────────────────────────────────────────────────
function setSlideBackground() {
  const slide = slides[currentSlideIdx];
  slide.bg = document.getElementById('slideBgColor').value;
  slide.bgImg = document.getElementById('slideBgImg').value;
  renderSlide();
  renderThumbnail(currentSlideIdx);
}
function clearSlideBg() {
  document.getElementById('slideBgColor').value = '#ffffff';
  document.getElementById('slideBgImg').value = '';
  setSlideBackground();
}
function updateSlideBgControls(slide) {
  document.getElementById('slideBgColor').value = slide.bg || '#ffffff';
  document.getElementById('slideBgImg').value = slide.bgImg || '';
}

// ─── Add elements ────────────────────────────────────────────────────────────
function addTextElement() {
  const slide = slides[currentSlideIdx];
  const el = { id: uid(), type: 'text', x: 80, y: 100, w: 400, h: 60, text: 'Neuer Text', fontSize: 20, fontFamily: 'Segoe UI', color: '#000000', bold: false, italic: false, align: 'left' };
  slide.elements.push(el);
  renderSlide();
  renderThumbnail(currentSlideIdx);
  selectElement(el.id);
}

function addImageElement() { openModal('imgElModal'); }
function handleImgElFile() {
  const file = document.getElementById('imgElFile').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('imgElURL').value = e.target.result; };
  reader.readAsDataURL(file);
}
function doAddImageElement() {
  const src = document.getElementById('imgElURL').value.trim();
  if (!src) return;
  const slide = slides[currentSlideIdx];
  const el = { id: uid(), type: 'image', x: 100, y: 80, w: 300, h: 200, src };
  slide.elements.push(el);
  renderSlide();
  renderThumbnail(currentSlideIdx);
  closeModal('imgElModal');
}

function addShapeRect() {
  const slide = slides[currentSlideIdx];
  const el = { id: uid(), type: 'shape', shape: 'rect', x: 100, y: 100, w: 200, h: 120, fill: '#0078d4', stroke: '#005a9e', opacity: 1 };
  slide.elements.push(el);
  renderSlide();
  renderThumbnail(currentSlideIdx);
  selectElement(el.id);
}

function addShapeCircle() {
  const slide = slides[currentSlideIdx];
  const el = { id: uid(), type: 'shape', shape: 'circle', x: 100, y: 100, w: 150, h: 150, fill: '#c0392b', stroke: '#922b21', opacity: 1 };
  slide.elements.push(el);
  renderSlide();
  renderThumbnail(currentSlideIdx);
  selectElement(el.id);
}

// ─── Apply layout ─────────────────────────────────────────────────────────────
function applyLayout() {
  const layout = document.getElementById('layoutSelect').value;
  if (!confirm('Layout anwenden? Aktuelle Elemente bleiben erhalten.')) return;
  const slide = slides[currentSlideIdx];
  const newSlide = newSlideData(layout);
  newSlide.elements.forEach(el => slide.elements.push(el));
  renderSlide();
  renderThumbnail(currentSlideIdx);
}

// ─── Slide management ────────────────────────────────────────────────────────
function addSlide() {
  const layout = document.getElementById('layoutSelect').value;
  const slide = newSlideData(layout);
  slides.splice(currentSlideIdx + 1, 0, slide);
  switchSlide(currentSlideIdx + 1);
}

function duplicateSlide() {
  const slide = JSON.parse(JSON.stringify(slides[currentSlideIdx]));
  slide.elements.forEach(el => el.id = uid());
  slides.splice(currentSlideIdx + 1, 0, slide);
  switchSlide(currentSlideIdx + 1);
}

function deleteCurrentSlide() {
  if (slides.length <= 1) { setStatus('Mindestens eine Folie erforderlich'); return; }
  if (!confirm('Folie löschen?')) return;
  slides.splice(currentSlideIdx, 1);
  switchSlide(Math.min(currentSlideIdx, slides.length - 1));
}

function moveSlideUp() {
  if (currentSlideIdx === 0) return;
  [slides[currentSlideIdx-1], slides[currentSlideIdx]] = [slides[currentSlideIdx], slides[currentSlideIdx-1]];
  switchSlide(currentSlideIdx - 1);
}

function moveSlideDown() {
  if (currentSlideIdx >= slides.length - 1) return;
  [slides[currentSlideIdx+1], slides[currentSlideIdx]] = [slides[currentSlideIdx], slides[currentSlideIdx+1]];
  switchSlide(currentSlideIdx + 1);
}

function switchSlide(idx) {
  currentSlideIdx = idx;
  renderSlide();
  renderAllThumbnails();
  updateSlideCounter();
}

function updateSlideCounter() {
  document.getElementById('slideCounter').textContent = `Folie ${currentSlideIdx+1} / ${slides.length}`;
}

// ─── Thumbnails ──────────────────────────────────────────────────────────────
function renderAllThumbnails() {
  const panel = document.getElementById('slidePanel');
  panel.innerHTML = '';
  slides.forEach((_, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'slide-thumb' + (i === currentSlideIdx ? ' active' : '');
    thumb.addEventListener('click', () => switchSlide(i));
    const num = document.createElement('div');
    num.className = 'slide-thumb-num'; num.textContent = i + 1;
    thumb.appendChild(renderThumbnailCanvas(i));
    thumb.appendChild(num);
    panel.appendChild(thumb);
  });
}

function renderThumbnailCanvas(idx) {
  const slide = slides[idx];
  const canvas = document.createElement('canvas');
  const scale = 180 / SLIDE_W;
  canvas.width = 180;
  canvas.height = Math.round(SLIDE_H * scale);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = slide.bg || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Elements
  slide.elements.forEach(el => {
    if (el.type === 'text') {
      ctx.save();
      ctx.fillStyle = el.color || '#000';
      ctx.font = `${el.bold?'bold ':''} ${el.italic?'italic ':''} ${el.fontSize * scale}px ${el.fontFamily || 'Segoe UI'}`;
      ctx.textAlign = el.align || 'left';
      const lines = (el.text || '').split('\n');
      lines.forEach((line, li) => {
        const xPos = el.align === 'center' ? (el.x + el.w/2) * scale : el.align === 'right' ? (el.x + el.w) * scale : el.x * scale;
        ctx.fillText(line, xPos, (el.y + 5 + (li+1) * el.fontSize * 1.3) * scale);
      });
      ctx.restore();
    } else if (el.type === 'shape') {
      ctx.save();
      ctx.globalAlpha = el.opacity || 1;
      ctx.fillStyle = el.fill || '#0078d4';
      ctx.strokeStyle = el.stroke || '#005a9e';
      ctx.lineWidth = 1;
      if (el.shape === 'circle') {
        ctx.beginPath();
        ctx.ellipse((el.x + el.w/2)*scale, (el.y + el.h/2)*scale, (el.w/2)*scale, (el.h/2)*scale, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
      } else {
        ctx.fillRect(el.x*scale, el.y*scale, el.w*scale, el.h*scale);
        ctx.strokeRect(el.x*scale, el.y*scale, el.w*scale, el.h*scale);
      }
      ctx.restore();
    } else if (el.type === 'image') {
      // Draw placeholder for image thumbnail
      ctx.save();
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(el.x*scale, el.y*scale, el.w*scale, el.h*scale);
      ctx.fillStyle = '#999';
      ctx.font = `${10}px Segoe UI`;
      ctx.textAlign = 'center';
      ctx.fillText('🖼', (el.x + el.w/2)*scale, (el.y + el.h/2)*scale + 4);
      ctx.restore();
    }
  });

  return canvas;
}

function renderThumbnail(idx) {
  const panel = document.getElementById('slidePanel');
  const thumbs = panel.querySelectorAll('.slide-thumb');
  if (thumbs[idx]) {
    const newCanvas = renderThumbnailCanvas(idx);
    const oldCanvas = thumbs[idx].querySelector('canvas');
    if (oldCanvas) thumbs[idx].replaceChild(newCanvas, oldCanvas);
    else thumbs[idx].insertBefore(newCanvas, thumbs[idx].firstChild);
  }
}

// ─── Present mode ────────────────────────────────────────────────────────────
function startPresent() {
  presentIdx = currentSlideIdx;
  showPresentSlide();
  document.getElementById('presentOverlay').classList.add('open');
  document.addEventListener('keydown', presentKeydown);
}

function showPresentSlide() {
  const slide = slides[presentIdx];
  const overlay = document.getElementById('presentSlide');
  const scale = Math.min((window.innerWidth - 40) / SLIDE_W, (window.innerHeight - 80) / SLIDE_H);
  overlay.style.width = SLIDE_W * scale + 'px';
  overlay.style.height = SLIDE_H * scale + 'px';
  overlay.style.backgroundColor = slide.bg || '#fff';
  if (slide.bgImg) {
    overlay.style.backgroundImage = `url(${slide.bgImg})`;
    overlay.style.backgroundSize = 'cover';
    overlay.style.backgroundPosition = 'center';
  } else {
    overlay.style.backgroundImage = 'none';
  }
  overlay.innerHTML = '';
  slide.elements.forEach(el => {
    const dom = document.createElement('div');
    dom.style.position = 'absolute';
    dom.style.left = (el.x * scale) + 'px';
    dom.style.top = (el.y * scale) + 'px';
    dom.style.width = (el.w * scale) + 'px';
    if (el.type === 'text') {
      dom.style.padding = '4px 8px';
      dom.style.fontSize = (el.fontSize * scale) + 'px';
      dom.style.fontFamily = el.fontFamily || 'Segoe UI';
      dom.style.color = el.color || '#000';
      dom.style.fontWeight = el.bold ? 'bold' : 'normal';
      dom.style.fontStyle = el.italic ? 'italic' : 'normal';
      dom.style.textAlign = el.align || 'left';
      dom.style.whiteSpace = 'pre-wrap';
      dom.style.lineHeight = '1.3';
      dom.textContent = el.text;
    } else if (el.type === 'shape') {
      dom.style.height = (el.h * scale) + 'px';
      dom.style.backgroundColor = el.fill || '#0078d4';
      dom.style.borderRadius = el.shape === 'circle' ? '50%' : '4px';
      dom.style.border = `2px solid ${el.stroke || '#005a9e'}`;
      dom.style.opacity = el.opacity || 1;
    } else if (el.type === 'image') {
      dom.style.height = (el.h * scale) + 'px';
      const img = document.createElement('img');
      img.src = el.src;
      img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
      dom.appendChild(img);
    }
    overlay.appendChild(dom);
  });
  document.getElementById('presentCounter').textContent = `${presentIdx + 1} / ${slides.length}`;
}

function nextPresentSlide() {
  if (presentIdx < slides.length - 1) { presentIdx++; showPresentSlide(); }
}
function prevPresentSlide() {
  if (presentIdx > 0) { presentIdx--; showPresentSlide(); }
}
function endPresent() {
  document.getElementById('presentOverlay').classList.remove('open');
  document.removeEventListener('keydown', presentKeydown);
}
function presentKeydown(e) {
  if (e.key === 'Escape') endPresent();
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') nextPresentSlide();
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPresentSlide();
}

// ─── Save / Load ─────────────────────────────────────────────────────────────
function savePresentation() {
  const title = document.getElementById('docTitle').value.trim() || 'Unbenannte Präsentation';
  const saved = getSaved();
  const idx = saved.findIndex(p => p.title === title);
  const entry = { title, slides: JSON.parse(JSON.stringify(slides)), saved: new Date().toISOString() };
  if (idx >= 0) saved[idx] = entry; else saved.push(entry);
  localStorage.setItem('impress_pres', JSON.stringify(saved));
  setStatus('💾 Gespeichert: ' + title);
}

function getSaved() {
  try { return JSON.parse(localStorage.getItem('impress_pres') || '[]'); } catch { return []; }
}

function newPresentation() {
  if (!confirm('Neue Präsentation? Nicht gespeicherte Änderungen gehen verloren.')) return;
  slides = [newSlideData('title')];
  currentSlideIdx = 0;
  document.getElementById('docTitle').value = 'Unbenannte Präsentation';
  renderSlide();
  renderAllThumbnails();
}

function openPresentation() {
  const saved = getSaved();
  const list = document.getElementById('pressList');
  list.innerHTML = '';
  saved.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = p.title + ' (' + new Date(p.saved).toLocaleString('de-DE') + ')';
    list.appendChild(opt);
  });
  openModal('openModal');
}

function loadSelectedPres() {
  const list = document.getElementById('pressList');
  if (list.selectedIndex < 0) return;
  const saved = getSaved();
  const pres = saved[parseInt(list.value)];
  if (!pres) return;
  slides = pres.slides;
  currentSlideIdx = 0;
  document.getElementById('docTitle').value = pres.title;
  renderSlide();
  renderAllThumbnails();
  closeModal('openModal');
  setStatus('Geöffnet: ' + pres.title);
}

function deleteSelectedPres() {
  const list = document.getElementById('pressList');
  if (list.selectedIndex < 0) return;
  const saved = getSaved();
  saved.splice(parseInt(list.value), 1);
  localStorage.setItem('impress_pres', JSON.stringify(saved));
  openPresentation();
}

// Modals
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));

function setStatus(msg) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  setTimeout(() => el.textContent = 'Bereit', 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (document.getElementById('presentOverlay').classList.contains('open')) return;
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 's') { e.preventDefault(); savePresentation(); }
    if (e.key === 'n') { e.preventDefault(); newPresentation(); }
    if (e.key === 'o') { e.preventDefault(); openPresentation(); }
  }
  if (e.key === 'Delete' && selectedEl && document.activeElement === document.body) {
    deleteElement(selectedEl.id);
  }
});

window.addEventListener('resize', () => { renderSlide(); renderAllThumbnails(); });

// Auto-save
setInterval(() => { savePresentation(); }, 30000);

// Init
slides = [newSlideData('title')];
renderSlide();
renderAllThumbnails();
updateSlideCounter();
