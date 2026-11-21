/**
 * YULDASHEV.DEV — CLIENT ENGINE
 * High-Converting Web & Landing Page Architect
 * Features: Particle Canvas, Command Palette (Ctrl+K), Reactive Scope Estimator, Modal Drawer, Live UTC Clock
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initBackgroundCanvas();
  initNavigation();
  initCommandPalette();
  initEstimator();
  initCaseFilters();
  initCaseModals();
  initFAQ();
  initContactForm();
});

/* ===================================================================
   1. LIVE LOCAL CLOCK & AVAILABILITY
   =================================================================== */
function initLiveClock() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;

  function update() {
    const now = new Date();
    // UTC+5 (Tashkent)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const local = new Date(utc + (3600000 * 5));
    const hours = String(local.getHours()).padStart(2, '0');
    const minutes = String(local.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes} UTC+5`;
  }
  update();
  setInterval(update, 10000);
}

/* ===================================================================
   2. INTERACTIVE CANVAS (PARTICLE CONSTELLATION)
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;
  const mouse = { x: null, y: null, radius: 130 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.35 ? 'rgba(16, 185, 129,' : 'rgba(6, 182, 212,';
      this.baseAlpha = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.14 * (1 - dist / 115)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ===================================================================
   3. NAVIGATION & SMOOTH SCROLL SPY
   =================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.btn-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', expanded);
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 110;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });
}

/* ===================================================================
   4. COMMAND PALETTE (CTRL+K / CMD+K)
   =================================================================== */
function initCommandPalette() {
  const backdrop = document.getElementById('cmd-palette');
  const triggerBtn = document.getElementById('btn-cmd-trigger');
  const input = document.getElementById('cmd-search-input');
  const items = document.querySelectorAll('.cmd-item');

  if (!backdrop || !input) return;

  function openPalette() {
    backdrop.style.display = 'flex';
    backdrop.classList.add('open');
    input.value = '';
    filterItems('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('open');
    backdrop.style.display = 'none';
  }

  function filterItems(query) {
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openPalette);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      backdrop.classList.contains('open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closePalette();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closePalette();
      executeCommand(action);
    });
  });

  function executeCommand(action) {
    switch(action) {
      case 'goto-estimator':
        document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto-cases':
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto-contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'copy-telegram':
        navigator.clipboard.writeText('https://t.me/yoldashev_dev').then(() => {
          showToast('Telegram link copied to clipboard!');
        });
        break;
      case 'copy-email':
        navigator.clipboard.writeText('uldasbek404@gmail.com').then(() => {
          showToast('Email address copied to clipboard!');
        });
        break;
      case 'open-github':
        window.open('https://github.com/yoldashev-dev', '_blank');
        break;
    }
  }
}

/* ===================================================================
   5. INTERACTIVE COST & SCOPE ESTIMATOR
   =================================================================== */
function initEstimator() {
  const form = document.getElementById('estimator-form');
  if (!form) return;

  const projectTiers = {
    landing: { price: 350, days: 4, label: 'High-Converting Landing Page' },
    corporate: { price: 650, days: 8, label: 'Corporate Brand Ecosystem' },
    ecommerce: { price: 950, days: 12, label: 'E-Commerce Storefront & Checkout' },
    webgl: { price: 1200, days: 14, label: 'Interactive 3D / WebGL Web App' }
  };

  const designModes = {
    bespoke: { multiplier: 1.0, label: 'Bespoke UI/UX From Scratch' },
    redesign: { multiplier: 0.85, label: 'Strategic Conversion Redesign' },
    figma: { multiplier: 0.9, label: 'Pixel-Perfect Figma Build' }
  };

  const addonFeatures = {
    telegram_webhook: { price: 60, days: 1, label: 'Instant Telegram / CRM Webhook' },
    quiz_calc: { price: 100, days: 1, label: 'Interactive CRO Quiz / Calculator' },
    webgl_effects: { price: 180, days: 3, label: 'Three.js / 60 FPS Micro-Interactions' },
    seo_cwv: { price: 80, days: 1, label: 'Technical SEO + 99+ PageSpeed Tuning' },
    i18n: { price: 120, days: 2, label: 'Multi-Language Localization (i18n)' }
  };

  function recalculate() {
    const pTypeInput = form.querySelector('input[name="project_type"]:checked');
    const pType = pTypeInput ? pTypeInput.value : 'landing';

    const dModeInput = form.querySelector('input[name="design_mode"]:checked');
    const dMode = dModeInput ? dModeInput.value : 'bespoke';

    const urgencyInput = form.querySelector('input[name="urgency"]:checked');
    const urgency = urgencyInput ? urgencyInput.value : 'standard';

    let base = projectTiers[pType].price * designModes[dMode].multiplier;
    let days = projectTiers[pType].days;

    const chosenAddons = [];
    form.querySelectorAll('input[name="addons"]:checked').forEach(cb => {
      const addon = addonFeatures[cb.value];
      if (addon) {
        base += addon.price;
        days += addon.days;
        chosenAddons.push(addon.label);
      }
    });

    if (urgency === 'express') {
      base *= 1.25;
      days = Math.max(2, Math.round(days * 0.65));
    }

    const finalPrice = Math.round(base);

    // Update Live UI
    const priceDisplay = document.getElementById('est-price-display');
    const timeDisplay = document.getElementById('est-time-display');
    const typeLabel = document.getElementById('est-type-label');
    const designLabel = document.getElementById('est-design-label');
    const addonsLabel = document.getElementById('est-addons-label');

    if (priceDisplay) priceDisplay.textContent = `$${finalPrice}`;
    if (timeDisplay) timeDisplay.textContent = `${days}–${days + 2} Business Days`;
    if (typeLabel) typeLabel.textContent = projectTiers[pType].label;
    if (designLabel) designLabel.textContent = designModes[dMode].label;
    if (addonsLabel) addonsLabel.textContent = chosenAddons.length ? chosenAddons.join(', ') : 'Standard Core';

    return {
      price: finalPrice,
      days,
      typeName: projectTiers[pType].label,
      designName: designModes[dMode].label,
      addons: chosenAddons
    };
  }

  form.addEventListener('change', recalculate);
  recalculate();

  // Send scope to Telegram button
  const tgBtn = document.getElementById('btn-est-telegram');
  if (tgBtn) {
    tgBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const scope = recalculate();
      const msg = encodeURIComponent(
        `Hello Yuldashbek! I configured a project scope on your portfolio:\n\n` +
        `• Architecture: ${scope.typeName}\n` +
        `• Design Approach: ${scope.designName}\n` +
        `• Modules: ${scope.addons.length ? scope.addons.join(', ') : 'Core Architecture'}\n` +
        `• Estimated Budget: ~$${scope.price} (${scope.days} Days)\n\n` +
        `I would love to discuss specifications and kick off development!`
      );
      window.open(`https://t.me/yoldashev_dev?text=${msg}`, '_blank');
      showToast('Redirecting to Telegram to discuss your scope!');
    });
  }

  // Copy scope to clipboard
  const copyBtn = document.getElementById('btn-est-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const scope = recalculate();
      const text = 
        `### Project Scope Brief for Yuldashbek (@yoldashev_dev)\n` +
        `- **Architecture:** ${scope.typeName}\n` +
        `- **Design:** ${scope.designName}\n` +
        `- **Selected Modules:** ${scope.addons.join(', ') || 'None'}\n` +
        `- **Target Investment:** ~$${scope.price}\n` +
        `- **Target Sprint Timeline:** ~${scope.days} Business Days\n` +
        `- **Reference:** Generated at yoldashev.dev`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Scope specification copied in Markdown format!');
      });
    });
  }
}

