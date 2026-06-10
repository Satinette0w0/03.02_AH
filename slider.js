/* ==============================================
   slider.js — слайдер для works.html
   Показывает изображения по одному.
   Управление:
   - кнопки ← →
   - точки (dots) внизу
   - клавиши ArrowLeft / ArrowRight
   - свайп на мобиле (touch)
   - автопрокрутка каждые 4 секунды
     (пауза при наведении мыши)
   ============================================== */

(function () {

  document.addEventListener('DOMContentLoaded', function () {

    var container = document.getElementById('slider');
    if (!container) return;

    var slides  = Array.from(container.querySelectorAll('.slide'));
    var total   = slides.length;
    var current = 0;
    var autoTimer;

    /* ── Перейти к слайду ── */
    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');

      current = (index + total) % total;

      slides[current].classList.add('active');
      dots[current].classList.add('active');

      counter.textContent = (current + 1) + ' / ' + total;
    }

    /* ── Кнопки ─────── */
    var btnPrev = document.getElementById('slider-prev');
    var btnNext = document.getElementById('slider-next');
    var counter = document.getElementById('slider-counter');

    if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    /* ── Точки ──────── */
    var dotsWrap = document.getElementById('slider-dots');
    var dots = [];
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'slider-dot';
      d.setAttribute('aria-label', 'Слайд ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); resetAuto(); });
      dotsWrap.appendChild(d);
      dots.push(d);
    });

    /* ── Клавиатура ── */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
    });

    /* ── Свайп (мобиль) ── */
    var touchStartX = 0;
    container.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    container.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });

    /* ── Автопрокрутка ── */
    function startAuto() {
      autoTimer = setInterval(function () { goTo(current + 1); }, 4000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    container.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    container.addEventListener('mouseleave', startAuto);

    /* ── Инициализация ── */
    goTo(0);
    startAuto();
  });

})();
