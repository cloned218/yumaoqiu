(function () {
  'use strict';

  var routes = [
    {
      route: 'home',
      title: '首页',
      image: 'assets/figma/pages/home@2x.png',
      width: 448,
      height: 1283
    },
    {
      route: 'ranking-empty',
      title: '排位赛无',
      image: 'assets/figma/pages/ranking-empty@2x.png',
      width: 448,
      height: 990.5
    },
    {
      route: 'ranking-matched',
      title: '排位赛-已匹配，待确认',
      image: 'assets/figma/pages/ranking-matched@2x.png',
      width: 448,
      height: 1072
    },
    {
      route: 'ranking-matching',
      title: '排位赛-匹配中',
      image: 'assets/figma/pages/ranking-matching@2x.png',
      width: 448,
      height: 1072
    },
    {
      route: 'ranking-pending',
      title: '排位赛-待参赛',
      image: 'assets/figma/pages/ranking-pending@2x.png',
      width: 448,
      height: 1072
    },
    {
      route: 'ranking-review',
      title: '排位赛-待评价',
      image: 'assets/figma/pages/ranking-review@2x.png',
      width: 448,
      height: 1072
    },
    {
      route: 'ranking-history',
      title: '排位赛历史',
      image: 'assets/figma/pages/ranking-history@2x.png',
      width: 448,
      height: 1044
    }
  ];

  var routeMap = {};
  routes.forEach(function (page) {
    routeMap[page.route] = page;
  });

  var hotspots = {
    home: [
      { to: 'ranking-empty', left: 24, top: 0, width: 98, height: 74 },
      { to: 'ranking-empty', left: 0, top: 1216, width: 180, height: 67 }
    ],
    'ranking-empty': [
      { to: 'ranking-history', left: 16, top: 918, width: 416, height: 44 }
    ],
    'ranking-matched': [
      { to: 'ranking-empty', left: 14, top: 50, width: 32, height: 28 }
    ],
    'ranking-matching': [
      { to: 'ranking-empty', left: 14, top: 50, width: 32, height: 28 }
    ],
    'ranking-pending': [
      { to: 'ranking-empty', left: 14, top: 50, width: 32, height: 28 }
    ],
    'ranking-review': [
      { to: 'ranking-empty', left: 14, top: 50, width: 32, height: 28 }
    ],
    'ranking-history': [
      { to: 'ranking-empty', left: 14, top: 50, width: 32, height: 28 }
    ]
  };

  var frame = document.getElementById('frame');

  function renderPage(route) {
    var page = routeMap[route] || routes[0];
    frame.innerHTML = '';
    frame.style.aspectRatio = page.width + ' / ' + page.height;

    var image = document.createElement('img');
    image.src = page.image;
    image.alt = page.title + ' Figma 导出图';
    image.width = page.width;
    image.height = Math.round(page.height);
    frame.appendChild(image);

    (hotspots[page.route] || []).forEach(function (spot) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'hotspot';
      button.setAttribute('aria-label', '前往' + (routeMap[spot.to] ? routeMap[spot.to].title : spot.to));
      button.style.left = (spot.left / page.width * 100) + '%';
      button.style.top = (spot.top / page.height * 100) + '%';
      button.style.width = (spot.width / page.width * 100) + '%';
      button.style.height = (spot.height / page.height * 100) + '%';
      button.addEventListener('click', function () {
        setRoute(spot.to);
      });
      frame.appendChild(button);
    });

    document.title = '羽乐场 - ' + page.title;
  }

  function getRoute() {
    var hash = window.location.hash.replace(/^#\/?/, '');
    return routeMap[hash] ? hash : routes[0].route;
  }

  function setRoute(route) {
    if (!routeMap[route]) {
      route = routes[0].route;
    }
    if (getRoute() !== route) {
      window.location.hash = '#/' + route;
      return;
    }
    renderPage(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  window.addEventListener('hashchange', function () {
    renderPage(getRoute());
  });

  renderPage(getRoute());
})();
