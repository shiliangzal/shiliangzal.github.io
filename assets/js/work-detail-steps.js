/* ============================================================
   Work Detail Drawer – step-based (media left, text right)
   Each step pairs one media (image/video) with one text block.
   Click text on a work card → open drawer (animated).
   Mouse wheel switches steps in this card.
   ============================================================ */
(function () {
  'use strict';

  var drawer      = document.getElementById('workDetail');
  var mediaInner  = document.getElementById('wdMediaInner');
  var textHeader  = document.getElementById('wdTextHeader');
  var textBody    = document.getElementById('wdTextBody');
  var closeBtn    = document.getElementById('wdClose');
  var navPrev     = document.getElementById('wdNavPrev');
  var navNext     = document.getElementById('wdNavNext');
  var navCounter  = document.getElementById('wdNavCounter');
  var wdMedia     = document.getElementById('wdMedia');
  var wdText      = document.getElementById('wdText');

  if (!drawer || !mediaInner || !textBody) return;

  var steps       = [];   // [{ mediaHTML, textHTML }]
  var currentStep = 0;
  var animating   = false;

  /* ---- Per-step text content, keyed by work-card title ---- */
  var STEP_TEXT = {
    '航拍故事': [
      '<h4>航拍是怎么变成"写作的一部分"的</h4>'
      + '<p>5月27日那天其实没计划拍什么。带了一台无人机去郊外，本来只是想让脑子放空一下。升到 200 米的时候，风很稳，光线很正，整片河谷像一张铺开的地图——我下意识地按下了录制键。</p>'
      + '<p>那一刻我突然意识到：<strong>长文需要的"远观"视角，恰好就是航拍的高度</strong>。我们写一段话，不就是把一件事拉到 200 米、看清结构、再拉回来写细节吗？</p>'
      + '<blockquote>镜头是眼睛的延伸，长文是思维的延伸。两者都在做同一件事——<em>把当下这一刻，往后挪一点</em>。</blockquote>',

      '<h4>这次航拍里我最喜欢的一个镜头</h4>'
      + '<p>是河面最窄的那一段，水流几乎是直的，太阳从正侧面打过来，整条河像一条发光的丝带。我看了 30 秒没动，直到飞控提醒我电量低了才下来。</p>'
      + '<p>那 30 秒里我想清楚了一件事：写不下去的时候，不是因为没有想法，而是因为离得太近。升一升高度，看一看全貌，文字自己就会回来。</p>',

      '<h4>为什么还在坚持写长文</h4>'
      + '<p>短视频把一切切成 15 秒，但有些事 15 秒讲不清楚。比如：为什么一张照片的色温能决定它的情绪？为什么航拍 200 米看到的河流，和站在河边看到的完全不是同一条？</p>'
      + '<p>长文给我的最大的东西不是"阅读量"，而是<strong>把一件事想清楚的机会</strong>。写的过程中，你会发现自己原来没想清楚，然后被迫去想清楚。</p>'
      + '<blockquote>短视频给你答案，长文给你问题。</blockquote>',

      '<h4>下一步</h4>'
      + '<p>航拍和长文，我会继续同步做。镜头升到 200 米，文字沉到 2000 字——这是我找到的、最适合自己的节奏。</p>'
      + '<p><a class="wd-cta" href="#portfolio">📂 查看更多航拍作品</a></p>'
    ],
    '定格美好光 · 相机摄像集': [
      '<h4>清晨的大理古城</h4>'
      + '<p>06:30 之前，所有店铺还没开门，整个大理像被按了暂停。我一个人走在石板路上，脚声比鸟声大。这种安静不是"没有人"，而是"所有人都在慢慢醒"。</p>'
      + '<p>拍这张的时候，我蹲在古城门口的石阶上，等了 20 分钟。不是等光，是等一个没有人走进画面的瞬间。</p>',

      '<h4>玉龙雪山远眺</h4>'
      + '<p>从观景台看下去，云海比山峰还慢。我带了三脚架但最后没用——手端着相机等云移动，那种"快要到了"的紧张感，三脚架给不了。</p>'
      + '<blockquote>山不着急，你也不该着急。</blockquote>',

      '<h4>香格里拉草原的风</h4>'
      + '<p>草原的风不是吹过来的，是整片草"走"过来的。你看着远处的草浪一层一层过来，会忽然明白为什么有人愿意在这里住一辈子。</p>'
      + '<p>这张是用长曝光拍的，1/80s 故意不快，让草有一点动的模糊。A7M4 的防抖扛住了。</p>',

      '<h4>泸沽湖的日落</h4>'
      + '<p>颜色会变 5 次，每一次都以为已经是最后一层。从金黄到橙红到暗紫，整个过程大概 12 分钟。我拍了 47 张，这张是第 31 张。</p>'
      + '<p>泸沽湖的日落教会我一件事：<strong>别急着走</strong>。你以为看完了，其实才看了一半。</p>'
      + '<p><a class="wd-cta" href="#portfolio">📂 查看更多摄影集</a></p>'
    ],
    '光影碎片 · 相机摄影集': [
      '<h4>初夏的蔷薇</h4>'
      + '<p>小区楼下的蔷薇开到最盛的那天下午，我蹲在旁边看了五分钟。不是因为它"好看"——好看的东西很多——而是因为花瓣边缘那种从深粉到近乎透明的渐变，只有那个角度的光才能照亮。</p>'
      + '<p>相机镜头的优势就在这里：你有时间等。手动对焦、手动曝光、把光圈收到 1.8 去看每一瓣的虚实。</p>',

      '<h4>荷塘边的汉服</h4>'
      + '<p>在公园荷花池边偶遇两个穿汉服的女孩。一个撑着油纸伞，一个正低头看手机——传统和现代在同一个画面里，谁也没有抢谁的风头。</p>'
      + '<p>这张照片我拍了三次。第一次太远，第二次她们在看镜头笑（不自然），第三次她们完全没注意到我。第三张是唯一留下的。</p>',

      '<h4>禁止停车</h4>'
      + '<p>停车场入口的一个旧标志牌，红漆已经有点褪了，边角磕碰了好几处。但我喜欢的是它背后的虚化——绿色的出租车、白色的轿车、模糊的行道树，像一个被遗忘的城市切片。</p>'
      + '<p>50mm 的人像模式意外地把这个 mundane 的标志拍出了电影感。</p>',

      '<h4>凝固的水</h4>'
      + '<p>溪流边的一块岩石上，水从上方滴落，溅起一片水花。快门速度刚好把每一滴水珠都冻在了空中。</p>'
      + '<p>这种照片不需要好设备，需要的是耐心。我在那块石头旁边蹲了十几分钟，拍了大概 40 张，只有这一张水花的形态刚好是"炸开"的状态。</p>',

      '<h4>狗尾草 · 蓝</h4>'
      + '<p>秋天的狗尾草是我最爱的拍摄对象之一。它不高、不艳、不稀有，但它有一个特质：<strong>会随风动</strong>。</p>'
      + '<p>这张是在一个晴天的午后拍的，蓝天做背景，每一根草穗都有自己的方向。风一吹整片草地都在说话。</p>',

      '<h4>狗尾草 · 光</h4>'
      + '<p>同一片狗尾草，换了一个时间——傍晚前最后一小时。太阳从侧面打过来，每一根草穗都自带发光效果，毛茸茸的轮廓被光照亮了。</p>'
      + '<p>50mm 拍逆光的诀窍：不要对着太阳测光，对着暗一点的区域点一下屏幕，让整体曝光降下来，逆光部分自然就出轮廓光了。</p>',

      '<h4>白桦林下的野花</h4>'
      + '<p>白桦林的地面从来不是空的。野花、苔藓、落叶、不知名的细碎小花，它们挤在一起争夺每一缕漏下来的阳光。</p>'
      + '<p>这张的低角度几乎贴着地面拍的。相机的好处是手动对焦可以拧到非常近——你需要趴下去，镜头也需要贴近这个世界。</p>'
      + '<p><a class="wd-cta" href="#portfolio">📂 查看更多摄影集</a></p>'
    ],
    '尼康D3000，50mm': [
      '<h4>凌晨三点的咖啡</h4>'
      + '<p>2025 年下半年，我发现自己 60% 的时间花在了"重复性劳动"上——整理素材、写模板回复、把一段文字改成三种语气。这些事 AI 可以做，而且做得不差。</p>'
      + '<p>于是我花了一个月，把整个工作流拆开，一步一步换成 AI 辅助。这张照片拍的是某天凌晨三点，桌上只剩一盒三顿半和一堆没整理的素材。</p>',

      '<h4>拍摄设备也在进化</h4>'
      + '<p>搭工作流不只是软件的事。DJI Osmo Action 4 成了我日常记录的主力——vlog、教程截图、出差路上的随手拍。它小到可以挂在背包上，但又大到能出 4K 120fps。</p>'
      + '<p>设备选型原则：能带出去的才是好设备。再好的相机如果每次出门都觉得"算了不带"，那就是错的。</p>',

      '<h4>透明遥控器与航拍的日常</h4>'
      + '<p>DJI 的透明版航拍遥控器是我最近最爱的配件之一——不是因为它更好用，而是因为它的设计本身就在说"科技可以是有温度的"。</p>'
      + '<p>航拍现在是我写作流程的一部分：卡住的时候升上去看看全貌，文字自然就回来了。</p>',

      '<h4>核心工具链</h4>'
      + '<ul>'
      + '<li><strong>文字</strong> — 主力 Claude / 国产大模型，辅助校稿</li>'
      + '<li><strong>图片</strong> — Midjourney 出概念图，PS 精修关键帧</li>'
      + '<li><strong>视频</strong> — 剪映 + Runway，Pika 处理转场</li>'
      + '<li><strong>协作</strong> — Notion 做项目主干，WorkBuddy 做日常对话</li>'
      + '</ul>',

      '<h4>桌面上的紫色筋膜枪</h4>'
      + '<p>这是我的工位一角。紫色筋膜枪、散落的纸张、半瓶饮料、模糊的背景里还有充电线和数据线。</p>'
      + '<p>搭了这套 AI 工作流之后，我最大的感受不是"效率提升了"，而是<strong>"终于有精力照顾自己的身体了"</strong>。省下来的时间不是用来做更多工作，而是用来休息。</p>',

      '<h4>Hello Kitty 扑克牌</h4>'
      + '<p>桌面上这副 Hello Kitty 扑克是我的"切换开关"。工作太累的时候就抽一张，不看花色，只看心情。</p>'
      + '<blockquote>AI 工作流的终极目标不是让你变成机器，而是让你有更多时间做一个<strong>人</strong>。</blockquote>'
      + '<p><a class="wd-cta" href="#portfolio">📂 查看更多文章</a></p>'
    ],
    'DJI Pocket 3 深度体验报告': [
      '<h4>合作背景</h4>'
      + '<p>2026 年 1 月与 DJI 合作的深度测评。这台 Pocket 3 我用了整整一个月，从日常 vlog 到出差记录到滑雪自驾，全部场景覆盖了一遍。</p>'
      + '<p>最让我印象深刻的不是画质——画质本来就会好——而是"<strong>它一直在身上但从来不觉得是负担</strong>"。</p>',

      '<h4>核心结论</h4>'
      + '<ul>'
      + '<li><strong>真正解决的痛点</strong> — 1 英寸底 + 三轴云台，让"随手拍"和"能看的成片"之间的距离大幅缩短</li>'
      + '<li><strong>最让我惊喜的</strong> — 内置 D-Log M，后期调色空间非常够用</li>'
      + '<li><strong>建议改进</strong> — 续航在 4K 60p 下偏紧，期待下一代</li>'
      + '</ul>',

      '<h4>适合谁</h4>'
      + '<p>如果你是一个"想认真记录生活但不想背相机"的人，Pocket 3 是目前市面上<em>几乎没有对手</em>的选择。</p>'
      + '<p><a class="wd-cta" href="#contact">🤝 聊聊合作</a></p>'
    ],
    '5个提升工作效率的隐藏技巧': [
      '<h4>这 5 个技巧的来源</h4>'
      + '<p>不是网上抄来的，是我每天都在用的"肌肉记忆"。一次性讲清楚，希望你也能省下每天 1 小时。</p>',

      '<h4>正文预览</h4>'
      + '<ul>'
      + '<li><strong>技巧 1</strong> — 把"待办"分成"今天必须做"和"今天想做"</li>'
      + '<li><strong>技巧 2</strong> — 邮件每 2 小时处理一次，零碎时间不回</li>'
      + '<li><strong>技巧 3</strong> — 所有外部沟通统一走一个入口</li>'
      + '<li><strong>技巧 4</strong> — 用 AI 做"会议记录"而不是"会议纪要"</li>'
      + '<li><strong>技巧 5</strong> — 周五下午 4 点关电脑，给周末一个真边界</li>'
      + '</ul>'
      + '<blockquote>效率不是"做更多"，是"<em>拒绝做不该做的</em>"。</blockquote>'
      + '<p><a class="wd-cta" href="#portfolio">📂 查看更多作品</a></p>'
    ]
  };

  /* ---- Helpers ---- */
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c;
    });
  }

  /* ---- Build steps from a card DOM ----
     A "step" is one media + one text block. For gallery cards, each
     thumbnail becomes a step. For other cards, one step (cover + all text).
     Includes yunnan-video-cell (6-video grid) and photo-cover-* (Nikon grid). */
  function getCardSteps(card) {
    var title = (card.querySelector('.work-card-title') || {}).textContent || '';
    var texts = STEP_TEXT[title] || [];
    var result = [];

    // Try gallery thumbs in order of specificity
    var thumbs = card.querySelectorAll('.gallery-viewer .gallery-thumb');
    if (!thumbs.length) thumbs = card.querySelectorAll('.article-gallery .gallery-thumb');
    if (!thumbs.length) thumbs = card.querySelectorAll('.photo-cover-grid .gallery-thumb');
    if (!thumbs.length) thumbs = card.querySelectorAll('.yunnan-video-cell');

    if (thumbs.length) {
      thumbs.forEach(function (t, i) {
        var media = '';
        if (t.tagName === 'VIDEO') {
          // Yunnan video cell: t is the <video> itself, parent is .yunnan-video-cell
          var cell = t.closest('.yunnan-video-cell');
          var src = (cell && cell.getAttribute('data-video-src')) || t.src;
          var title = (cell && cell.getAttribute('data-video-title')) || '';
          media = '<video src="' + src + '" muted loop playsinline preload="auto"></video>';
          if (title) media += '<span class="wd-exif-chip">🎬 ' + escapeHTML(title) + '</span>';
        } else {
          media = '<img src="' + t.src + '" alt="' + escapeHTML(t.alt || '') + '" />';
          if (t.dataset.exif) {
            media += '<span class="wd-exif-chip">' + escapeHTML(t.dataset.exif) + '</span>';
          }
        }
        result.push({ media: media, text: texts[i] || '' });
      });
      if (texts.length > thumbs.length) {
        result[result.length - 1].text += texts.slice(thumbs.length).join('');
      }
    } else {
      // Non-gallery card: 1 step (cover media + all text)
      var media = '';
      var cover = card.querySelector('.video-cover');
      if (cover) {
        var src = cover.getAttribute('data-video-src') || '';
        if (src) media = '<video src="' + src + '" muted loop playsinline preload="auto"></video>';
      } else {
        var ph = card.querySelector('.img-placeholder img');
        if (ph) media = '<img src="' + ph.src + '" alt="' + escapeHTML(ph.alt || '') + '" />';
      }
      result.push({ media: media, text: texts.join('') });
    }

    if (!result.length) result.push({ media: '', text: '' });
    return result;
  }

  /* ---- Render steps into drawer DOM ---- */
  function buildDrawer(card) {
    steps = getCardSteps(card);
    currentStep = 0;

    var catEl   = card.querySelector('.work-card-category');
    var titleEl = card.querySelector('.work-card-title');
    var metas   = [];
    (card.querySelectorAll('.work-card-meta span') || []).forEach(function (s) { metas.push(s.textContent); });

    var cat   = catEl   ? catEl.textContent   : '';
    var title = titleEl ? titleEl.textContent : '';

    var headerHTML = '';
    if (cat)   headerHTML += '<span class="wd-category">' + escapeHTML(cat) + '</span>';
    if (title) headerHTML += '<h2 class="wd-title">' + escapeHTML(title) + '</h2>';
    if (metas.length) {
      headerHTML += '<ul class="wd-meta">';
      metas.forEach(function (m) { headerHTML += '<li>' + escapeHTML(m) + '</li>'; });
      headerHTML += '</ul>';
    }
    textHeader.innerHTML = headerHTML;

    /* Media items (stacked, animated) */
    mediaInner.innerHTML = '';
    steps.forEach(function (s, i) {
      var div = document.createElement('div');
      div.className = 'wd-media-item' + (i === 0 ? ' current' : '');
      div.innerHTML = s.media;
      mediaInner.appendChild(div);
    });

    /* Step text bodies (absolutely stacked, animated) */
    textBody.innerHTML = '';
    steps.forEach(function (s, i) {
      var el = document.createElement('div');
      el.className = 'wd-step-text' + (i === 0 ? ' current' : '');
      var body = document.createElement('div');
      body.className = 'wd-step-body';
      body.innerHTML = s.text;
      el.appendChild(body);
      textBody.appendChild(el);
    });

    updateNav();
  }

  function updateNav() {
    navPrev.classList.toggle('disabled', currentStep <= 0);
    navNext.classList.toggle('disabled', currentStep >= steps.length - 1);
    navCounter.textContent = (currentStep + 1) + ' / ' + steps.length;
  }

  function goToStep(idx) {
    if (animating || idx < 0 || idx >= steps.length || idx === currentStep) return;
    animating = true;

    var mediaItems = mediaInner.querySelectorAll('.wd-media-item');
    var textItems  = textBody.querySelectorAll('.wd-step-text');

    mediaItems.forEach(function (item, i) {
      item.classList.remove('current', 'prev', 'next');
      if (i === idx)      item.classList.add('current');
      else if (i < idx)   item.classList.add('prev');
      else                item.classList.add('next');
    });

    textItems.forEach(function (item, i) {
      item.classList.remove('current', 'prev', 'next');
      if (i === idx) {
        void item.offsetWidth;  // reflow
        item.classList.add('current');
      } else if (i < idx) {
        item.classList.add('prev');
      } else {
        item.classList.add('next');
      }
    });

    currentStep = idx;
    updateNav();

    var vid = mediaInner.querySelector('.wd-media-item.current video');
    if (vid) { try { vid.play().catch(function () {}); } catch (e) {} }

    setTimeout(function () { animating = false; }, 500);
  }

  function openDrawer(card) {
    buildDrawer(card);
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var vid = mediaInner.querySelector('.wd-media-item.current video');
    if (vid) { try { vid.play().catch(function () {}); } catch (e) {} }
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    mediaInner.querySelectorAll('video').forEach(function (v) {
      try { v.pause(); v.currentTime = 0; } catch (e) {}
    });
  }

  /* ---- Event wiring ---- */
  navPrev.addEventListener('click', function () { goToStep(currentStep - 1); });
  navNext.addEventListener('click', function () { goToStep(currentStep + 1); });

  /* ---- Mouse wheel switches steps (deltaY > 0 → next, < 0 → prev) ---- */
  var wheelLock = false;
  drawer.addEventListener('wheel', function (e) {
    if (!drawer.classList.contains('active')) return;
    if (animating || wheelLock) return;
    if (Math.abs(e.deltaY) < 10) return;  // ignore small trackpad noise
    wheelLock = true;
    if (e.deltaY > 0) {
      goToStep(currentStep + 1);
    } else {
      goToStep(currentStep - 1);
    }
    setTimeout(function () { wheelLock = false; }, 600);
  }, { passive: true });

  /* ---- Click anywhere on .work-card-body to open drawer ----
     Fix: any click on the card body (including category/meta/title/excerpt)
     should open. Use both click and pointerdown for reliability.
     EXCEPT: "定格美好光 · 相机摄像集" 取消点击抽屉（仅保留封面点击灯箱） */
  document.querySelectorAll('.work-card').forEach(function (card) {
    var body = card.querySelector('.work-card-body');
    if (!body) return;
    var titleEl = card.querySelector('.work-card-title');
    var title = titleEl ? titleEl.textContent.trim() : '';
    if (title === '定格美好光 · 相机摄像集') {
      body.style.cursor = 'default';
      return;  // skip binding for this card
    }
    body.style.cursor = 'pointer';
    var open = function (e) {
      // Don't open if user clicked a link, button, or work-card-image
      if (e.target.closest('a, button')) return;
      if (e.target.closest('.work-card-image')) return;  // image area is for lightbox
      e.preventDefault();
      e.stopPropagation();
      openDrawer(card);
    };
    body.addEventListener('click', open);
  });

  drawer.addEventListener('click', function (e) {
    if (e.target === drawer) closeDrawer();
  });
  closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (!drawer.classList.contains('active')) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'ArrowUp'   && currentStep > 0)                  goToStep(currentStep - 1);
    if (e.key === 'ArrowDown' && currentStep < steps.length - 1)  goToStep(currentStep + 1);
  });
})();
