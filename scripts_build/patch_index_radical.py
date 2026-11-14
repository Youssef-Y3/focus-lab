import re

index_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace <header class="topbar"> ... </header>
topbar_replacement = '''
<header class="studio-topbar" id="studioTopbar">
  <div class="topbar-inner">
    <div class="brand-lockup-top" data-go="overview" style="cursor:pointer;" title="العودة للرئيسية">
      <div class="brand-mark-glow"><span>F</span><i>×</i><span>T</span></div>
      <div>
        <div class="brand-name-top">FOCUS LAB <b>×</b> TAFRA</div>
        <div class="brand-sub-top">THE OPERATING SPACE // 2026</div>
      </div>
    </div>

    <nav class="studio-nav-pills" id="studioNavPills">
      <button class="nav-item active" data-page="overview"><span class="nav-icon">⌂</span><span>الرئيسية</span></button>
      <button class="nav-item student-pill-highlight" data-page="student"><span class="nav-icon">🎓</span><span>بوابة الشباب</span><span class="pill-spark">★</span></button>
      <button class="nav-item" data-page="learn"><span class="nav-icon">◈</span><span>المكتبة</span></button>
      <button class="nav-item" data-page="tools"><span class="nav-icon">✳</span><span>الأدوات</span></button>
      <button class="nav-item" data-page="journey"><span class="nav-icon">↗</span><span>رحلة 28</span></button>
      <button class="nav-item" data-page="tafra"><span class="nav-icon">✦</span><span>المحتوى</span></button>
      <button class="nav-item" data-page="mastery"><span class="nav-icon">▦</span><span>الماستري</span></button>
      <button class="nav-item" data-page="research"><span class="nav-icon">⌕</span><span>البحث</span></button>
      <button class="nav-item" data-page="archive"><span class="nav-icon">▤</span><span>الأرشيف</span></button>
      <button class="nav-item" data-page="settings"><span class="nav-icon">⚙</span><span>الإعدادات</span></button>
    </nav>

    <div class="topbar-actions-cluster">
      <button class="audio-ctrl-btn" id="headerAudioBtn" title="أصوات التركيز والمذاكرة">
        <span class="dock-soundwave"><i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"></i></span>
        <span id="audioTrackName">الصوت الحي</span>
      </button>
      <button class="sos-header-btn" id="headerSosBtn" title="طوارئ التسويف">
        <span>🚨</span>
        <span>طوارئ التسويف</span>
      </button>
      <div class="student-streak-badge" id="headerStreakBadge">🔥 <span id="headerStreakCount">3</span> أيام</div>
      <label class="global-search-pill">
        <span>⌕</span>
        <input id="globalSearch" placeholder="بحث شامل..." type="search"/>
        <kbd>⌘K</kbd>
      </label>
      <button class="theme-toggle-btn" id="themeToggleBtn" title="تبديل المظهر">🌓</button>
      <button class="mobile-menu-btn" id="mobileMenuBtn" title="القائمة الجانبية">☰</button>
    </div>
  </div>
</header>
'''

# Find header.topbar
tb_start = html.find('<header class="topbar">')
tb_end = html.find('</header>') + len('</header>')
if tb_start != -1:
    html = html[:tb_start] + topbar_replacement + html[tb_end:]
    print("Replaced topbar successfully!")
else:
    print("header.topbar not found, checking if already studio-topbar...")