/* ===================================================================
   6. PORTFOLIO CASE STUDY FILTERS
   =================================================================== */
function initCaseFilters() {
  const filterBtns = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.case-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => { card.style.display = 'none'; }, 220);
        }
      });
    });
  });
}

/* ===================================================================
   7. CASE STUDY MODAL DRAWER
   =================================================================== */
const caseStudiesData = {
  exclusive: {
    title: 'Exclusive & Awesome Store — High-Performance E-Commerce',
    category: 'E-Commerce / Direct-to-Consumer',
    metrics: '+27% Average Order Value • 98/100 Core Web Vitals',
    summary: 'A bespoke modern storefront engineered with lightning-quick client-side product filtering, persistent localized cart state, responsive checkout flows, and sub-400ms page transitions without bloat.',
    highlights: [
      'Sub-50ms instant client-side taxonomy search and multi-attribute filters',
      'Cart state reconciliation using resilient LocalStorage & Session sync',
      'Internationalization ready with multi-currency dynamic calculations',
      'Achieved perfect 98+ PageSpeed scores without heavy third-party themes'
    ],
    tech: ['HTML5 Semantic', 'SCSS Architecture', 'Vanilla JS (ES6+)', 'LocalStorage API', 'Responsive Grid']
  },
  skillsync: {
    title: 'SkillSync — Next-Gen EdTech & Mentorship SaaS',
    category: 'SaaS / Web Application',
    metrics: '14.8% Signup Conversion Rate • 0.38s First Contentful Paint',
    summary: 'Comprehensive EdTech web portal featuring interactive curriculum views, mentor booking engine, real-time onboarding flows, and optimized lead capture funnels.',
    highlights: [
      'Engineered high-converting onboarding wizard with multi-step validation',
      'Gamified student learning dashboard with real-time progress indicators',
      'Modular component structure ensuring seamless future feature expansion'
    ],
    tech: ['Single Page App', 'Modern JavaScript', 'CSS Variables', 'REST Integration', 'Design System']
  },
  agrotycoon: {
    title: 'AgroTycoon 3D RTX — WebGL Three.js Browser Simulation',
    category: 'Interactive 3D / WebGL',
    metrics: 'Stable 60 FPS • Procedural PBR Shaders • Zero Plugins',
    summary: 'Production browser 3D experience featuring custom PBR shaders, dynamic shadow mapping, and instanced rendering of 110+ interactive assets running seamlessly on desktop and mobile browsers.',
    highlights: [
      'Real-time seamless camera switching between RTS bird-view and 1st-person FPS',
      'GPU instanced rendering achieving rock-solid 60 FPS on standard laptops',
      'Native WebGL implementation without heavy external game engine overhead'
    ],
    tech: ['Three.js', 'WebGL', 'JavaScript', 'Custom Shaders', 'PWA']
  },
  novapulse: {
    title: 'NovaPulse B2B SaaS — Enterprise Lead Generation Engine',
    category: 'High-Converting Landing Page',
    metrics: '8.4% Qualified Lead Rate (2.8x Industry Baseline)',
    summary: 'Conversion-engineered promotional landing page designed around the AIDA framework. Includes an interactive ROI savings calculator and automated lead routing straight to Telegram in under 1 second.',
    highlights: [
      'Hook-driven hero section addressing specific enterprise customer pain points',
      'Dynamic ROI financial calculator demonstrating measurable payback time',
      'Zero-latency Telegram Bot API webhook delivering lead context immediately'
    ],
    tech: ['Landing Page', 'CRO Architecture', 'Telegram API', 'CSS Grid', 'Micro-Interactions']
  },
  auraliving: {
    title: 'Aura Living Atelier — Luxury Interior Showcase',
    category: 'Luxury Showcase & Catalog',
    metrics: '3m 40s Average Session Time • < 18% Bounce Rate',
    summary: 'High-aesthetic digital showroom for luxury interior design. Utilizes subtle parallax depth, micro-interactions, editorial typography, and quick designer inquiry integration.',
    highlights: [
      'Fluid physics-based parallax scrolling without scroll jank or stutter',
      'High-resolution imagery loaded via responsive WebP with smart lazyloading',
      'Contextual call-to-actions tailored to each curated furniture collection'
    ],
    tech: ['Parallax Physics', 'CSS Animations', 'Lightbox UX', 'Technical SEO']
  },
  fintrack: {
    title: 'FinTrack Analytics — Financial Intelligence Dashboard',
    category: 'Web Application / Analytics',
    metrics: '< 45ms Interaction Latency • 100% Touch Responsive',
    summary: 'Sleek dark-mode financial dashboard equipped with interactive Canvas charts, customizable expense category breakdowns, zero-latency local caching, and spreadsheet export.',
    highlights: [
      'Hardware-accelerated Canvas line and bar chart visualizations',
      'Complete client-side privacy architecture with offline PWA capabilities',
      'Dark luxury aesthetic matching the highest financial product standards'
    ],
    tech: ['Canvas API', 'JavaScript', 'Glassmorphism', 'Dark Mode UI']
  }
};

