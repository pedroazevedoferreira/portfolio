// ===== HELPERS =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.matchMedia('(hover: hover)').matches && window.innerWidth > 900;

// ===== NAV / SCROLL / PROGRESS / BACK-TO-TOP =====
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progress-bar');
const backToTop = document.getElementById('back-to-top');
const navIndicator = document.getElementById('nav-indicator');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollY / docHeight) * 100;

  nav.classList.toggle('scrolled', scrollY > 40);
  progressBar.style.width = progress + '%';
  backToTop.classList.toggle('visible', scrollY > 600);

  updateActiveNav(scrollY);
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== ACTIVE NAV INDICATOR =====
function updateActiveNav(scrollY) {
  const sections = document.querySelectorAll('section[id]');
  let activeLink = null;
  sections.forEach(s => {
    const top = s.offsetTop, height = s.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if (link) {
      const isActive = (scrollY + 100) >= top && (scrollY + 100) < top + height;
      link.classList.toggle('active', isActive);
      if (isActive) activeLink = link;
    }
  });
  if (activeLink && navIndicator && window.innerWidth > 640) {
    const rect = activeLink.getBoundingClientRect();
    const parentRect = activeLink.parentElement.parentElement.getBoundingClientRect();
    navIndicator.style.left = (rect.left - parentRect.left) + 'px';
    navIndicator.style.width = rect.width + 'px';
    navIndicator.classList.add('visible');
  } else if (navIndicator) {
    navIndicator.classList.remove('visible');
  }
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'light') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// ===== I18N (PT/EN) =====
const translations = {
  pt: {
    'nav.about': 'Sobre', 'nav.skills': 'Skills', 'nav.path': 'Trajetória',
    'nav.certs': 'Certificados', 'nav.projects': 'Projetos', 'nav.contact': 'Contato'
  },
  en: {
    'nav.about': 'About', 'nav.skills': 'Skills', 'nav.path': 'Journey',
    'nav.certs': 'Certificates', 'nav.projects': 'Projects', 'nav.contact': 'Contact'
  }
};

const langToggle = document.getElementById('lang-toggle');
const savedLang = localStorage.getItem('lang') || 'pt';
applyLang(savedLang);

langToggle.addEventListener('click', () => {
  const current = document.documentElement.lang === 'en' ? 'en' : 'pt';
  const next = current === 'pt' ? 'en' : 'pt';
  applyLang(next);
  localStorage.setItem('lang', next);
});

function applyLang(lang) {
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang]?.[key]) el.textContent = translations[lang][key];
  });
  langToggle.querySelector('.lang-current').textContent = lang === 'en' ? 'EN' : 'PT';
}

// ===== TYPING NO NOME (uma vez) =====
const heroNameEl = document.querySelector('.hero-name');
if (heroNameEl && !reduceMotion) {
  const fullName = heroNameEl.textContent;
  heroNameEl.textContent = '';
  heroNameEl.classList.add('typing');
  let i = 0;
  const typeName = () => {
    if (i < fullName.length) {
      heroNameEl.textContent += fullName[i++];
      setTimeout(typeName, 90);
    } else {
      heroNameEl.classList.remove('typing');
    }
  };
  setTimeout(typeName, 400);
}

// ===== TYPED EFFECT (role) =====
const roles = ['Frontend', 'Backend', 'Full Stack'];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible', 'in-view');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.sobre-text, .sobre-card, .skill-category, .project-card, .contato-item, .contato-form, .stat, .timeline-item, .cert-card, .soft-card, .testimonial-card, .now-card'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

// ===== CONTADOR ANIMADO =====
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(ease * target) + (t === 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => statObserver.observe(el));

// ===== CONTATO FORM + CONFETE =====
const contatoForm = document.getElementById('contato-form');
contatoForm.addEventListener('submit', function(e) {
  // Se Formspree estiver configurado, deixa o submit nativo
  const action = this.getAttribute('action') || '';
  const isFormspree = action.includes('formspree.io') && !action.includes('YOUR_FORMSPREE_ID');
  if (!isFormspree) {
    e.preventDefault();
    showFormSuccess();
  } else {
    // Intercepta pra fazer fetch async e mostrar confete
    e.preventDefault();
    const data = new FormData(this);
    fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(r => r.ok ? showFormSuccess() : showFormError())
      .catch(() => showFormError());
  }
});

function showFormSuccess() {
  const feedback = document.getElementById('form-feedback');
  feedback.style.color = 'var(--accent2)';
  feedback.textContent = '✨ Mensagem enviada! Entrarei em contato em breve.';
  contatoForm.reset();
  fireConfetti();
  setTimeout(() => feedback.textContent = '', 5000);
}

