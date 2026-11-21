/**
 * PORTFOLIO APPLICATION - YULDASHEV.DEV
 * High-Converting Web & Landing Page Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavigation();
  initCalculator();
  initPortfolioFilter();
  initProjectModals();
  initFAQ();
  initContactForm();
});

/* ===================================================================
   1. INTERACTIVE BACKGROUND CANVAS
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 65;
  const mouse = { x: null, y: null, radius: 140 };

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
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
      this.baseAlpha = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse collision
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
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

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===================================================================
   2. NAVIGATION & SMOOTH SCROLL
   =================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.btn-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
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
   3. INTERACTIVE PROJECT COST CALCULATOR
   =================================================================== */
function initCalculator() {
  const form = document.getElementById('calc-form');
  if (!form) return;

  const basePrices = {
    landing: { price: 250, time: 4, name: 'Конверсионный Landing Page' },
    corporate: { price: 500, time: 8, name: 'Корпоративный сайт' },
    store: { price: 750, time: 12, name: 'Интернет-магазин / Каталог' },
    custom: { price: 900, time: 14, name: 'Индивидуальный сервис / WebGL' }
  };

  const designTiers = {
    custom: { mult: 1.0, name: 'Уникальный дизайн с нуля' },
    redesign: { mult: 0.85, name: 'Редизайн текущего сайта' },
    brandbook: { mult: 0.95, name: 'По вашему готовому брендбуку' }
  };

  const addonPrices = {
    telegram_bot: { price: 50, time: 1, name: 'Заявки в Telegram / CRM' },
    quiz_calc: { price: 80, time: 1, name: 'Квиз / Калькулятор' },
    webgl_anim: { price: 140, time: 3, name: 'WebGL 3D / Сложные анимации' },
    seo_analytics: { price: 60, time: 1, name: 'SEO + Метрика + Аналитика' },
    multilang: { price: 90, time: 2, name: 'Мультиязычность (2+ яз.)' }
  };

  function calculate() {
    const pTypeInput = form.querySelector('input[name="project_type"]:checked');
    const pType = pTypeInput ? pTypeInput.value : 'landing';

    const dTierInput = form.querySelector('input[name="design_tier"]:checked');
    const dTier = dTierInput ? dTierInput.value : 'custom';

    const urgencyInput = form.querySelector('input[name="urgency"]:checked');
    const urgency = urgencyInput ? urgencyInput.value : 'normal';

    let total = basePrices[pType].price * designTiers[dTier].mult;
    let days = basePrices[pType].time;

    const selectedAddons = [];
    form.querySelectorAll('input[name="addons"]:checked').forEach(cb => {
      const addon = addonPrices[cb.value];
      if (addon) {
        total += addon.price;
        days += addon.time;
        selectedAddons.push(addon.name);
      }
    });

    if (urgency === 'express') {
      total *= 1.25;
      days = Math.max(2, Math.round(days * 0.65));
    }

    total = Math.round(total);

    // Update UI elements
    const priceEl = document.getElementById('calc-display-price');
    const timeEl = document.getElementById('calc-display-time');
    const typeEl = document.getElementById('calc-summary-type');
    const designEl = document.getElementById('calc-summary-design');
    const addonsEl = document.getElementById('calc-summary-addons');

    if (priceEl) priceEl.textContent = `$${total} (~${(total * 95).toLocaleString('ru-RU')} ₽)`;
    if (timeEl) timeEl.textContent = `${days}–${days + 2} рабочих дней`;
    if (typeEl) typeEl.textContent = basePrices[pType].name;
    if (designEl) designEl.textContent = designTiers[dTier].name;
    if (addonsEl) addonsEl.textContent = selectedAddons.length ? selectedAddons.join(', ') : 'Без доп. опций';

    return { total, days, typeName: basePrices[pType].name, selectedAddons };
  }

  form.addEventListener('change', calculate);
  calculate();

  // Button to send brief to Telegram
  const tgBtn = document.getElementById('btn-calc-telegram');
  if (tgBtn) {
    tgBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const res = calculate();
      const text = encodeURIComponent(
        `Здравствуйте, Юлдашбек! Я рассчитал стоимость проекта на сайте-портфолио:\n\n` +
        `• Тип: ${res.typeName}\n` +
        `• Доп. опции: ${res.selectedAddons.length ? res.selectedAddons.join(', ') : 'Базовые'}\n` +
        `• Оценка: ~$${res.total} (${res.days} дн.)\n\n` +
        `Хочу обсудить детали и запустить разработку!`
      );
      window.open(`https://t.me/yoldashev_dev?text=${text}`, '_blank');
      showToast('Открываем Telegram для обсуждения деталей!');
    });
  }

  // Button to copy brief
  const copyBtn = document.getElementById('btn-calc-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const res = calculate();
      const text = 
        `Расчет проекта для Юлдашбека (@yoldashev_dev):\n` +
        `Тип: ${res.typeName}\n` +
        `Опции: ${res.selectedAddons.join(', ') || 'Базовые'}\n` +
        `Бюджет: ~$${res.total}\n` +
        `Сроки: ~${res.days} дней`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Параметры проекта скопированы в буфер!');
      });
    });
  }
}

