/**
 * MAIN.JS - Lógica principal del sitio
 * Inventario con filtros reales, paginación, modal, calculadora de cuotas y formulario de citas
 */

const WHATSAPP = '593999000111';
const PAGE_SIZE = 6;
const DEFAULT_RATE = 11.5;   // Tasa anual referencial (%)
const DEFAULT_DOWN = 30;     // Entrada referencial (%)
const DEFAULT_TERM = 48;     // Plazo referencial (meses)

const CONDITION_LABELS = { nuevo: 'Nuevo', seminuevo: 'Seminuevo' };
const FACETS = ['condition', 'brand', 'fuel', 'trans'];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ───────────── Utilidades ───────────── */

function formatPrice(n) {
  return '$' + Math.round(n).toLocaleString('es-EC');
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function carTitle(car) {
  return `${car.brand} ${car.model} ${car.year}`;
}

/** Cuota mensual con sistema francés */
function monthlyPayment(price, downPct = DEFAULT_DOWN, months = DEFAULT_TERM, annualRate = DEFAULT_RATE) {
  const principal = price * (1 - downPct / 100);
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return principal * r / (1 - Math.pow(1 + r, -months));
}

function uniqueValues(key) {
  return [...new Set(INVENTORY.map(c => c[key]))].sort((a, b) => String(a).localeCompare(String(b), 'es'));
}

/* ───────────── Ilustración del vehículo ───────────── */

// Tono aproximado a partir del nombre del color
const COLOR_TONES = [
  [/blanc|perla|glaciar/i, '#e8e8e6'],
  [/negr|cosmos/i, '#1c1c1e'],
  [/plat|selenita|lunar/i, '#b9bdc2'],
  [/gris|granito|mineral|máquina/i, '#6c7178'],
  [/roj|soul|rally/i, '#a3191f'],
  [/azul/i, '#1d4a8f'],
  [/verde/i, '#2e5442']
];

function colorTone(name = '') {
  const match = COLOR_TONES.find(([re]) => re.test(name));
  return match ? match[1] : '#8a8f96';
}

// Siluetas laterales por categoría (viewBox 0 0 240 100)
const SHAPES = {
  'Sedán': {
    body: 'M12 74 C12 66 16 62 28 60 L64 55 L92 38 C98 34 104 32 114 32 L148 32 C158 32 166 35 174 41 L194 55 L218 59 C226 61 228 65 228 71 L228 76 L12 76 Z',
    glass: 'M96 53 L110 39 C113 37 116 36 120 36 L146 36 C154 36 160 39 166 44 L176 53 Z',
    pillar: 136, wheels: [60, 186]
  },
  'SUV': {
    body: 'M12 76 L13 60 C14 54 20 51 30 50 L58 47 L76 28 C80 24 86 22 94 22 L180 22 C188 22 192 25 196 31 L208 47 L220 50 C226 52 228 56 228 62 L228 76 Z',
    glass: 'M82 45 L96 29 L186 29 L198 45 Z',
    pillar: 140, wheels: [58, 186]
  },
  'Pickup': {
    body: 'M12 76 L12 56 C12 52 16 50 22 50 L62 47 L80 26 C83 23 86 22 92 22 L142 22 C148 22 150 24 150 30 L150 48 L226 48 C228 48 229 50 229 52 L229 76 Z',
    glass: 'M86 44 L99 28 L142 28 L142 44 Z',
    pillar: 118, wheels: [56, 192]
  },
  'Hatchback': {
    body: 'M16 74 C16 66 20 62 32 60 L66 55 L94 34 C98 31 104 30 112 30 L176 30 C184 30 188 34 191 42 L198 60 C200 64 202 68 202 76 L16 76 Z',
    glass: 'M98 52 L112 36 L176 36 L184 52 Z',
    pillar: 142, wheels: [62, 168]
  }
};

let svgUid = 0;

function carSVG(car) {
  if (car.img) {
    return `<img src="${escapeHTML(car.img)}" alt="${escapeHTML(carTitle(car))}" loading="lazy">`;
  }
  const shape = SHAPES[car.type] || SHAPES['Sedán'];
  const tone = colorTone(car.color);
  const id = 'c' + (++svgUid);
  const wheel = x => `
    <circle cx="${x}" cy="76" r="14" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="2"/>
    <circle cx="${x}" cy="76" r="7.5" fill="#3a3a3c"/>
    <circle cx="${x}" cy="76" r="2.5" fill="#777"/>`;

  return `
  <svg class="car-svg" viewBox="0 0 240 100" role="img" aria-label="${escapeHTML(carTitle(car))}, color ${escapeHTML(car.color)}">
    <defs>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
        <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".35"/>
      </linearGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#000" stop-opacity=".9"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="${id}c"><path d="${shape.glass}"/></clipPath>
    </defs>
    <ellipse cx="120" cy="88" rx="112" ry="7" fill="url(#${id}g)"/>
    <path d="${shape.body}" fill="${tone}"/>
    <path d="${shape.body}" fill="url(#${id}s)"/>
    <path d="${shape.glass}" fill="#0b0d10" opacity=".88"/>
    <line x1="${shape.pillar}" y1="0" x2="${shape.pillar}" y2="100" stroke="${tone}" stroke-width="3" clip-path="url(#${id}c)"/>
    <line x1="24" y1="64" x2="216" y2="64" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>
    ${shape.wheels.map(wheel).join('')}
  </svg>`;
}

/* ───────────── Estado del inventario ───────────── */

const PRICE_MAX = Math.ceil(Math.max(...INVENTORY.map(c => c.price)) / 1000) * 1000;
const PRICE_MIN = Math.floor(Math.min(...INVENTORY.map(c => c.price)) / 1000) * 1000;
const YEARS = uniqueValues('year');

const state = {
  q: '',
  type: '',
  condition: new Set(),
  brand: new Set(),
  fuel: new Set(),
  trans: new Set(),
  priceMax: PRICE_MAX,
  yearMin: YEARS[0],
  yearMax: YEARS[YEARS.length - 1],
  sort: 'featured',
  page: 1,
  view: 'grid'
};

function matches(car, skip) {
  const q = state.q.trim().toLowerCase();
  if (q && !`${car.brand} ${car.model}`.toLowerCase().includes(q)) return false;
  if (skip !== 'type' && state.type && car.type !== state.type) return false;
  for (const f of FACETS) {
    if (f !== skip && state[f].size && !state[f].has(car[f])) return false;
  }
  return car.price <= state.priceMax && car.year >= state.yearMin && car.year <= state.yearMax;
}

function filteredCars() {
  const cars = INVENTORY.filter(c => matches(c));
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'year-desc': (a, b) => b.year - a.year,
    'km-asc': (a, b) => a.km - b.km
  };
  return sorters[state.sort] ? cars.sort(sorters[state.sort]) : cars;
}

