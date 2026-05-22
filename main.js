(function () {
  'use strict';

  var NAV_ITEMS = [
    { key: 'home', label: '首页', route: 'home', icon: 'assets/figma/elements/194-1218.png', iconActive: 'assets/figma/elements/194-1081.png' },
    { key: 'ranking', label: '排位', route: 'ranking-empty', icon: 'assets/figma/elements/194-1091.png', iconActive: 'assets/figma/elements/194-1228.png' },
    { key: 'play', label: '约球', route: 'home', icon: 'assets/figma/elements/194-1096.png' },
    { key: 'shop', label: '商城', route: 'home', icon: 'assets/figma/elements/194-1104.png' },
    { key: 'mine', label: '我的', route: 'home', icon: 'assets/figma/elements/194-1111.png' }
  ];

  var RULES = [
    '1. 积分计算：胜场增加积分，败场扣除积分。具体分值根据双方段位差距动态计算（ELO机制）。',
    '2. 段位划分：系统分为青铜、白银、黄金、白金、钻石、星耀、王者七个大段位。',
    '3. 晋级规则：积分达到当前段位上限自动触发晋级赛，三局两胜即可晋级下一段位。',
    '4. 活跃衰减：白金及以上段位若超过14天未参与排位，将每周扣除一定活跃积分。'
  ];

  var PAGES = {
    home: { title: '首页', nav: 'home', height: 1283, render: renderHome },
    'ranking-empty': { title: '排位赛', nav: 'ranking', height: 991, render: renderRankingEmpty },
    'ranking-matched': { title: '排位赛', nav: 'ranking', height: 1072, render: renderRankingMatched },
    'ranking-matching': { title: '排位赛', nav: 'ranking', height: 1072, render: renderRankingMatching },
    'ranking-pending': { title: '排位赛', nav: 'ranking', height: 1072, render: renderRankingPending },
    'ranking-review': { title: '排位赛', nav: 'ranking', height: 1072, render: renderRankingReview },
    'ranking-history': { title: '排位赛历史', nav: 'ranking', height: 1044, render: renderRankingHistory }
  };

  var app = document.getElementById('app');

  function statusBar() {
    return '<div class="status-bar">'
      + '<span class="status-time">9:41</span>'
      + '<div class="status-right">'
      + '<span class="signal"><i></i><i></i><i></i><i></i></span>'
      + '<span class="wifi"></span>'
      + '<span class="battery"><span></span></span>'
      + '</div>'
      + '</div>';
  }

  function pageHeader(title, showBack, backRoute) {
    return '<header class="page-header">'
      + (showBack ? ('<button class="back" data-route="' + backRoute + '" aria-label="返回"></button>') : '<span class="back-space"></span>')
      + '<h1>' + title + '</h1>'
      + '<span class="back-space"></span>'
      + '</header>';
  }

  function rankCard(topOffset) {
    return '<section class="rank-card" style="margin-top:' + topOffset + 'px">'
      + '<img class="avatar" src="assets/figma/elements/194-1474.png" alt="头像">'
      + '<div class="rank-meta">'
      + '<h2>羽球小飞侠</h2>'
      + '<p>金枪鱼</p>'
      + '</div>'
      + '<div class="rank-score">'
      + '<span>当前排位赛分数</span>'
      + '<strong>1,250<em>分</em></strong>'
      + '</div>'
      + '</section>';
  }

  function nav(active) {
    return '<nav class="bottom-nav">' + NAV_ITEMS.map(function (item) {
      var isActive = item.key === active;
      var icon = isActive && item.iconActive ? item.iconActive : item.icon;
      return '<button class="nav-item' + (isActive ? ' is-active' : '') + '" data-route="' + item.route + '" aria-label="' + item.label + '">'
        + '<img src="' + icon + '" alt="">'
        + '<span>' + item.label + '</span>'
        + '</button>';
    }).join('') + '</nav>';
  }

  function rulesBlock(top) {
    return '<section class="card rules" style="margin-top:' + top + 'px">'
      + '<h3>排位赛规则说明</h3>'
      + RULES.map(function (rule) { return '<p>' + rule + '</p>'; }).join('')
      + '</section>';
  }

  function matchSteps(state) {
    var states = [
      { id: 'pay', num: '1', label: '支付' },
      { id: 'match', num: '2', label: '匹配' },
      { id: 'confirm', num: '3', label: '确认' },
      { id: 'play', num: '4', label: '参赛' }
    ];
    return '<div class="steps">' + states.map(function (step, idx) {
      var cls = 'step';
      if (idx < state.active) cls += ' done';
      if (idx === state.active) cls += ' active';
      if (state.warn === idx) cls += ' warn';
      return '<div class="' + cls + '"><span>' + step.num + '</span><em>' + step.label + '</em></div>';
    }).join('') + '</div>';
  }

  function historyShortCard(title, top, status, score, time, place, action) {
    return '<section class="card simple" style="margin-top:' + top + 'px">'
      + '<div class="history-head"><h3>' + title + '</h3><div class="history-score ' + status + '"><strong>' + score + '</strong><span>' + (status === 'win' ? '胜利' : '失败') + '</span></div></div>'
      + '<p>' + time + '</p>'
      + '<p>' + place + '</p>'
      + '<div class="history-action"><span>赛事对局比分</span><button>' + action + '</button></div>'
      + '</section>';
  }

  function renderHome() {
    return statusBar()
      + '<section class="home-hero">'
      + '<div class="shortcut-grid">'
      + shortcutCard('ranking-empty', 'shortcut-teal', 'assets/figma/elements/194-982.png', '排位赛')
      + shortcutCard('', 'shortcut-green', 'assets/figma/elements/194-988.png', '发起约球')
      + shortcutCard('', 'shortcut-red', 'assets/figma/elements/194-1004.png', '球局列表')
      + shortcutCard('', 'shortcut-orange', 'assets/figma/elements/194-998.png', '计分器')
      + '</div>'
      + '<section class="hero-banner">'
      + '<img src="assets/figma/elements/194-1032.png" alt="羽毛球赛事横幅">'
      + '</section>'
      + '<article class="profile-completion">'
      + '<div class="profile-copy"><div class="profile-icon-wrap"><img src="assets/figma/elements/194-1051.png" alt=""></div><div><h2>完善个人资料</h2><p>资料完善度60%，完善后可解锁更多权益</p></div></div>'
      + '<button>去完善</button>'
      + '</article>'
      + '</section>'
      + '<section class="home-section">'
      + '<header><h3>最近开场的约球局</h3><button>查看全部 <img src="assets/figma/elements/194-1066.png" alt=""></button></header>'
      + matchCard(1)
      + matchCard(2)
      + '</section>'
      + '<section class="home-partner">'
      + '<img src="assets/figma/elements/194-1072.png" alt="官方合作球馆">'
      + '<div class="partner-text"><small>官方合作</small><strong>星动体育中心<br>周末畅打特惠</strong></div>'
      + '</section>'
      + nav('home');
  }

  function shortcutCard(route, tone, icon, label) {
    return '<button class="shortcut"'
      + (route ? ' data-route="' + route + '"' : '')
      + '><span class="shortcut-icon ' + tone + '"><img src="' + icon + '" alt=""></span><span>' + label + '</span></button>';
  }

  function matchCard(index) {
    return '<article class="match-card">'
      + '<div class="match-content">'
      + '<div class="match-head"><h4>周末黄金档双打局</h4><span class="status-open">报名中</span></div>'
      + '<p class="sub"><img src="assets/figma/elements/194-1049.png" alt="">飞跃之星俱乐部 · 由 王教练 发起</p>'
      + '<div class="info-block">'
      + '<p><img src="assets/figma/elements/194-997.png" alt=""><b>报名截止时间：</b>05月02日 17:30 （1天5小时28分截止）</p>'
      + '<p><img src="assets/figma/elements/194-996.png" alt=""><b>开场时间：</b>5月2日19:00 （时长1.5小时）</p>'
      + '</div>'
      + '<p class="address"><img src="assets/figma/elements/194-995.png" alt="">广东省深圳市南山区羽乐场1号馆3/4/5号场 <a>查看地址</a></p>'
      + '<div class="meta">'
      + '<span><em>总人数</em><strong>18/30</strong></span>'
      + '<span><em>可带人</em><strong>2人</strong></span>'
      + '<span><em>候补</em><strong>1/50</strong></span>'
      + '<span class="fee">预计费用：40-80元/人</span>'
      + '</div>'
      + '<p class="warn">球局限制: 中级以上；迟到10分钟视为弃权</p>'
      + '<div class="actions"><button class="ghost">查看详情</button><button class="solid">我要参与</button></div>'
      + '</div>'
      + '</article>';
  }

  function rankingShell(content, route) {
    return statusBar()
      + pageHeader('排位赛', true, 'home')
      + rankCard(16)
      + content
      + nav('ranking');
  }

  function renderRankingEmpty() {
    return rankingShell(
      '<section class="group-title"><h3>正在参与</h3></section>'
      + '<section class="card empty-state">'
      + '<img src="assets/figma/elements/194-1175.png" alt="暂无赛事">'
      + '<h4>暂无进行的排位赛</h4>'
      + '<p>你当前没有进行中的排位赛，点击参与可立即匹配</p>'
      + '<button class="solid big" data-route="ranking-matched">报名参加</button>'
      + '</section>'
      + '<button class="entry-card" data-route="ranking-history"><span>排位赛历史</span><img src="assets/figma/elements/194-1202.png" alt=""></button>'
      + rulesBlock(16),
      'ranking-empty'
    );
  }

  function renderRankingMatched() {
    return rankingShell(
      '<section class="group-title"><h3>正在进行的排位赛</h3></section>'
      + '<section class="progress-wrap">' + matchSteps({ active: 1 }) + '</section>'
      + '<section class="card match-detail">'
      + '<div class="detail-head"><h4>2v2 男双排位赛</h4><span class="badge orange">已匹配，待确认</span></div>'
      + detailRows([
        ['排位赛类型', '2V2  男双', 'teal'],
        ['开局时间', '2026-05-16（本周六） 14：00'],
        ['比赛时间', '1小时'],
        ['比赛赛制', '标准21分制 (三局两胜)'],
        ['裁判执裁', '(1位) 李裁判'],
        ['比赛场馆', '飞跃羽毛球馆', 'dark'],
        ['球场号', '3号场', 'dark']
      ])
      + '<div class="actions spread"><button class="warn">无法参赛</button><button class="solid" data-route="ranking-pending">我能参赛</button></div>'
      + '</section>'
      + '<button class="entry-card" data-route="ranking-history"><span>排位赛历史</span><img src="assets/figma/elements/194-1382.png" alt=""></button>'
      + rulesBlock(16),
      'ranking-matched'
    );
  }

  function renderRankingMatching() {
    return rankingShell(
      '<section class="group-title"><h3>正在进行的排位赛</h3></section>'
      + '<section class="progress-wrap">' + matchSteps({ active: 1, warn: 2 }) + '</section>'
      + '<section class="card match-detail">'
      + '<div class="detail-head"><h4>2v2 男双排位赛</h4><span class="badge orange">匹配中，请等待</span></div>'
      + '<div class="phase-list">'
      + '<div><strong>匹配阶段1</strong><p class="danger">未匹配到合适选手</p></div>'
      + '<div><strong>匹配阶段2</strong><p class="danger">未匹配到合适选手</p></div>'
      + '<div class="active"><strong>匹配阶段3</strong><p>正在匹配中……</p></div>'
      + '<div><strong>匹配审核阶段</strong></div>'
      + '</div>'
      + '</section>'
      + '<button class="entry-card" data-route="ranking-history"><span>排位赛历史</span><img src="assets/figma/elements/194-1382.png" alt=""></button>'
      + rulesBlock(16),
      'ranking-matching'
    );
  }

  function renderRankingPending() {
    return rankingShell(
      '<section class="group-title"><h3>正在进行的排位赛</h3></section>'
      + '<section class="progress-wrap">' + matchSteps({ active: 3 }) + '</section>'
      + '<section class="card match-detail">'
      + '<div class="detail-head"><h4>2v2 男双排位赛</h4><span class="badge green">已确认，待参赛（开赛前10分钟截止签到）</span></div>'
      + detailRows([
        ['排位赛类型', '2V2  男双', 'teal'],
        ['开局时间', '2026-05-16（本周六） 14：00'],
        ['比赛地点', '飞跃羽毛球馆3号馆', 'dark']
      ])
      + '<div class="actions spread"><button class="ghost">查看详情</button><button class="solid">点击查看场馆地址</button></div>'
      + '</section>'
      + '<button class="entry-card" data-route="ranking-history"><span>排位赛历史</span><img src="assets/figma/elements/194-1382.png" alt=""></button>'
      + rulesBlock(16),
      'ranking-pending'
    );
  }

  function renderRankingReview() {
    return rankingShell(
      '<section class="group-title"><h3>正在进行的排位赛</h3></section>'
      + '<section class="progress-wrap">' + matchSteps({ active: 3 }) + '</section>'
      + '<section class="card match-detail">'
      + '<div class="detail-head"><h4>2v2 男双排位赛</h4><span class="badge blue">参赛完成，待评价（请在24小时内完成）</span></div>'
      + detailRows([
        ['排位赛类型', '2V2  男双', 'teal'],
        ['开局时间', '2026-05-16（本周六） 14：00'],
        ['比赛地点', '飞跃羽毛球馆3号馆', 'dark']
      ])
      + '<p class="danger countdown">评价倒计时： 23:59:50</p>'
      + '<div class="actions right"><button class="solid">待评价</button></div>'
      + '</section>'
      + '<button class="entry-card" data-route="ranking-history"><span>排位赛历史</span><img src="assets/figma/elements/194-1382.png" alt=""></button>'
      + rulesBlock(16),
      'ranking-review'
    );
  }

  function detailRows(rows) {
    return '<div class="rows">' + rows.map(function (row) {
      return '<div class="row"><span>' + row[0] + '</span><b class="' + (row[2] || '') + '">' + row[1] + '</b></div>';
    }).join('') + '</div>';
  }

  function renderRankingHistory() {
    return statusBar()
      + pageHeader('排位赛历史', true, 'ranking-empty')
      + '<section class="history-note">仅展示已完成且有产生分数的历史记录</section>'
      + historyShortCard('2v2 男双排位赛', 16, 'win', '+15', '2026-04-24 15:00', '越秀星羽球馆 3 号场', '展开详细')
      + '<section class="card history-detail">'
      + '<div class="history-head"><h3>1v1 单打排位赛</h3><div class="history-score lose"><strong>-8</strong><span>失败</span></div></div>'
      + '<p>2026-04-24 15:00</p>'
      + '<p>越秀星羽球馆 3 号场</p>'
      + '<div class="history-action"><span>赛事对局比分</span><button>点击收起</button></div>'
      + '<div class="battle-board">'
      + '<div class="team"><strong class="red">A队<br>胜</strong><span>本人<i>男</i></span></div>'
      + '<div class="vs">VS</div>'
      + '<div class="team"><strong class="blue">B队<br>败</strong><span>李雷<i>男</i></span></div>'
      + '</div>'
      + '<div class="sets">'
      + '<div><strong class="red">21</strong><span>第一局</span><strong class="green">15</strong></div>'
      + '<div><strong class="red">18</strong><span>第二局</span><strong class="green">21</strong></div>'
      + '<div><strong class="red">21</strong><span>第三局</span><strong class="green">21</strong></div>'
      + '</div>'
      + '</section>'
      + nav('ranking');
  }

  function getRoute() {
    var hash = window.location.hash.replace(/^#\/?/, '');
    return PAGES[hash] ? hash : 'home';
  }

  function setRoute(route) {
    if (!PAGES[route]) route = 'home';
    if (getRoute() !== route) {
      window.location.hash = '#/' + route;
      return;
    }
    render(route);
  }

  function render(route) {
    var page = PAGES[route];
    app.innerHTML = '<section class="screen" style="min-height:' + page.height + 'px">' + page.render() + '</section>';
    document.title = '羽乐场 - ' + page.title;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  app.addEventListener('click', function (event) {
    var target = event.target;
    while (target && target !== app) {
      var route = target.getAttribute('data-route');
      if (route) {
        setRoute(route);
        return;
      }
      target = target.parentElement;
    }
  });

  window.addEventListener('hashchange', function () {
    render(getRoute());
  });

  render(getRoute());
})();
