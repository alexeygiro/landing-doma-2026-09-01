(function () {
  'use strict';

  // ЗАМЕНИТЬ НА URL ОСНОВНОГО САЙТА
  // Используется только для событий аналитики ниже.
  // Сами кнопки-ссылки в HTML уже ведут на этот же адрес через href — при замене
  // поменяйте значение и здесь, и во всех href="https://example.com/" в index.html.
  var MAIN_SITE_URL = 'https://example.com/';

  // Отмечаем, что JS выполняется — CSS использует класс .js-enabled
  // для прогрессивного улучшения (без JS сайт остаётся полностью читаемым).
  document.documentElement.classList.add('js-enabled');

  /* =========================================================
     АНАЛИТИКА (заглушка)
     ========================================================= */
  function trackEvent(eventName, params) {
    // eslint-disable-next-line no-console
    console.log('[trackEvent]', eventName, params || {});

    // Подключение Яндекс Метрики (раскомментировать и указать номер счётчика):
    // if (typeof ym === 'function') { ym(XXXXXXXX, 'reachGoal', eventName, params); }

    // Подключение Google Analytics (раскомментировать):
    // if (typeof gtag === 'function') { gtag('event', eventName, params || {}); }
  }

  /* =========================================================
     БУРГЕР-МЕНЮ
     ========================================================= */
  var burgerBtn = document.getElementById('burgerBtn');
  var mainNav = document.getElementById('main-nav');

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mainNav.classList.remove('is-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================================================
     СКРОЛЛ-АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ
     ========================================================= */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Нет поддержки IntersectionObserver — просто показываем всё сразу
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* =========================================================
     FAQ АККОРДЕОН
     ========================================================= */
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(btn.getAttribute('aria-controls'));

      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.classList.toggle('is-open', !expanded);

      if (!expanded) {
        trackEvent('faq_open', { question: btn.textContent.trim() });
      }
    });
  });

  /* =========================================================
     ИНТЕРАКТИВНЫЕ ДЕМО-ЗАДАНИЯ
     ========================================================= */
  var CORRECT_MESSAGES = ['Верно!', 'Есть решение!'];
  var RETRY_MESSAGES = ['Почти. Посмотрите ещё раз.', 'Здесь есть маленькая хитрость.'];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  var demoCards = document.querySelectorAll('.demo-card');
  demoCards.forEach(function (card) {
    var correct = card.getAttribute('data-correct');
    var feedback = card.querySelector('.demo-feedback');
    var buttons = card.querySelectorAll('.demo-options button');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (card.classList.contains('is-solved')) return;

        var value = btn.getAttribute('data-value');
        var isCorrect = value === correct;

        trackEvent('demo_task_answer', {
          demo: card.getAttribute('data-demo'),
          correct: isCorrect
        });

        if (isCorrect) {
          btn.classList.add('is-correct');
          card.classList.add('is-solved');
          if (feedback) {
            feedback.textContent = pickRandom(CORRECT_MESSAGES);
            feedback.classList.remove('is-retry');
          }
        } else {
          btn.classList.add('is-wrong');
          if (feedback) {
            feedback.textContent = pickRandom(RETRY_MESSAGES);
            feedback.classList.add('is-retry');
          }
          setTimeout(function () {
            btn.classList.remove('is-wrong');
          }, 700);
        }
      });
    });
  });

  /* =========================================================
     ТРЕКИНГ CTA-КНОПОК
     ========================================================= */
  document.querySelectorAll('[data-track]').forEach(function (link) {
    link.addEventListener('click', function () {
      trackEvent(link.getAttribute('data-track'), { target: MAIN_SITE_URL });
    });
  });

  /* =========================================================
     ТЕКУЩИЙ ГОД В ФУТЕРЕ
     ========================================================= */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