function activeFilterCount() {
  return FACETS.reduce((n, f) => n + state[f].size, 0)
    + (state.type ? 1 : 0)
    + (state.priceMax < PRICE_MAX ? 1 : 0)
    + (state.yearMin !== YEARS[0] || state.yearMax !== YEARS[YEARS.length - 1] ? 1 : 0);
}

/* ───────────── Render ───────────── */

function buildFilters() {
  // Facetas con checkbox
  FACETS.forEach(facet => {
    const box = $(`[data-facet="${facet}"] .filter-options`);
    box.innerHTML = uniqueValues(facet).map(value => `
      <label class="check">
        <input type="checkbox" value="${escapeHTML(value)}" data-facet="${facet}">
        <span class="check-label">${escapeHTML(CONDITION_LABELS[value] || value)}</span>
        <span class="check-count" data-count="${facet}:${escapeHTML(value)}"></span>
      </label>`).join('');
  });

  // Chips de categoría
  const types = uniqueValues('type');
  $('#type-chips').innerHTML = ['', ...types].map(t => `
    <button type="button" class="chip${t === '' ? ' active' : ''}" data-type="${escapeHTML(t)}">${t || 'Todos'}</button>`).join('');

  // Precio
  const range = $('#price-range');
  range.min = PRICE_MIN;
  range.max = PRICE_MAX;
  range.value = PRICE_MAX;

  // Años
  const yearOpts = YEARS.map(y => `<option value="${y}">${y}</option>`).join('');
  $('#year-min').innerHTML = yearOpts;
  $('#year-max').innerHTML = yearOpts;
  $('#year-min').value = state.yearMin;
  $('#year-max').value = state.yearMax;

  // Búsqueda rápida y formulario
  $('#qs-brand').insertAdjacentHTML('beforeend', uniqueValues('brand').map(b => `<option>${escapeHTML(b)}</option>`).join(''));
  $('#qs-type').insertAdjacentHTML('beforeend', types.map(t => `<option>${escapeHTML(t)}</option>`).join(''));
  $('#f-vehiculo').insertAdjacentHTML('beforeend', INVENTORY.map(c => `<option>${escapeHTML(carTitle(c))}</option>`).join(''));
}