/* ===================================================================
   4. PORTFOLIO FILTER
   =================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   5. PROJECT DETAILS MODAL
   =================================================================== */
const projectData = {
  exclusive: {
    title: 'Exclusive & Awesome Store — E-commerce Платформа',
    category: 'Интернет-магазин / Каталог',
    metrics: '+27% к среднему чеку • 98/100 PageSpeed',
    desc: 'Премиальный интернет-магазин с каталогом товаров, умной корзиной, мгновенной фильтрацией по параметрам и брендам, интеграцией платежей и чекаутом. Реализована оптимизация картинок WebP и LazyLoad.',
    tech: ['HTML5', 'SCSS', 'JavaScript ES6+', 'LocalStorage', 'Responsive Grid'],
    highlights: [
      'Мгновенная клиентская фильтрация и поиск без перезагрузки страниц',
      'Интуитивная корзина с сохранением состояния заказа в локальном хранилище',
      'Адаптивный чекаут с маской телефона и валидацией данных',
      'Идеальная оценка Core Web Vitals'
    ]
  },
  skillsync: {
    title: 'SkillSync — EdTech Платформа онлайн-обучения',
    category: 'SaaS / Веб-сервис',
    metrics: 'Конверсия в регистрацию 14.8% • 0.38с загрузка',
    desc: 'Платформа для онлайн-обучения, поиска менторов и интерактивных курсов. Личный кабинет ученика, прогресс-бар прохождения уроков, адаптивные карточки курсов и лид-формы захвата.',
    tech: ['Single Page App', 'Modern JavaScript', 'CSS Variables', 'REST API', 'Figma to Code'],
    highlights: [
      'Удобный интерактивный каталог курсов с фильтрацией по уровням',
      'Геймифицированный личный кабинет ученика с бейджами и трекером',
      'Интеграция форм обратной связи с валидацией в реальном времени'
    ]
  },
  agrotycoon: {
    title: 'AgroTycoon 3D — Высокотехнологичный WebGL 3D-проект',
    category: 'Интерактив / WebGL / Three.js',
    metrics: 'Стабильные 60 FPS • PBR материалы • PCF тени',
    desc: 'Масштабный браузерный 3D-симулятор с процедурными материалами, динамическим освещением и инстансингом 110+ объектов окружения без просадок FPS. Полная адаптивность под мышь и клавиатуру.',
    tech: ['Three.js', 'WebGL', 'JavaScript', 'Custom Shaders', 'PWA'],
    highlights: [
      'Переключение между стратегическим видом RTS и видом от 1-го лица FPS',
      'Мягкие динамические тени и процедурные текстуры почвы и техники',
      'Мгновенная загрузка в браузере без установки сторонних плагинов'
    ]
  },
  novapulse: {
    title: 'NovaPulse — Высококонверсионный B2B Landing Page',
    category: 'Конверсионный Landing Page',
    metrics: 'Конверсия 8.4% (в 2.5 раза выше рынка)',
    desc: 'Продающий промо-лендинг для SaaS-продукта. Смысловая упаковка по модели AIDA, интерактивный калькулятор экономии времени и автоматический роутинг лидов в Telegram-канал руководителя за 1 секунду.',
    tech: ['Landing Page', 'AIDA Structure', 'Telegram Bot API', 'CSS Grid', 'Micro-interactions'],
    highlights: [
      'Продуманный первый экран с оффером, бьющим точно в боли клиента',
      'Калькулятор ROI, показывающий выгоду в режиме реального времени',
      'Интеграция с Telegram Bot API: моментальные уведомления о заявках'
    ]
  },
  auraliving: {
    title: 'Aura Living — Мебельный бутик и промо-сайт',
    category: 'Промо-сайт / Интернет-каталог',
    metrics: 'Время на сайте 3м 40с • Отказ < 18%',
    desc: 'Элегантный презентационный промо-сайт премиальной мебели и интерьерных решений. Параллакс-эффекты, плавный скролл, галерея коллекций с зумом и быстрый заказ консультации дизайнера.',
    tech: ['Parallax Scroll', 'CSS Animations', 'Lightbox Gallery', 'SEO Optimized'],
    highlights: [
      'Минималистичный премиальный дизайн в темных и теплых тонах',
      'Интерактивная примерка мебели в интерьере',
      'Быстрая форма заказа консультации с отправкой в CRM'
    ]
  },
  fintrack: {
    title: 'FinTrack — Веб-дашборд и Аналитический портал',
    category: 'Веб-сервис / Dashboard',
    metrics: 'Скорость отклика < 50мс • Dark UI',
    desc: 'Интерактивный дашборд персональных финансов и аналитики расходов. Интерактивные графики, фильтрация по периодам, экспорт отчетов и адаптивный интерфейс под планшеты и смартфоны.',
    tech: ['Canvas Charts', 'JavaScript', 'Glassmorphism', 'Dark Mode'],
    highlights: [
      'Интерактивная визуализация данных с анимацией графиков',
      'Абсолютно отзывчивый интерфейс с поддержкой touch-свайпов',
      'Полная приватность: хранение данных в браузере пользователя'
    ]
  }
};

function initProjectModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalContent = document.getElementById('modal-body-content');

  if (!overlay || !closeBtn || !modalContent) return;

  document.querySelectorAll('.btn-view-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project');
      const data = projectData[pId];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">${data.category}</span>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin: 8px 0 12px; color: #fff;">${data.title}</h2>
          <div style="display: inline-block; padding: 6px 14px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; color: #34d399; font-size: 0.85rem; font-weight: 700; margin-bottom: 18px;">
            ${data.metrics}
          </div>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 24px;">${data.desc}</p>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Ключевые преимущества кейса:</h4>
          <ul style="list-style: none;">
            ${data.highlights.map(h => `
              <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; color: var(--text-muted); font-size: 0.92rem;">
                <span style="color: var(--accent-emerald); font-weight: bold;">✔</span> ${h}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Технологический стек:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.tech.map(t => `
              <span style="padding: 4px 12px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.82rem; color: #cbd5e1;">${t}</span>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; border-top: 1px solid var(--border-color); padding-top: 20px;">
          <a href="https://t.me/yoldashev_dev?text=${encodeURIComponent('Здравствуйте, Юлдашбек! Меня заинтересовал ваш кейс: ' + data.title + '. Хочу сделать похожий проект.')}" target="_blank" class="btn btn-primary btn-sm">
            Заказать похожий проект
          </a>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-overlay').classList.remove('active')">
            Закрыть
          </button>
        </div>
      `;

      overlay.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
}

/* ===================================================================
   6. FAQ ACCORDION
   =================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   7. CONTACT FORM HANDLER
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const contact = form.querySelector('[name="contact"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const service = form.querySelector('[name="service"]').value;

    if (!name || !contact) {
      showToast('Пожалуйста, заполните имя и контакт для связи!');
      return;
    }

    const tgMessage = encodeURIComponent(
      `👋 Новая заявка с сайта-портфолио:\n\n` +
      `👤 Имя: ${name}\n` +
      `📞 Контакт: ${contact}\n` +
      `📌 Услуга: ${service}\n` +
      `💬 Задача: ${message || 'Не указано'}`
    );

    // Open Telegram directly with prefilled message
    window.open(`https://t.me/yoldashev_dev?text=${tgMessage}`, '_blank');

    showToast('Спасибо за заявку! Открываем диалог в Telegram для связи.');
    form.reset();
  });
}

/* ===================================================================
   HELPERS & TOAST
   =================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--accent-emerald); font-size: 1.2rem;">✓</span>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
