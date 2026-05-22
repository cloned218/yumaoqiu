(function(){
  'use strict';

  // ===== Page Navigation =====
  var navItems = document.querySelectorAll('.nav-item');
  var pages = document.querySelectorAll('.page');

  // Map nav data to page ids
  var navToPage = {
    home: 'page-home',
    ranking: 'page-ranking-empty',
    match: 'page-home',
    shop: 'page-home',
    profile: 'page-home'
  };

  function showPage(pageId) {
    pages.forEach(function(p) { p.classList.remove('active'); });
    var target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    document.getElementById('mainContent').scrollTop = 0;
  }

  function setActiveNav(navName) {
    navItems.forEach(function(item) {
      item.classList.remove('active');
      if (item.getAttribute('data-nav') === navName) item.classList.add('active');
    });
  }

  navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      var nav = this.getAttribute('data-nav');
      setActiveNav(nav);
      var pageId = navToPage[nav] || 'page-home';
      showPage(pageId);
    });
  });

  // ===== In-page links (排位赛历史, back buttons) =====
  document.addEventListener('click', function(e) {
    var link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      var pageId = link.getAttribute('data-page');
      showPage('page-' + pageId.replace('page-',''));
    }
    var back = e.target.closest('[data-back]');
    if (back) {
      e.preventDefault();
      setActiveNav('ranking');
      showPage('page-ranking-empty');
    }
  });

  // ===== Banner Carousel Auto-rotate =====
  (function bannerCarousel() {
    var slides = document.querySelectorAll('#page-home .banner-slide');
    var dots = document.querySelectorAll('#page-home .banner-dots .dot');
    if (!slides.length) return;
    var current = 0;
    setInterval(function() {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }, 3500);
  })();

  // ===== Match Progress Animation (匹配中 page) =====
  (function matchingAnimation() {
    var pulseAvatar = document.querySelector('#page-ranking-matching .mp-avatar.pulse');
    var vsText = document.querySelector('#page-ranking-matching .match-vs-text.matching');
    if (!pulseAvatar && !vsText) return;
    // Pulse and blink are CSS animations - they run automatically
  })();

  // ===== Countdown Timer (待评价 page) =====
  (function reviewCountdown() {
    var countdownEl = document.querySelector('#page-ranking-review .countdown strong');
    if (!countdownEl) return;
    var parts = countdownEl.textContent.split(':');
    var h = parseInt(parts[0]) || 23;
    var m = parseInt(parts[1]) || 59;
    var s = parseInt(parts[2]) || 50;
    var totalSeconds = h * 3600 + m * 60 + s;
    setInterval(function() {
      if (totalSeconds <= 0) { countdownEl.textContent = '00:00:00'; return; }
      totalSeconds--;
      var hh = Math.floor(totalSeconds / 3600);
      var mm = Math.floor((totalSeconds % 3600) / 60);
      var ss = totalSeconds % 60;
      countdownEl.textContent =
        String(hh).padStart(2,'0') + ':' +
        String(mm).padStart(2,'0') + ':' +
        String(ss).padStart(2,'0');
    }, 1000);
  })();

  // ===== Rule card expand/collapse =====
  // Handled inline via onclick toggle in HTML

  // ===== History card expand/collapse =====
  // Handled inline via onclick toggle in HTML

  console.log('羽乐场 SPA 已就绪');
})();