function syncFilterUI() {
  // Contadores dinámicos: cuántos resultados habría al marcar cada opción
  FACETS.forEach(facet => {
    $$(`[data-count^="${facet}:"]`).forEach(el => {
      const value = el.dataset.count.slice(facet.length + 1);
      const n = INVENTORY.filter(c => String(c[facet]) === value && matches(c, facet)).length;
      el.textContent = n;
      el.closest('.check').classList.toggle('is-empty', n === 0);
    });
    $$(`input[data-facet="${facet}"]`).forEach(cb => { cb.checked = state[facet].has(cb.value); });
  });

  $$('#type-chips .chip').forEach(chip => chip.classList.toggle('active', chip.dataset.type === state.type));
  $('#price-range').value = state.priceMax;
  $('#price-out').textContent = formatPrice(state.priceMax);
  $('#year-min').value = state.yearMin;
  $('#year-max').value = state.yearMax;
  $('#search').value = state.q;
  $('#sort').value = state.sort;

  const n = activeFilterCount();
  const badge = $('#filters-badge');
  badge.hidden = n === 0;
  badge.textContent = n;

  // Etiquetas de filtros activos
  const tags = [];
  if (state.type) tags.push({ label: state.type, clear: () => { state.type = ''; } });
  FACETS.forEach(f => state[f].forEach(v => tags.push({ label: CONDITION_LABELS[v] || v, clear: () => state[f].delete(v) })));
  if (state.priceMax < PRICE_MAX) tags.push({ label: `Hasta ${formatPrice(state.priceMax)}`, clear: () => { state.priceMax = PRICE_MAX; } });
  if (state.yearMin !== YEARS[0] || state.yearMax !== YEARS[YEARS.length - 1]) {
    tags.push({ label: `${state.yearMin}–${state.yearMax}`, clear: () => { state.yearMin = YEARS[0]; state.yearMax = YEARS[YEARS.length - 1]; } });
  }
  const box = $('#active-filters');
  box.innerHTML = tags.map((t, i) => `<button type="button" class="tag" data-tag="${i}">${escapeHTML(t.label)} <span aria-hidden="true">✕</span></button>`).join('');
  box._tags = tags;
}

function renderCard(car) {
  const fee = monthlyPayment(car.price);
  return `
  <article class="car-card">
    <button type="button" class="car-media" data-open="${car.id}" aria-label="Ver detalles de ${escapeHTML(carTitle(car))}">
      ${carSVG(car)}
      <span class="car-badge">${CONDITION_LABELS[car.condition] || escapeHTML(car.condition)}</span>
    </button>
    <div class="car-body">
      <p class="car-brand">${escapeHTML(car.brand)}</p>
      <h3 class="car-name">${escapeHTML(car.model)}</h3>
      <ul class="car-specs">
        <li>${car.year}</li>
        <li>${car.km === 0 ? '0 km' : car.km.toLocaleString('es-EC') + ' km'}</li>
        <li>${escapeHTML(car.fuel)}</li>
        <li>${escapeHTML(car.trans)}</li>
      </ul>
      <div class="car-foot">
        <div class="car-price">
          <span>Precio</span>
          <strong>${formatPrice(car.price)}</strong>
          <small>o ${formatPrice(fee)}/mes*</small>
        </div>
        <div class="car-actions">
          <button type="button" class="btn btn-primary btn-sm" data-open="${car.id}">Ver detalles</button>
          <button type="button" class="link-arrow" data-book="${car.id}">Agendar</button>
        </div>
      </div>
    </div>
  </article>`;
}

