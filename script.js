// Robust images
document.querySelectorAll('img[data-fallbacks]').forEach((img) => {
  const list = img.dataset.fallbacks.split(',').map(s => s.trim());
  img.addEventListener('error', function next() {
    const nxt = list.shift();
    if (nxt) img.src = nxt;
    else { img.removeEventListener('error', next); img.style.display = 'none'; }
  });
});

// Scroll progress + counters
const prog = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
});
const cio = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const s = e.target;
    const target = +s.dataset.count;
    let cur = 0;
    const step = () => {
      cur += 1;
      if (cur >= target) { s.textContent = target; return; }
      s.textContent = cur;
      setTimeout(step, 110);
    };
    step();
    cio.unobserve(s);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(s => cio.observe(s));

// Reveal on scroll both ways
const io = new IntersectionObserver((es) => {
  es.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active nav
const links = [...document.querySelectorAll('.nav-links a')];
const secs = links.map(a => document.querySelector(a.hash)).filter(Boolean);
const nio = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
secs.forEach(s => nio.observe(s));

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Typing
const words = ['learning & growth.', 'faith & service.', 'balance & purpose.'];
const el = document.getElementById('typing');
let wi = 0, ci = 0, del = false;
(function type() {
  const w = words[wi];
  el.textContent = w.slice(0, ci);
  if (!del && ci < w.length) ci++;
  else if (!del) { del = true; setTimeout(type, 1100); return; }
  else if (ci > 0) ci--;
  else { del = false; wi = (wi + 1) % words.length; }
  setTimeout(type, del ? 30 : 60);
})();

// Word animation — sections + hero, replays scrolling up/down
document.querySelectorAll('header h1, header p.tagline, section h2, section p, section h3, section li').forEach((node) => {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  texts.forEach((t) => {
    const frag = document.createDocumentFragment();
    t.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      const s = document.createElement('span');
      s.className = 'word';
      s.textContent = part;
      frag.appendChild(s);
    });
    t.replaceWith(frag);
  });
});
const wordIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const words = e.target.querySelectorAll('.word');
    if (e.isIntersecting) {
      words.forEach((w, i) => {
        w.classList.remove('play');
        void w.offsetWidth;
        w.style.animationDelay = Math.min(i * 0.025, 0.8) + 's';
        w.classList.add('play');
      });
    } else {
      words.forEach((w) => w.classList.remove('play'));
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('header, section').forEach((s) => wordIO.observe(s));