function showFormError() {
  const feedback = document.getElementById('form-feedback');
  feedback.style.color = '#ff6b6b';
  feedback.textContent = 'Erro ao enviar. Tenta de novo ou me chama no e-mail direto.';
  setTimeout(() => feedback.textContent = '', 5000);
}

// ===== CONFETE =====
const confettiCanvas = document.getElementById('confetti-canvas');
const cctx = confettiCanvas.getContext('2d');

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function fireConfetti() {
  if (reduceMotion) return;
  const colors = ['#00bfff', '#48cae4', '#0077b6', '#ffffff', '#a3e635'];
  const pieces = [];
  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1) * 18,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1
    });
  }

  function draw() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = 0;
    pieces.forEach(p => {
      p.vy += 0.5;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.012;
      if (p.life > 0 && p.y < window.innerHeight + 50) {
        alive++;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        cctx.globalAlpha = Math.max(0, p.life);
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        cctx.restore();
      }
    });
    if (alive > 0) requestAnimationFrame(draw);
    else cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  draw();
}

// ===== CURSOR CUSTOMIZADO + MAGNETIC =====
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (isDesktop) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .tag, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ===== TILT 3D NOS PROJECT CARDS =====
if (isDesktop && !reduceMotion) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotY = (x - 0.5) * 12;
      const rotX = (0.5 - y) * 12;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== MODAL DE PROJETO =====
const modalOverlay = document.getElementById('modal-overlay');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalProblem = document.getElementById('modal-problem');
const modalSolution = document.getElementById('modal-solution');
const modalLearnings = document.getElementById('modal-learnings');
const modalClose = document.getElementById('modal-close');

function openModal(card) {
  modalIcon.textContent = card.dataset.icon;
  modalTitle.textContent = card.dataset.title;
  modalProblem.textContent = card.dataset.problem;
  modalSolution.textContent = card.dataset.solution;
  modalLearnings.textContent = card.dataset.learnings;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.project-link')) return;
    openModal(card);
  });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

// ===== PARTÍCULAS NO HERO (CSS puro animado via JS gerador) =====
const particlesEl = document.getElementById('particles');
if (particlesEl && !reduceMotion) {
  const count = window.innerWidth < 640 ? 20 : 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const xStart = Math.random() * 100;
    const xEnd = xStart + (Math.random() - 0.5) * 30;
    p.style.setProperty('--x-start', xStart + 'vw');
    p.style.setProperty('--x-end', xEnd + 'vw');
    p.style.setProperty('--dur', (10 + Math.random() * 14) + 's');
    p.style.setProperty('--delay', (-Math.random() * 14) + 's');
    p.style.left = '0';
    p.style.top = '0';
    particlesEl.appendChild(p);
  }
}

// ===== CMD+K BUSCA RÁPIDA =====
const cmdkOverlay = document.getElementById('cmdk-overlay');
const cmdkInput = document.getElementById('cmdk-input');
const cmdkResults = document.getElementById('cmdk-results');
const cmdkHint = document.getElementById('cmdk-hint');

const searchData = [
  { group: 'Seções', title: 'Sobre', desc: 'Conheça um pouco mais sobre mim', target: '#sobre', icon: '👋' },
  { group: 'Seções', title: 'Skills', desc: 'Tecnologias que uso', target: '#skills', icon: '⚡' },
  { group: 'Seções', title: 'Trajetória', desc: 'Estágio, faculdade, cursos', target: '#experiencia', icon: '📍' },
  { group: 'Seções', title: 'Certificados', desc: 'Cursos e formações', target: '#certificados', icon: '🎓' },
  { group: 'Seções', title: 'Atualmente', desc: 'O que estou fazendo agora', target: '#agora', icon: '⚡' },
  { group: 'Seções', title: 'Projetos', desc: 'TaskFlow, API, DocTalk', target: '#projetos', icon: '💼' },
  { group: 'Seções', title: 'Depoimentos', desc: 'O que dizem sobre mim', target: '#depoimentos', icon: '💬' },
  { group: 'Seções', title: 'Contato', desc: 'Como falar comigo', target: '#contato', icon: '📨' },
  { group: 'Projetos', title: 'TaskFlow', desc: 'CRUD com autenticação JWT', target: '#projetos', icon: '✅' },
  { group: 'Projetos', title: 'Projeto API', desc: 'SPA consumindo API REST', target: '#projetos', icon: '🌐' },
  { group: 'Projetos', title: 'DocTalk', desc: 'Chat com documentos via IA', target: '#projetos', icon: '📄' },
  { group: 'Links', title: 'GitHub', desc: 'github.com/pedroazevedoferreira', target: 'https://github.com/pedroazevedoferreira', icon: '🐙', external: true },
  { group: 'Links', title: 'LinkedIn', desc: 'linkedin.com/in/pedro-azevedo', target: 'https://www.linkedin.com/in/pedro-azevedo-986143302/', icon: '💼', external: true },
  { group: 'Links', title: 'E-mail', desc: 'pedroazevedoferreira2006@gmail.com', target: 'mailto:pedroazevedoferreira2006@gmail.com', icon: '✉️', external: true },
  { group: 'Ações', title: 'Alternar tema', desc: 'Dark / Light mode', action: 'theme', icon: '🌓' },
  { group: 'Ações', title: 'Alternar idioma', desc: 'Português / English', action: 'lang', icon: '🌐' },
  { group: 'Ações', title: 'Voltar ao topo', desc: 'Scroll suave pro início', action: 'top', icon: '⬆️' }
];