function renderPagination(totalPages) {
  const nav = $('#pagination');
  if (totalPages <= 1) { nav.innerHTML = ''; return; }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  nav.innerHTML = `
    <button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Anterior">‹</button>
    ${pages.map(p => `<button type="button" data-page="${p}" ${p === state.page ? 'class="active" aria-current="page"' : ''}>${p}</button>`).join('')}
    <button type="button" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''} aria-label="Siguiente">›</button>`;
}

function render() {
  const cars = filteredCars();
  const totalPages = Math.max(1, Math.ceil(cars.length / PAGE_SIZE));
  state.page = Math.min(state.page, totalPages);
  const pageCars = cars.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  $('#car-count').textContent = cars.length;
  $('#cars-grid').innerHTML = pageCars.map(renderCard).join('');
  $('#cars-grid').classList.toggle('is-list', state.view === 'list');
  $('#empty-state').hidden = cars.length > 0;
  renderPagination(totalPages);
  syncFilterUI();
}

function update(changes = {}) {
  Object.assign(state, { page: 1 }, changes);
  render();
}

function resetFilters() {
  FACETS.forEach(f => state[f].clear());
  update({ q: '', type: '', priceMax: PRICE_MAX, yearMin: YEARS[0], yearMax: YEARS[YEARS.length - 1] });
}

function scrollToInventory() {
  $('#inventario').scrollIntoView({ behavior: 'smooth' });
}

/* ───────────── Hero ───────────── */

function renderHero() {
  // Destaca el vehículo nuevo más caro
  const featured = [...INVENTORY].filter(c => c.condition === 'nuevo').sort((a, b) => b.price - a.price)[0] || INVENTORY[0];
  $('#hero-feature').innerHTML = `
    <div class="hero-light"></div>
    <div class="hero-car">${carSVG(featured)}</div>
    <div class="hero-caption container">
      <span>${escapeHTML(featured.brand)} ${escapeHTML(featured.model)}</span>
      <span>Desde ${formatPrice(featured.price)}</span>
    </div>`;
}

/* ───────────── Modal ───────────── */