# 2. Replace <div class="hero-panel"> ... </div> with studio-hero-section + bento-showcase-grid
hero_bento_replacement = '''
<div class="studio-hero-section spotlight-card">
  <div class="hero-aurora-glow"></div>
  
  <div class="hero-content">
    <div class="hero-telemetry-badge">
      <span class="pulse-beacon"></span>
      <span class="mono-code">SYS.OS // 2026.STUDIO</span>
      <span class="badge-pipe">|</span>
      <span class="highlight-text">FOCUS LAB × TAFRA</span>
      <span class="badge-tag">OFFLINE READY</span>
    </div>

    <h1 class="hero-display-headline">
      من المعرفة إلى الفعل.<br/>
      <span class="solar-gradient-heading">ومن الفعل إلى الإتقان المطلق.</span>
    </h1>

    <p class="hero-editorial-lead">
      المساحة التشغيلية الموحدة لشباب وصُنّاع المستقبل — تجمع بين أسرار التركيز البيولوجي، ومختبر الـ 26 أداة تنفيذية، وخارطة الـ 28 يوماً، ومحرك صناعة المحتوى والأثر الرقمي — مصممة لتعمل محلياً بالكامل وبأعلى معايير التصميم العالمية.
    </p>

    <div class="hero-cta-cluster">
      <button class="btn btn-hero-gold" data-go="student">
        <span class="btn-icon">🎓</span>
        <span>ادخل بوابة شباب الجامعة (Study Room)</span>
        <span class="btn-arrow">←</span>
      </button>
      <button class="btn btn-hero-cyan" id="heroScrollWorkflowBtn">
        <span class="btn-icon">⚡</span>
        <span>محرك سير العمل الذكي</span>
      </button>
      <button class="btn btn-hero-ghost" data-go="tools">
        <span class="btn-icon">✳</span>
        <span>مختبر الـ 26 أداة</span>
      </button>
    </div>

    <div class="hero-stats-ticker">
      <div class="stat-pill"><span class="pill-num">4,175</span><span class="pill-lbl">أصل معرفي ومحتوى</span></div>
      <span class="stat-bullet">·</span>
      <div class="stat-pill"><span class="pill-num">26</span><span class="pill-lbl">بروتوكولاً تنفيذياً</span></div>
      <span class="stat-bullet">·</span>
      <div class="stat-pill"><span class="pill-num">28</span><span class="pill-lbl">يوماً لبناء العادات</span></div>
      <span class="stat-bullet">·</span>
      <div class="stat-pill"><span class="pill-num">40Hz</span><span class="pill-lbl">موجات جاما للتركيز</span></div>
      <span class="stat-bullet">·</span>
      <div class="stat-pill status-live"><span>● يعمل محلياً 100%</span></div>
    </div>
  </div>
</div>

<!-- Bento Live Showcase (Showreel & MyStack Inspired) -->
<div class="bento-showcase-grid">
  <!-- Card 1: 40Hz Live Audio Synthesizer -->
  <div class="bento-showcase-card spotlight-card audio-bento">
    <div class="bento-card-header">
      <div class="bento-tag">[ 40Hz ACOUSTIC LAB ]</div>
      <span class="pulse-beacon"></span>
    </div>
    <div class="bento-card-body">
      <h3>موجات جاما وعزل المشتتات</h3>
      <p>توليد ترددات بيولوجية 40Hz ومؤثرات صوتية مطرية لتهدئة القشرة الدماغية وزيادة استيعاب المعلومات.</p>
      <div class="bento-audio-bars" id="bentoAudioBars">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
    <div class="bento-card-footer">
      <button class="btn-bento-action" id="bentoAudioToggleBtn">
        <span>🎧 تشغيل الصوت الحي</span>
      </button>
      <span class="bento-meta-txt">100% توليد لحظي WebAudio</span>
    </div>
  </div>

  <!-- Card 2: SOS Procrastination Breaker -->
  <div class="bento-showcase-card spotlight-card sos-bento">
    <div class="bento-card-header">
      <div class="bento-tag">[ 120s SOS RESCUE ]</div>
      <span style="font-size:16px;">🚨</span>
    </div>
    <div class="bento-card-body">
      <h3>طوارئ كسر التسويف</h3>
      <p>بروتوكول الطوارئ السريع لفك الشلل الذهني والبدء في المذاكرة أو العمل خلال دقيقتين فقط.</p>
      <div class="bento-sos-meter">
        <div class="meter-bar" style="width: 85%;"></div>
        <span class="meter-lbl">معدل استعادة التركيز: 85% خلال 120 ثانية</span>
      </div>
    </div>
    <div class="bento-card-footer">
      <button class="btn-bento-action sos-btn" id="bentoSosLaunchBtn">
        <span>⚡ تفعيل بروتوكول الإنقاذ</span>
      </button>
      <span class="bento-meta-txt">4 خطوات حاسمة</span>
    </div>
  </div>

  <!-- Card 3: Active Recall 3D Hologram -->
  <div class="bento-showcase-card spotlight-card recall-bento">
    <div class="bento-card-header">
      <div class="bento-tag">[ ACTIVE RECALL 3D ]</div>
      <span style="font-size:16px;">🧠</span>
    </div>
    <div class="bento-card-body">
      <h3>بطاقات الاسترجاع الذكي 3D</h3>
      <p>تثبيت المفاهيم بالقوة العصبية عبر تقنية الاسترجاع الذاتي بدلاً من وهم القراءة السلبية.</p>
      <div class="bento-mini-card" id="bentoMiniCard" onclick="this.classList.toggle('flipped'); if(window.FocusAudio) window.FocusAudio.playClick();">
        <div class="mini-front">
          <span>سؤال: ما الفرق بين التركيز السطحي والعميق؟</span>
          <small>اضغط لقلب البطاقة ↻</small>
        </div>
        <div class="mini-back">
          <span>السطحي: مهام مشتتة. العميق: عمل معرفي مكثف يرفع القيمة.</span>
          <small>✓ استرجاع نشط</small>
        </div>
      </div>
    </div>
    <div class="bento-card-footer">
      <button class="btn-bento-action" data-go="student">
        <span>تدريب البطاقات الكامل</span>
      </button>
      <span class="bento-meta-txt">+50 XP لكل جولة</span>
    </div>
  </div>

  <!-- Card 4: Habit Architecture & Streak -->
  <div class="bento-showcase-card spotlight-card journey-bento">
    <div class="bento-card-header">
      <div class="bento-tag">[ 28-DAY ARCHITECTURE ]</div>
      <span style="font-size:16px;">🔥</span>
    </div>
    <div class="bento-card-body">
      <h3>بناء نظام التركيز المستمر</h3>
      <p>خارطة يومية تدرجية تنقلك من التشتت إلى الانضباط الصارم خطوة بخطوة على مدار 4 أسابيع.</p>
      <div class="bento-week-pills">
        <span class="week-pill done">الأسبوع 1: التطهير ✓</span>
        <span class="week-pill current">الأسبوع 2: البناء ●</span>
        <span class="week-pill">الأسبوع 3: التكثيف</span>
        <span class="week-pill">الأسبوع 4: الماستري</span>
      </div>
    </div>
    <div class="bento-card-footer">
      <button class="btn-bento-action" data-go="journey">
        <span>متابعة الرحلة اليومية ↗</span>
      </button>
      <span class="bento-meta-txt">اليوم النشط: 03 / 28</span>
    </div>
  </div>
</div>
'''

hp_start = html.find('<div class="hero-panel">')
if hp_start != -1:
    # Find closing of hero-panel
    # It contains visual-caption
    vc = 'ONE SYSTEM · MULTIPLE PATHS</div>\n</div>'
    hp_end = html.find(vc, hp_start)
    if hp_end != -1:
        hp_end += len(vc)
        # Check if there is an extra </div>
        next_chunk = html[hp_end:hp_end+100]
        if next_chunk.strip().startswith('</div>'):
            hp_end = html.find('</div>', hp_end) + len('</div>')
        html = html[:hp_start] + hero_bento_replacement + html[hp_end:]
        print("Replaced hero-panel with studio-hero-section & bento-showcase-grid successfully!")
    else:
        print("Error finding hero-panel end marker")
else:
    print("hero-panel not found, checking if already replaced...")

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html fully updated!")