function initCaseModals() {
  const backdrop = document.getElementById('case-modal');
  const closeTrigger = document.getElementById('modal-close-btn');
  const contentEl = document.getElementById('modal-dyn-content');

  if (!backdrop || !closeTrigger || !contentEl) return;

  document.querySelectorAll('.btn-view-case').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = btn.getAttribute('data-case');
      const data = caseStudiesData[caseId];
      if (!data) return;

      contentEl.innerHTML = `
        <div style="margin-bottom: 22px;">
          <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: var(--primary-light); text-transform: uppercase;">${data.category}</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.6rem; font-weight: 800; margin: 8px 0 12px; color: #fff;">${data.title}</h2>
          <div style="display: inline-block; padding: 5px 12px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; color: var(--primary-light); font-family: var(--font-mono); font-size: 0.82rem; font-weight: 600; margin-bottom: 18px;">
            ${data.metrics}
          </div>
          <p style="color: var(--text-secondary); font-size: 0.98rem; line-height: 1.7; margin-bottom: 24px;">${data.summary}</p>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Key Engineering Highlights:</h4>
          <ul style="list-style: none;">
            ${data.highlights.map(h => `
              <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; color: var(--text-secondary); font-size: 0.92rem;">
                <span style="color: var(--primary-light); font-weight: bold;">✔</span> ${h}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Architecture & Stack:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.tech.map(t => `
              <span style="padding: 4px 12px; background: #27272a; border: 1px solid var(--border-subtle); border-radius: 6px; font-family: var(--font-mono); font-size: 0.78rem; color: #e4e4e7;">${t}</span>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); padding-top: 22px;">
          <a href="https://t.me/yoldashev_dev?text=${encodeURIComponent('Hi Yuldashbek! I reviewed your case study: ' + data.title + '. I would like to build a similar high-performance project.')}" target="_blank" class="btn btn-primary btn-sm">
            Commission Similar Project
          </a>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('case-modal').classList.remove('active'); document.getElementById('case-modal').style.display='none';">
            Close
          </button>
        </div>
      `;

      backdrop.style.display = 'flex';
      backdrop.classList.add('active');
    });
  });

  function closeModal() {
    backdrop.classList.remove('active');
    backdrop.style.display = 'none';
  }

  closeTrigger.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
}