function openModal(carId) {
  const car = INVENTORY.find(c => c.id === carId);
  if (!car) return;
  const dialog = $('#car-modal');
  const message = `Hola, me interesa el ${carTitle(car)} por ${formatPrice(car.price)}`;
  const specs = [
    ['Año', car.year],
    ['Kilometraje', car.km === 0 ? '0 km' : car.km.toLocaleString('es-EC') + ' km'],
    ['Categoría', car.type],
    ['Combustible', car.fuel],
    ['Transmisión', car.trans],
    ['Color', car.color],
    ['Condición', CONDITION_LABELS[car.condition] || car.condition]
  ];

  $('#modal-content').innerHTML = `
    <button type="button" class="dialog-close" data-close aria-label="Cerrar">✕</button>
    <div class="dialog-media">${carSVG(car)}</div>
    <div class="dialog-info">
      <p class="car-brand">${escapeHTML(car.brand)}</p>
      <h2 id="modal-title">${escapeHTML(car.model)}</h2>
      <dl class="spec-list">
        ${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHTML(v)}</dd></div>`).join('')}
      </dl>
      <div class="dialog-price">
        <div><span>Precio</span><strong>${formatPrice(car.price)}</strong></div>
        <div><span>Cuota referencial*</span><strong>${formatPrice(monthlyPayment(car.price))}<small>/mes</small></strong></div>
      </div>
      <p class="fine-print">*Entrada ${DEFAULT_DOWN}%, ${DEFAULT_TERM} meses, tasa ${DEFAULT_RATE}% anual. Valor referencial sujeto a aprobación.</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-book="${car.id}">Agendar prueba de manejo</button>
        <a class="btn btn-ghost" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}" target="_blank" rel="noopener">WhatsApp</a>
        <button type="button" class="link-arrow" data-finance="${car.id}">Calcular financiamiento</button>
      </div>
    </div>`;

  dialog.showModal();
  document.body.classList.add('no-scroll');
}

function closeModal() {
  const dialog = $('#car-modal');
  if (dialog.open) dialog.close();
}

function bookCar(carId) {
  const car = INVENTORY.find(c => c.id === carId);
  if (car) $('#f-vehiculo').value = carTitle(car);
  const testDrive = $('#f-tipo input[value="Prueba de manejo"]');
  if (testDrive) testDrive.checked = true;
  closeModal();
  $('#contacto').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => $('#f-nombre').focus({ preventScroll: true }), 600);
}

/* ───────────── Calculadora ───────────── */

const calc = { term: DEFAULT_TERM };

function updateCalc() {
  const price = Number($('#calc-price').value);
  const down = Number($('#calc-down').value);
  const rate = Math.max(0, Number($('#calc-rate').value) || 0);
  const payment = monthlyPayment(price, down, calc.term, rate);

  $('#calc-price-out').textContent = formatPrice(price);
  $('#calc-down-out').textContent = `${down}% · ${formatPrice(price * down / 100)}`;
  $('#calc-payment').textContent = formatPrice(payment);
  $('#calc-summary').textContent = `Monto a financiar ${formatPrice(price * (1 - down / 100))} · ${calc.term} meses`;
  $$('#calc-term button').forEach(b => b.classList.toggle('active', Number(b.dataset.term) === calc.term));

  // Relleno visual de los sliders
  $$('#calc input[type=range]').forEach(paintRange);
}

function paintRange(input) {
  const pct = (input.value - input.min) / (input.max - input.min) * 100;
  input.style.setProperty('--fill', pct + '%');
}

function financeCar(carId) {
  const car = INVENTORY.find(c => c.id === carId);
  if (!car) return;
  const input = $('#calc-price');
  input.max = Math.max(Number(input.max), Math.ceil(car.price / 1000) * 1000);
  input.value = car.price;
  updateCalc();
  closeModal();
  $('#financiamiento').scrollIntoView({ behavior: 'smooth' });
}

/* ───────────── Formulario de citas ───────────── */

function validateField(input) {
  const field = input.closest('.field');
  const valid = input.checkValidity() && (!input.required || input.value.trim() !== '');
  field.classList.toggle('has-error', !valid);
  return valid;
}

function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const inputs = $$('#f-nombre, #f-telefono, #f-email, #f-fecha', form);
  const allValid = inputs.map(validateField).every(Boolean);
  if (!allValid) {
    form.querySelector('.has-error input').focus();
    return;
  }

  const lead = {
    nombre: $('#f-nombre').value.trim(),
    telefono: $('#f-telefono').value.trim(),
    email: $('#f-email').value.trim(),
    vehiculo: $('#f-vehiculo').value,
    fecha: $('#f-fecha').value,
    hora: $('#f-hora').value,
    tipo: form.querySelector('input[name=tipo]:checked').value,
    mensaje: $('#f-mensaje').value.trim()
  };
  // TODO: enviar `lead` al backend / CRM (ver config/api-example.js)
  console.log('Nueva cita:', lead);

  const fecha = new Date(lead.fecha + 'T00:00').toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#booking-success-text').textContent =
    `Gracias, ${lead.nombre.split(' ')[0]}. Recibimos tu solicitud para el ${fecha} a las ${lead.hora}. Te contactaremos dentro de la próxima hora.`;
  $('#booking-success').hidden = false;
}

function resetBooking() {
  const form = $('#booking');
  form.reset();
  $$('.field', form).forEach(f => f.classList.remove('has-error'));
  $('#booking-success').hidden = true;
}

/* ───────────── Eventos ───────────── */

function bindEvents() {
  // Header: menú móvil y sombra al hacer scroll
  const header = $('.site-header');
  const menuBtn = $('#menu-toggle');
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#main-nav a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Búsqueda rápida del hero
  $('#quick-search').addEventListener('submit', e => {
    e.preventDefault();
    FACETS.forEach(f => state[f].clear());
    const brand = $('#qs-brand').value;
    if (brand) state.brand.add(brand);
    update({
      q: '',
      type: $('#qs-type').value,
      priceMax: Number($('#qs-price').value) || PRICE_MAX
    });
    scrollToInventory();
  });

  // Filtros
  $('#filters').addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.facet) {
      t.checked ? state[t.dataset.facet].add(t.value) : state[t.dataset.facet].delete(t.value);
      update();
    } else if (t.id === 'year-min' || t.id === 'year-max') {
      let min = Number($('#year-min').value);
      let max = Number($('#year-max').value);
      if (min > max) [min, max] = t.id === 'year-min' ? [min, min] : [max, max];
      update({ yearMin: min, yearMax: max });
    }
  });
  $('#price-range').addEventListener('input', e => {
    paintRange(e.target);
    update({ priceMax: Number(e.target.value) });
  });

  $('#search').addEventListener('input', e => update({ q: e.target.value }));
  $('#sort').addEventListener('change', e => update({ sort: e.target.value }));
  $('#filters-reset').addEventListener('click', resetFilters);
  $('#empty-reset').addEventListener('click', resetFilters);

  $('#type-chips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) update({ type: chip.dataset.type });
  });

  $('#active-filters').addEventListener('click', e => {
    const tag = e.target.closest('.tag');
    if (!tag) return;
    $('#active-filters')._tags[tag.dataset.tag].clear();
    update();
  });

  $$('.view-toggle button').forEach(btn => btn.addEventListener('click', () => {
    $$('.view-toggle button').forEach(b => b.classList.toggle('active', b === btn));
    state.view = btn.dataset.view;
    render();
  }));

  $('#pagination').addEventListener('click', e => {
    const btn = e.target.closest('button[data-page]');
    if (!btn || btn.disabled) return;
    state.page = Number(btn.dataset.page);
    render();
    scrollToInventory();
  });

  // Drawer de filtros en móvil
  const toggleFilters = open => document.body.classList.toggle('filters-open', open);
  $('#filters-open').addEventListener('click', () => toggleFilters(true));
  $('#filters-close').addEventListener('click', () => toggleFilters(false));
  $('#filters-apply').addEventListener('click', () => { toggleFilters(false); scrollToInventory(); });

  // Acciones delegadas: tarjetas y modal
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    const book = e.target.closest('[data-book]');
    const finance = e.target.closest('[data-finance]');
    const interest = e.target.closest('[data-interest]');
    if (open) openModal(Number(open.dataset.open));
    else if (book) bookCar(Number(book.dataset.book));
    else if (finance) financeCar(Number(finance.dataset.finance));
    else if (interest) {
      const radio = $(`#f-tipo input[value="${interest.dataset.interest}"]`);
      if (radio) radio.checked = true;
    }
  });

  const dialog = $('#car-modal');
  dialog.addEventListener('click', e => {
    if (e.target === dialog || e.target.closest('[data-close]')) closeModal();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('no-scroll'));

  // Calculadora
  $('#calc').addEventListener('input', updateCalc);
  $('#calc-term').addEventListener('click', e => {
    const btn = e.target.closest('button[data-term]');
    if (!btn) return;
    calc.term = Number(btn.dataset.term);
    updateCalc();
  });

  // Formulario
  const form = $('#booking');
  form.addEventListener('submit', submitBooking);
  form.addEventListener('blur', e => {
    if (e.target.matches('input')) validateField(e.target);
  }, true);
  form.addEventListener('input', e => {
    const field = e.target.closest('.field.has-error');
    if (field) validateField(e.target);
  });
  $('#booking-again').addEventListener('click', resetBooking);

  // Animación al hacer scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => observer.observe(el));
}

/* ───────────── Inicialización ───────────── */

function initSite() {
  buildFilters();
  renderHero();
  render();
  paintRange($('#price-range'));
  updateCalc();
  bindEvents();

  // Fecha mínima: mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pad = n => String(n).padStart(2, '0');
  $('#f-fecha').min = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  // Resaltar el horario de hoy
  const today = new Date().getDay();
  $$('#hours tr').forEach(row => row.classList.toggle('is-today', row.dataset.days.split(',').map(Number).includes(today)));

  $('#year').textContent = new Date().getFullYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
