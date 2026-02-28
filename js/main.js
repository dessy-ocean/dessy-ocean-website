'use strict';

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile menu ── */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
let open = false;

burger.addEventListener('click', () => {
  open = !open;
  mobileNav.classList.toggle('open', open);
  burger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
  burger.querySelectorAll('span')[1].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  open = false;
  mobileNav.classList.remove('open');
  burger.querySelectorAll('span')[0].style.transform = '';
  burger.querySelectorAll('span')[1].style.transform = '';
}));

/* ── Scroll progress dot ── */
const dot = document.getElementById('scrollDot');
const updateDot = () => {
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const pct = 5 + scrolled * 90; // 5% to 95% of viewport height
  dot.style.top = pct + 'vh';
};
window.addEventListener('scroll', updateDot, { passive: true });
updateDot();

/* ── Smooth scroll with nav offset ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 60;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
  });
});

/* ── Counter animation ── */
function countUp(el, target, duration = 1800) {
  if (el._counted) return;
  el._counted = true;
  const start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ── Bar animation ── */
function animateBars(container) {
  container.querySelectorAll('.bar, .gender-bar').forEach(b => b.classList.add('animated'));
}

/* ── Intersection observers ── */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.js-count[data-target]').forEach(el => {
      countUp(el, parseInt(el.dataset.target, 10));
    });
    countObs.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.hero, .reach-grid').forEach(el => countObs.observe(el));

const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animateBars(e.target);
    barObs.unobserve(e.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.aud-card').forEach(el => barObs.observe(el));

/* ── Fade-up on scroll ── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // stagger children in grids
    const kids = e.target.querySelectorAll ? null : null;
    e.target.classList.add('in');
    fadeObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.stat-card, .collab-card, .press-card, .aud-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  fadeObs.observe(el);
});
