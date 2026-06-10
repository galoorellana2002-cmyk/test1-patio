/**
 * MAIN.JS - Lógica principal del sitio
 * Gestor de inventario, filtros, modal y formularios
 */

// SVG constante para placeholder de autos
const CAR_SVG = `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:70%;opacity:0.1;">
  <path d="M10 38 L20 20 L90 18 L108 36 L115 38 L108 48 L10 48 Z" stroke="white" stroke-width="1.5" fill="none"/>
  <circle cx="30" cy="48" r="7" stroke="white" stroke-width="1.5" fill="none"/>
  <circle cx="88" cy="48" r="7" stroke="white" stroke-width="1.5" fill="none"/>
  <path d="M38 22 L42 20 L70 20 L78 22 L78 34 L38 34 Z" stroke="white" stroke-width="1" fill="none" opacity="0.5"/>
</svg>`;

/**
 * Formatea un número como precio USD
 */
function formatPrice(n) {
  return '$' + n.toLocaleString();
}

/**
 * Genera el HTML del badge según condición
 */
function badgeHTML(condition) {
  const badgeMap = {
    nuevo: { class: 'badge-nuevo', label: 'Nuevo' },
    seminuevo: { class: 'badge-usado', label: 'Seminuevo' }
  };
  const badge = badgeMap[condition] || { class: 'badge-usado', label: condition };
  return `<span class="car-badge ${badge.class}">${badge.label}</span>`;
}

/**
 * Renderiza las tarjetas de autos en la grilla
 */
function renderCards(cars) {
  const grid = document.getElementById('cars-grid');
  const countEl = document.getElementById('car-count');
  
  if (!grid) return;
  
  countEl.textContent = cars.length;
  
  grid.innerHTML = cars.map(car => `
    <div class="car-card reveal" onclick="openModal(${car.id})">
      <div class="car-img-placeholder">
        ${CAR_SVG}
        ${badgeHTML(car.condition)}
      </div>
      <div class="car-info">
        <div class="car-brand">${car.brand}</div>
        <div class="car-name">${car.model}</div>
        <div class="car-specs">
          <span class="car-spec">${car.year}</span>
          <span class="car-spec"><span class="car-spec-dot"></span>${car.type}</span>
          <span class="car-spec"><span class="car-spec-dot"></span>${car.fuel}</span>
          ${car.km > 0 ? `<span class="car-spec"><span class="car-spec-dot"></span>${car.km.toLocaleString()} km</span>` : ''}
        </div>
        <div class="car-footer">
          <div class="car-price">
            ${formatPrice(car.price)}
            <small>USD · Precio de lista</small>
          </div>
          <button class="car-cta">Ver Detalle</button>
        </div>
      </div>
    </div>
  `).join('');
  
  observeReveal();
}

/**
 * Aplica filtros al inventario
 */
function applyFilters() {
  renderCards(INVENTORY);
}

/**
 * Resetea todos los filtros
 */
function resetFilters() {
  const checkboxes = document.querySelectorAll('.filters-panel input[type=checkbox]');
  checkboxes.forEach(cb => cb.checked = false);
  renderCards(INVENTORY);
}

/**
 * Ordena los autos según criterio
 */
function sortCars(value) {
  let sorted = [...INVENTORY];
  
  switch(value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'year-desc':
      sorted.sort((a, b) => b.year - a.year);
      break;
    case 'year-asc':
      sorted.sort((a, b) => a.year - b.year);
      break;
    default:
      // 'featured' - mantiene orden original
  }
  
  renderCards(sorted);
}

/**
 * Cambia la vista (grid/list)
 */
function setView(mode, buttonElement) {
  // Remove active de todos los botones
  document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
  // Agregar active al botón actual
  buttonElement.classList.add('active');
  
  const grid = document.getElementById('cars-grid');
  if (mode === 'list') {
    grid.style.gridTemplateColumns = '1fr';
  } else {
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
  }
}

/**
 * Abre el modal con detalles del vehículo
 */
function openModal(carId) {
  const car = INVENTORY.find(c => c.id === carId);
  if (!car) return;
  
  document.getElementById('modal-brand').textContent = car.brand;
  document.getElementById('modal-name').textContent = car.model;
  
  document.getElementById('modal-details').innerHTML = `
    <div class="detail-row"><span class="detail-label">Año</span><span class="detail-value">${car.year}</span></div>
    <div class="detail-row"><span class="detail-label">Categoría</span><span class="detail-value">${car.type}</span></div>
    <div class="detail-row"><span class="detail-label">Combustible</span><span class="detail-value">${car.fuel}</span></div>
    <div class="detail-row"><span class="detail-label">Transmisión</span><span class="detail-value">${car.trans}</span></div>
    <div class="detail-row"><span class="detail-label">Color</span><span class="detail-value">${car.color}</span></div>
    <div class="detail-row"><span class="detail-label">Kilometraje</span><span class="detail-value">${car.km === 0 ? '0 km (Nuevo)' : car.km.toLocaleString() + ' km'}</span></div>
    <div class="detail-row"><span class="detail-label">Condición</span><span class="detail-value" style="text-transform: capitalize;">${car.condition}</span></div>
    <div class="detail-row" style="border: none; padding-top: 1rem;">
      <span class="detail-label">Precio</span>
      <span style="font-family:'Cormorant Garamond',serif; font-size: 1.6rem; color: var(--gold);">${formatPrice(car.price)}</span>
    </div>
  `;
  
  const message = `Hola, me interesa el ${car.brand} ${car.model} ${car.year} por ${formatPrice(car.price)}`;
  document.getElementById('modal-whatsapp').href = `https://wa.me/593999000111?text=${encodeURIComponent(message)}`;
  
  document.getElementById('car-modal').classList.add('open');
  document.getElementById('f-vehiculo').value = `${car.brand} ${car.model} ${car.year}`;
}

/**
 * Cierra el modal
 */
function closeModal(event) {
  if (event.target.id === 'car-modal') {
    document.getElementById('car-modal').classList.remove('open');
  }
}

/**
 * Scroll suave a la sección de contacto
 */
function scrollToContact() {
  const contactSection = document.getElementById('contacto');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
  const modal = document.getElementById('car-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

/**
 * Envía el formulario de cita
 */
function submitForm() {
  const nombre = document.getElementById('f-nombre').value.trim();
  const telefono = document.getElementById('f-telefono').value.trim();
  const fecha = document.getElementById('f-fecha').value;
  
  // Validación básica
  if (!nombre || !telefono || !fecha) {
    alert('Por favor completa los campos requeridos: nombre, teléfono y fecha.');
    return;
  }
  
  // Mostrar mensaje de éxito
  const successMsg = document.getElementById('form-success');
  successMsg.style.display = 'block';
  
  const submitBtn = document.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = '✓ Cita Enviada';
  submitBtn.style.background = '#3D7A5E';
  
  // Scroll al mensaje de éxito
  setTimeout(() => {
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

/**
 * Observador de intersección para animación de scroll reveal
 */
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  
  document.querySelectorAll('.reveal:not(.visible)').forEach(element => {
    observer.observe(element);
  });
}

/**
 * Inicialización del sitio
 */
function initSite() {
  // Renderizar inventario inicial
  renderCards(INVENTORY);
  observeReveal();
  
  // Establecer fecha mínima en input de fecha
  const dateInput = document.getElementById('f-fecha');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }
  
  console.log('✓ Sitio inicializado');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
