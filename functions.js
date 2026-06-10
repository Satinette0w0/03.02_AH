/* ==============================================
   SatiArtworks — functions.js
   1. Тёмная тема
   2. Кнопка «Наверх»
   3. Lightbox (галерея works.html)
   4. Фильтрация постов (index.html)
   ============================================== */


/* ── 1. ТЁМНАЯ ТЕМА ──────────────────────────────
   Переключает класс .dark на <body>.
   Сохраняет выбор в localStorage, чтобы тема
   запоминалась при переходе между страницами.
   ─────────────────────────────────────────────── */
function initDarkMode() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Восстановить сохранённую тему
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    btn.textContent = '☀';
    btn.setAttribute('aria-label', 'Включить светлую тему');
  }

  btn.addEventListener('click', function () {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btn.textContent = isDark ? '☀' : '☾';
    btn.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
  });
}


/* ── 2. КНОПКА «НАВЕРХ» ──────────────────────────
   Появляется после прокрутки вниз на 300px.
   Плавно прокручивает страницу к началу.
   ─────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  // Показывать / скрывать кнопку при прокрутке
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  // Прокрутка наверх по клику
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ── 3. LIGHTBOX ─────────────────────────────────
   Открывает любое изображение на works.html
   в полноэкранном оверлее.
   Закрывается кликом по фону, крестиком
   или клавишей Escape.
   Стрелки ← → переключают между работами.
   ─────────────────────────────────────────────── */
function initLightbox() {
  const images = Array.from(document.querySelectorAll('.gallery-img'));
  if (images.length === 0) return;

  // Создать оверлей один раз
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Закрыть">✕</button>
    <button class="lb-prev"  aria-label="Предыдущее">‹</button>
    <img    class="lb-img"   src="" alt="Увеличенная работа">
    <button class="lb-next"  aria-label="Следующее">›</button>
    <p     class="lb-counter"></p>
  `;
  document.body.appendChild(overlay);

  const lbImg     = overlay.querySelector('.lb-img');
  const lbCounter = overlay.querySelector('.lb-counter');
  let current = 0;

  function openAt(index) {
    current = index;
    lbImg.src = images[current].src;
    lbCounter.textContent = (current + 1) + ' / ' + images.length;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() { openAt((current - 1 + images.length) % images.length); }
  function next() { openAt((current + 1) % images.length); }

  // Открыть при клике на картинку
  images.forEach(function (img, i) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () { openAt(i); });
  });

  // Управление оверлеем
  overlay.querySelector('.lb-close').addEventListener('click', close);
  overlay.querySelector('.lb-prev').addEventListener('click', prev);
  overlay.querySelector('.lb-next').addEventListener('click', next);

  // Клик по фону закрывает
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  // Клавиатура
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}


/* ── 4. ФИЛЬТРАЦИЯ ПОСТОВ ────────────────────────
   Работает на index.html.
   Фильтрует карточки постов по тегу (категории)
   при клике на кнопку-фильтр.
   Поиск по тексту заголовка и описания.
   ─────────────────────────────────────────────── */
function initFilter() {
  const searchInput   = document.getElementById('search-input');
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const cards         = document.querySelectorAll('.post-card');

  if (!searchInput && filterBtns.length === 0) return;

  let activeTag = 'all';

  // Применить оба фильтра одновременно
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(function (card) {
      const title   = (card.querySelector('.post-card_title')   || {}).textContent || '';
      const excerpt = (card.querySelector('.post-card_excerpt') || {}).textContent || '';
      const tag     = (card.querySelector('.tag')               || {}).textContent || '';

      const matchesTag    = activeTag === 'all' || tag.toLowerCase().includes(activeTag.toLowerCase());
      const matchesSearch = title.toLowerCase().includes(query) || excerpt.toLowerCase().includes(query);

      card.style.display = (matchesTag && matchesSearch) ? '' : 'none';
    });

    // Показать сообщение если ничего не найдено
    const noResults = document.getElementById('no-results');
    if (noResults) {
      const anyVisible = Array.from(cards).some(function (c) { return c.style.display !== 'none'; });
      noResults.style.display = anyVisible ? 'none' : 'block';
    }
  }

  // Кнопки-фильтры по тегам
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeTag = btn.dataset.tag || 'all';
      applyFilters();
    });
  });

  // Поиск при вводе текста
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}


/* ── ЗАПУСК ──────────────────────────────────────
   Все функции вызываются после загрузки DOM.
   ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initDarkMode();
  initScrollTop();
  initLightbox();
  initFilter();
});
