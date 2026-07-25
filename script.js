/* =============================================
   script.js — Luminary Interactive JS
   All initialisations are deferred until the
   'componentsLoaded' event fires, which is
   dispatched by the component loader in
   index.html after all HTML partials have been
   fetched and injected into the DOM.
   ============================================= */

'use strict';

/**
 * Initialise all interactive features.
 * Called once every component partial is in the DOM.
 */
function initPage() {

  // ── Hamburger / Mobile Nav ──────────────────
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav    = document.getElementById('mobileNav');
  const navOverlay   = document.getElementById('navOverlay');

  function openNav() {
    mobileNav.classList.add('is-open');
    navOverlay.classList.add('is-visible');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      isOpen ? closeNav() : openNav();
    });
  }

  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  // Close on mobile nav link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });


  // ── Dark / Light Mode Toggle ────────────────
  const themeToggle = document.getElementById('themeToggle');
  const root        = document.documentElement;

  const savedTheme = localStorage.getItem('luminary-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('luminary-theme', next);
      themeToggle.setAttribute('aria-pressed', next === 'dark');
    });
  }


  // ── Feature Card Expand / Collapse ──────────
  document.querySelectorAll('.feature-card').forEach(card => {
    const toggleBtn = card.querySelector('.card-toggle');

    function toggleCard() {
      const isExpanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!isExpanded));
      const detail = card.querySelector('.card-detail');
      if (detail) detail.setAttribute('aria-hidden', String(isExpanded));
    }

    if (toggleBtn) toggleBtn.addEventListener('click', e => { e.stopPropagation(); toggleCard(); });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(); }
    });
  });


  // ── Scroll Animations (IntersectionObserver) ─
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const fadeEls      = document.querySelectorAll('.fade-in');
    const featureCards = document.querySelectorAll('.feature-card');
    const techBars     = document.querySelectorAll('.tech-bar');

    const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

    // Fade-in for hero elements
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOpts);

    fadeEls.forEach(el => fadeObserver.observe(el));

    // Staggered feature card reveals
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    featureCards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.07}s`;
      card.classList.add('fade-in');
      cardObserver.observe(card);
    });

    // Tech bar animations
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    techBars.forEach(bar => barObserver.observe(bar));

  } else {
    // Immediately show everything for reduced motion
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.tech-bar').forEach(bar => bar.classList.add('animate'));
  }


  // ── Counter Animation (Hero Stats) ──────────
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));


  // ── Active Nav Link on Scroll ────────────────
  const sections  = document.querySelectorAll('section[id], div[id="features"]');
  const navLinks  = document.querySelectorAll('.nav-link, .mobile-nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          const isActive = href === `#${id}` || (id === 'hero' && href === '#hero');
          link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  // ── Newsletter Form ──────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form');
  const formMessage    = document.getElementById('formMessage');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (!input.value || !input.checkValidity()) {
        formMessage.textContent = '⚠ Please enter a valid email address.';
        formMessage.style.color = '#e07070';
        input.focus();
        return;
      }
      formMessage.textContent = '✓ You\'re subscribed! Welcome aboard.';
      formMessage.style.color = 'var(--color-accent)';
      input.value = '';
      setTimeout(() => { formMessage.textContent = ''; }, 4000);
    });
  }


  // ── Header scroll shadow ─────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,.12)'
        : 'none';
    }, { passive: true });
  }

} // end initPage()


// ── Bootstrap ─────────────────────────────────
// Wait for all HTML partials to be injected before querying the DOM.
document.addEventListener('componentsLoaded', initPage);
