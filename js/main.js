/* Bluey Healthcare Ltd — Main JS v2 */

// ── Scroll progress bar ──────────────────────────────────────
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / max * 100) + '%';
  }, { passive: true });
}

// ── Header: scrolled class + shadow ─────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile navigation toggle ─────────────────────────────────
const burger   = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Active nav link ──────────────────────────────────────────
(function markActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// ── IntersectionObserver — fade-in + section underlines ──────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

const underlineObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      underlineObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title-underline').forEach(el => underlineObserver.observe(el));

// ── Counter animation ────────────────────────────────────────
function animateCount(el) {
  const target  = parseFloat(el.dataset.target);
  const suffix  = el.dataset.suffix || '';
  const prefix  = el.dataset.prefix || '';
  const duration = 1800;
  const steps   = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    current = Math.min(increment * step, target);
    const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
    el.textContent = prefix + display + suffix;
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 'true';
      animateCount(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Typewriter effect ────────────────────────────────────────
const typewriterEl = document.querySelector('.typewriter-text');
if (typewriterEl) {
  const phrases = [
    'Every Shift.',
    'Every Time.',
    'Guaranteed.',
    '24/7 Cover.',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    if (paused) return;
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      typewriterEl.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        paused = true;
        setTimeout(() => { paused = false; }, 1800);
      }
    } else {
      charIdx--;
      typewriterEl.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  setTimeout(tick, 800);
}

// ── Button ripple effect ─────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const rect   = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = (e.clientX - rect.left - 4) + 'px';
  ripple.style.top  = (e.clientY - rect.top  - 4) + 'px';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ── Contact form handler ─────────────────────────────────────
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn     = form.querySelector('button[type="submit"]');
    const success = form.querySelector('.form-success');
    const original = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = original;
      if (success) {
        success.style.display = 'block';
        setTimeout(() => (success.style.display = 'none'), 5000);
      }
    }, 1200);
  });
});

// ── Stagger animation delays for grid children ───────────────
document.querySelectorAll('.services-grid, .why-grid, .values-grid, .team-grid, .testimonials-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add('fade-in', `stagger-${Math.min(i + 1, 5)}`);
    fadeObserver.observe(child);
  });
});
