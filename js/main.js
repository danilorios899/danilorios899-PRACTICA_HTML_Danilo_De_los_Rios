/* ============================================================
   PÁGINA PERSONAL - DANILO DE LOS RÍOS
   Archivo: js/main.js
   Descripción: Lógica e interactividad del portafolio personal
   Tecnologías: JavaScript ES6+ vanilla
   ============================================================ */

/* ──────────────────────────────────────────────
   1. EFECTO TYPED - Texto rotativo en el hero
   ────────────────────────────────────────────── */
const phrases = [
  'Desarrollador de Software',
  'Estudiante TDS · 2026-1',
  'Construyendo el futuro digital',
  'HTML · CSS · JS · Bootstrap'
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;

const typedEl = document.getElementById('typed');

/**
 * Función principal del efecto de escritura animada.
 * Escribe y borra frases en un ciclo continuo.
 */
function type() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    // Escribiendo
    typedEl.textContent = currentPhrase.slice(0, ++charIndex);
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      return setTimeout(type, 1800); // Pausa antes de borrar
    }
  } else {
    // Borrando
    typedEl.textContent = currentPhrase.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(type, isDeleting ? 40 : 80);
}

// Iniciar efecto
type();


/* ──────────────────────────────────────────────
   2. NAVBAR ACTIVA según sección visible
   ────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });

  // Mostrar / ocultar botón scroll top
  const scrollTopBtn = document.getElementById('scrollTop');
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
});


/* ──────────────────────────────────────────────
   3. BOTÓN SCROLL TO TOP
   ────────────────────────────────────────────── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────────────────
   4. INTERSECTION OBSERVER - Animaciones al hacer scroll
   Activa la clase .visible en timeline items y skill cards
   ────────────────────────────────────────────── */
const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.tl-item, .skill-category').forEach(el => {
  appearObserver.observe(el);
});


/* ──────────────────────────────────────────────
   5. CONTADORES ANIMADOS en la sección CV
   ────────────────────────────────────────────── */
const counters = [
  { id: 'stat1', target: 8,   suffix: '+' },
  { id: 'stat2', target: 12,  suffix: '+' },
  { id: 'stat3', target: 4,   suffix: '+' },
  { id: 'stat4', target: 100, suffix: '%' },
];

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const counterDef = counters.find(c => c.id === entry.target.id);
    if (!counterDef) return;

    let currentVal = 0;
    const step = Math.ceil(counterDef.target / 40);

    const timer = setInterval(() => {
      currentVal = Math.min(currentVal + step, counterDef.target);
      entry.target.textContent = currentVal + counterDef.suffix;
      if (currentVal >= counterDef.target) clearInterval(timer);
    }, 35);

    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

counters.forEach(counter => {
  const el = document.getElementById(counter.id);
  if (el) counterObserver.observe(el);
});


/* ──────────────────────────────────────────────
   6. BARRAS DE PROGRESO de habilidades
   ────────────────────────────────────────────── */
const skillsData = [
  { name: 'HTML / CSS',  level: 85 },
  { name: 'JavaScript',  level: 70 },
  { name: 'Bootstrap',   level: 80 },
  { name: 'Python',      level: 55 },
  { name: 'SQL',         level: 60 },
  { name: 'Git',         level: 65 },
];

const barsContainer = document.getElementById('bars-container');

/**
 * Genera dinámicamente las barras de progreso con JavaScript.
 * @param {Array} skills - Array de objetos {name, level}
 */
function renderSkillBars(skills) {
  skills.forEach(skill => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-bottom: 1.2rem;';

    wrapper.innerHTML = `
      <div style="display:flex; justify-content:space-between;
                  font-family:'Space Mono',monospace; font-size:.75rem; margin-bottom:.4rem;">
        <span style="color:#e4e8f0">${skill.name}</span>
        <span style="color:#4fffb0">${skill.level}%</span>
      </div>
      <div style="background:#252a3a; border-radius:2px; height:4px; overflow:hidden;">
        <div class="skill-bar-fill"
             data-level="${skill.level}"
             style="height:100%; width:0;
                    background: linear-gradient(90deg, #7c6bff, #4fffb0);
                    border-radius:2px;
                    transition: width 1.2s ease;">
        </div>
      </div>`;

    barsContainer.appendChild(wrapper);
  });
}

renderSkillBars(skillsData);

// Activar barras cuando sean visibles
const barsObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) return;

  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.level + '%';
  });

  barsObserver.disconnect();
}, { threshold: 0.3 });

barsObserver.observe(barsContainer);


/* ──────────────────────────────────────────────
   7. FORMULARIO DE CONTACTO con validación
   ────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

/**
 * Muestra el toast de confirmación por 3.5 segundos.
 */
function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validación nativa de HTML5 con Bootstrap
  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }

  // Formulario válido → mostrar confirmación y limpiar
  showToast();
  this.reset();
  this.classList.remove('was-validated');
});


/* ──────────────────────────────────────────────
   8. CERRAR NAVBAR en móvil al hacer clic en un enlace
   ────────────────────────────────────────────── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});
