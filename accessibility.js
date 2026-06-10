/* ==============================================
   accessibility.js — версия для слабовидящих
   Функции:
   1. Увеличение шрифта (три шага)
   2. Высокий контраст
   3. Подчёркивание всех ссылок
   4. Сброс всех настроек
   Все настройки сохраняются в localStorage.
   ============================================== */

(function () {

  /* ── Размеры шрифта ── */
  var FONT_SIZES = ['normal', 'large', 'x-large'];
  var fontIndex  = 0;

  function applyFontSize(index) {
    document.body.classList.remove('font-large', 'font-x-large');
    if (index === 1) document.body.classList.add('font-large');
    if (index === 2) document.body.classList.add('font-x-large');
    var btn = document.getElementById('acc-font');
    if (btn) btn.setAttribute('aria-label', 'Размер шрифта: ' + FONT_SIZES[index]);
  }

  /* ── Высокий контраст ── */
  function applyContrast(on) {
    document.body.classList.toggle('high-contrast', on);
    var btn = document.getElementById('acc-contrast');
    if (btn) btn.classList.toggle('acc-active', on);
  }

  /* ── Подчёркивание ссылок ── */
  function applyUnderline(on) {
    document.body.classList.toggle('underline-links', on);
    var btn = document.getElementById('acc-underline');
    if (btn) btn.classList.toggle('acc-active', on);
  }

  /* ── Восстановить из localStorage ── */
  function restoreSettings() {
    fontIndex = parseInt(localStorage.getItem('acc-font') || '0', 10);
    applyFontSize(fontIndex);
    if (localStorage.getItem('acc-contrast') === '1') applyContrast(true);
    if (localStorage.getItem('acc-underline') === '1') applyUnderline(true);
  }

  /* ── Панель доступности ── */
  function buildPanel() {
    /* Кнопка-триггер (глаз) */
    var trigger = document.createElement('button');
    trigger.id = 'acc-trigger';
    trigger.setAttribute('aria-label', 'Открыть панель доступности');
    trigger.setAttribute('title', 'Версия для слабовидящих');
    trigger.textContent = '👁';

    /* Панель */
    var panel = document.createElement('div');
    panel.id = 'acc-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Настройки доступности');
    panel.innerHTML =
      '<p class="acc-title">Для слабовидящих</p>' +
      '<button id="acc-font"      title="Увеличить шрифт">А+</button>' +
      '<button id="acc-contrast"  title="Высокий контраст">◑</button>' +
      '<button id="acc-underline" title="Подчеркнуть ссылки">U̲</button>' +
      '<button id="acc-reset"     title="Сбросить настройки">✕</button>';

    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    /* Открыть / закрыть панель */
    trigger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* Шрифт — перебор трёх размеров */
    document.getElementById('acc-font').addEventListener('click', function () {
      fontIndex = (fontIndex + 1) % FONT_SIZES.length;
      applyFontSize(fontIndex);
      localStorage.setItem('acc-font', fontIndex);
    });

    /* Контраст */
    document.getElementById('acc-contrast').addEventListener('click', function () {
      var on = !document.body.classList.contains('high-contrast');
      applyContrast(on);
      localStorage.setItem('acc-contrast', on ? '1' : '0');
    });

    /* Подчёркивание */
    document.getElementById('acc-underline').addEventListener('click', function () {
      var on = !document.body.classList.contains('underline-links');
      applyUnderline(on);
      localStorage.setItem('acc-underline', on ? '1' : '0');
    });

    /* Сброс */
    document.getElementById('acc-reset').addEventListener('click', function () {
      fontIndex = 0;
      applyFontSize(0);
      applyContrast(false);
      applyUnderline(false);
      localStorage.removeItem('acc-font');
      localStorage.removeItem('acc-contrast');
      localStorage.removeItem('acc-underline');
    });

    /* Закрыть по Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') panel.classList.remove('open');
    });
  }

  /* ── Запуск ── */
  document.addEventListener('DOMContentLoaded', function () {
    restoreSettings();
    buildPanel();
  });

})();