/* ===================================================================
   8. ACCESSIBLE FAQ ACCORDION
   =================================================================== */
function initFAQ() {
  const entries = document.querySelectorAll('.faq-entry');
  entries.forEach(entry => {
    const trigger = entry.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isExpanded = entry.classList.contains('active');
      entries.forEach(e => {
        e.classList.remove('active');
        e.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isExpanded) {
        entry.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ===================================================================
   9. INQUIRY FORM WITH TELEGRAM INTEGRATION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const contact = form.querySelector('[name="contact"]').value.trim();
    const service = form.querySelector('[name="service"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !contact) {
      showToast('Please provide your name and contact identifier.');
      return;
    }

    const payload = encodeURIComponent(
      `💼 New Project Inquiry via yoldashev.dev:\n\n` +
      `👤 Client: ${name}\n` +
      `📫 Contact: ${contact}\n` +
      `📌 Target Architecture: ${service}\n` +
      `💬 Details: ${message || 'No additional details provided'}`
    );

    window.open(`https://t.me/yoldashev_dev?text=${payload}`, '_blank');
    showToast('Inquiry drafted! Opening Telegram conversation...');
    form.reset();
  });
}

/* ===================================================================
   TOAST NOTIFICATION ENGINE
   =================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--primary-light); font-weight: bold; font-size: 1.1rem;">✓</span>
    <span>${message}</span>
  `;

  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}