let cmdkActive = 0;
let cmdkFiltered = [];

function openCmdK() {
  cmdkOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  cmdkInput.value = '';
  cmdkInput.focus();
  renderCmdK('');
}

function closeCmdK() {
  cmdkOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCmdK(query) {
  const q = query.toLowerCase().trim();
  cmdkFiltered = q
    ? searchData.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q))
    : searchData;
  cmdkActive = 0;

  if (cmdkFiltered.length === 0) {
    cmdkResults.innerHTML = '<div class="cmdk-empty">Nenhum resultado pra "' + escapeHtml(query) + '"</div>';
    return;
  }

  let html = '';
  let lastGroup = '';
  cmdkFiltered.forEach((item, idx) => {
    if (item.group !== lastGroup) {
      html += `<div class="cmdk-section-label">${item.group}</div>`;
      lastGroup = item.group;
    }
    html += `<div class="cmdk-result${idx === 0 ? ' active' : ''}" data-idx="${idx}">
      <span class="cmdk-result-icon">${item.icon}</span>
      <div class="cmdk-result-meta">
        <div class="cmdk-result-title">${escapeHtml(item.title)}</div>
        <div class="cmdk-result-desc">${escapeHtml(item.desc)}</div>
      </div>
    </div>`;
  });
  cmdkResults.innerHTML = html;

  cmdkResults.querySelectorAll('.cmdk-result').forEach(el => {
    el.addEventListener('click', () => {
      cmdkActive = parseInt(el.dataset.idx, 10);
      executeCmdK();
    });
    el.addEventListener('mouseenter', () => {
      cmdkResults.querySelectorAll('.cmdk-result').forEach(r => r.classList.remove('active'));
      el.classList.add('active');
      cmdkActive = parseInt(el.dataset.idx, 10);
    });
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function executeCmdK() {
  const item = cmdkFiltered[cmdkActive];
  if (!item) return;
  closeCmdK();

  if (item.action === 'theme') return themeToggle.click();
  if (item.action === 'lang') return langToggle.click();
  if (item.action === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' });

  if (item.external) {
    if (item.target.startsWith('mailto:')) window.location.href = item.target;
    else window.open(item.target, '_blank', 'noopener');
    return;
  }
  if (item.target.startsWith('#')) {
    const el = document.querySelector(item.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

cmdkInput?.addEventListener('input', e => renderCmdK(e.target.value));
cmdkOverlay?.addEventListener('click', e => { if (e.target === cmdkOverlay) closeCmdK(); });
cmdkHint?.addEventListener('click', openCmdK);

document.addEventListener('keydown', (e) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';

  if (cmdK) {
    e.preventDefault();
    cmdkOverlay.classList.contains('open') ? closeCmdK() : openCmdK();
    return;
  }
  if (!cmdkOverlay.classList.contains('open')) return;

  if (e.key === 'Escape') closeCmdK();
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    cmdkActive = Math.min(cmdkFiltered.length - 1, cmdkActive + 1);
    updateCmdKActive();
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    cmdkActive = Math.max(0, cmdkActive - 1);
    updateCmdKActive();
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    executeCmdK();
  }
});

function updateCmdKActive() {
  cmdkResults.querySelectorAll('.cmdk-result').forEach(el => {
    const idx = parseInt(el.dataset.idx, 10);
    el.classList.toggle('active', idx === cmdkActive);
    if (idx === cmdkActive) el.scrollIntoView({ block: 'nearest' });
  });
}

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* silencioso */ });
  });
}

// ===== TIMELINE: linha animada conforme scroll =====
const timeline = document.getElementById('timeline');
if (timeline) {
  timeline.classList.add('animated');
  window.addEventListener('scroll', () => {
    const rect = timeline.getBoundingClientRect();
    const total = rect.height;
    const visible = Math.max(0, Math.min(total, window.innerHeight - rect.top));
    const pct = Math.min(100, (visible / total) * 130);
    timeline.style.setProperty('--draw', pct + '%');
  });
}
