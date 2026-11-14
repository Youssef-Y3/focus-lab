import bs4, os

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = bs4.BeautifulSoup(html, 'html.parser')

# 1. Add modern.css to head
head = soup.find('head')
if not head.find('link', href='assets/modern.css'):
    new_link = soup.new_tag('link', rel='stylesheet', href='assets/modern.css')
    head.append(new_link)

# 2. Add Student Hub to nav
nav = soup.find('nav', class_='primary-nav')
if not nav.find('button', attrs={'data-page': 'student'}):
    student_btn = soup.new_tag('button', attrs={'class': 'nav-item', 'data-page': 'student'})
    icon_span = soup.new_tag('span', attrs={'class': 'nav-icon'})
    icon_span.string = '🎓'
    text_span = soup.new_tag('span')
    text_span.string = 'بوابة شباب الجامعة'
    kbd = soup.new_tag('kbd')
    kbd.string = '★'
    student_btn.append(icon_span)
    student_btn.append(text_span)
    student_btn.append(kbd)
    
    # insert right after overview button
    overview_btn = nav.find('button', attrs={'data-page': 'overview'})
    if overview_btn:
        overview_btn.insert_after(student_btn)
    else:
        nav.insert(0, student_btn)

# 3. Add top-actions (Audio, SOS, Theme toggle, Streak badge)
top_actions = soup.find('div', class_='top-actions')
if top_actions and not top_actions.find('button', id='headerSosBtn'):
    # Audio button
    audio_btn = soup.new_tag('button', attrs={'class': 'audio-ctrl-btn', 'id': 'headerAudioBtn', 'title': 'أصوات التركيز والمذاكرة'})
    audio_btn.append(bs4.BeautifulSoup('<span>🎧</span><span id="audioTrackName">أصوات التركيز</span>', 'html.parser'))
    top_actions.insert(0, audio_btn)
    
    # SOS button
    sos_btn = soup.new_tag('button', attrs={'class': 'sos-header-btn', 'id': 'headerSosBtn', 'title': 'طوارئ التسويف'})
    sos_btn.append(bs4.BeautifulSoup('<span>🚨</span><span>طوارئ التسويف</span>', 'html.parser'))
    top_actions.insert(1, sos_btn)
    
    # Streak badge
    streak_badge = soup.new_tag('div', attrs={'class': 'student-streak-badge', 'id': 'headerStreakBadge'})
    streak_badge.append(bs4.BeautifulSoup('🔥 <span id="headerStreakCount">3</span> أيام', 'html.parser'))
    top_actions.insert(2, streak_badge)
    
    # Theme toggle
    theme_btn = soup.new_tag('button', attrs={'class': 'theme-toggle-btn', 'id': 'themeToggleBtn', 'title': 'تبديل المظهر'})
    theme_btn.string = '🌓'
    top_actions.insert(3, theme_btn)

# 4. Add page-student section
main = soup.find('main', id='mainScroll')
if main and not soup.find('section', id='page-student'):
    student_section = soup.new_tag('section', attrs={'class': 'page', 'id': 'page-student'})
    student_html = '''
    <div class="student-hero-banner">
      <div class="student-level-card">
        <div class="student-avatar-box">
          <div class="student-avatar" id="studentAvatar">🦁</div>
          <div class="student-title-box">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="panel-kicker" style="color:var(--amber); margin-bottom:0;">STUDENT MASTERY HUB</span>
              <span class="badge" style="background:rgba(245, 158, 11, 0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4);" id="studentLevelTag">المستوى 3</span>
            </div>
            <h2 id="studentTitle">وحش المذاكرة والعمل العميق</h2>
            <p>أنت تبني انضباطك الأكاديمي والمهني خطوة بخطوة بعيداً عن وهم التشتت والدوبامين الرخيص.</p>
          </div>
        </div>
        <div class="xp-progress-container">
          <div class="xp-label-row">
            <span>نقاط الخبرة (XP)</span>
            <span id="xpCountLabel">180 / 300 XP</span>
          </div>
          <div class="xp-progress-bar">
            <div class="xp-progress-fill" id="xpProgressFill" style="width: 60%;"></div>
          </div>
        </div>
      </div>
      
      <div class="student-stats-grid">
        <div class="student-stat-item">
          <b id="statStreak">3 🔥</b>
          <span>أيام التزام متواصل</span>
        </div>
        <div class="student-stat-item">
          <b id="statStudyMin">90 ⏱️</b>
          <span>دقيقة مذاكرة مركزة</span>
        </div>
        <div class="student-stat-item">
          <b id="statSprints">4 🎯</b>
          <span>جلسات بومودورو مكتملة</span>
        </div>
        <div class="student-stat-item">
          <b id="statCourses">2 📚</b>
          <span>مقررات قيد الدراسة</span>
        </div>
        <div class="student-stat-item">
          <b id="statSos">2 🛡️</b>
          <span>مرات التغلب على التسويف</span>
        </div>
      </div>
    </div>

    <!-- Student Sub-Tabs -->
    <div class="student-subtabs" id="studentSubtabs">
      <button class="student-tab-btn active" data-stab="study"><span>⏱️</span><span>غرفة المذاكرة والأصوات</span></button>
      <button class="student-tab-btn" data-stab="sos"><span>🚨</span><span>طوارئ التسويف الفورية</span></button>
      <button class="student-tab-btn" data-stab="syllabus"><span>📅</span><span>مقسم المناهج والامتحانات</span></button>
      <button class="student-tab-btn" data-stab="flashcards"><span>🗂️</span><span>بطاقات الاسترجاع النشط</span></button>
      <button class="student-tab-btn" data-stab="doctor"><span>🩺</span><span>طبيب التركيز الجامعي</span></button>
      <button class="student-tab-btn" data-stab="career"><span>🚀</span><span>بناء مهارات وسوق العمل</span></button>
    </div>

    <!-- Sub-tab content containers -->
    <div id="studentTabContent"></div>
    '''
    student_section.append(bs4.BeautifulSoup(student_html, 'html.parser'))
    
    # insert right after page-overview
    overview_page = soup.find('section', id='page-overview')
    if overview_page:
        overview_page.insert_after(student_section)
    else:
        main.insert(0, student_section)

# 5. Add mobile bottom nav
app_shell = soup.find('div', class_='app-shell')
if app_shell and not soup.find('div', class_='mobile-bottom-nav'):
    mobile_nav = soup.new_tag('div', attrs={'class': 'mobile-bottom-nav'})
    mobile_nav.append(bs4.BeautifulSoup('''
      <button class="mobile-nav-pill active" data-page="overview"><span>⌂</span><span>الرئيسية</span></button>
      <button class="mobile-nav-pill" data-page="student"><span>🎓</span><span>الجامعة</span></button>
      <button class="mobile-nav-pill" data-page="tools"><span>✳</span><span>الأدوات</span></button>
      <button class="mobile-nav-pill" data-page="journey"><span>↗</span><span>الرحلة</span></button>
      <button class="mobile-nav-pill" data-page="tafra"><span>✦</span><span>المحتوى</span></button>
    ''', 'html.parser'))
    app_shell.append(mobile_nav)

# 6. Add modals (Confetti canvas, Teleprompter, Zen mode, SOS modal, Course modal, Flashcard modal)
body = soup.find('body')
if not soup.find('canvas', id='confettiCanvas'):
    confetti_canvas = soup.new_tag('canvas', id='confettiCanvas')
    body.append(confetti_canvas)

if not soup.find('div', id='teleprompterModal'):
    prompter_html = '''
    <div class="teleprompter-overlay" id="teleprompterModal">
      <div class="prompter-header">
        <div>
          <span class="badge" style="background:#0284c7; color:#fff;">TELEPROMPTER</span>
          <h3 id="prompterTitle" style="display:inline; margin-right:10px; color:#fff;">ملقن الكاميرا لصناعة المحتوى</h3>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn btn-secondary" id="prompterMirrorBtn">🪞 قلب الشاشة (سيلفي)</button>
          <label style="color:#fff; font-size:12px;">السرعة: <input type="range" id="prompterSpeed" min="1" max="8" value="3"></label>
          <label style="color:#fff; font-size:12px;">حجم الخط: <input type="range" id="prompterFontSize" min="20" max="60" value="34"></label>
          <button class="btn btn-primary" id="prompterPlayBtn">▶️ تشغيل</button>
          <button class="btn btn-danger" id="prompterCloseBtn">✕ إغلاق</button>
        </div>
      </div>
      <div class="prompter-body" id="prompterBody">
        <div class="prompter-text" id="prompterText"></div>
      </div>
    </div>
    '''
    body.append(bs4.BeautifulSoup(prompter_html, 'html.parser'))

if not soup.find('div', id='zenModal'):
    zen_html = '''
    <div class="zen-overlay" id="zenModal">
      <div style="padding:20px; display:flex; justify-content:space-between; align-items:center;">
        <span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid #10b981;">ZEN STUDY MODE</span>
        <button class="btn btn-secondary" id="closeZenBtn">خروج من وضع الزن (ESC)</button>
      </div>
      <div class="zen-timer-wrap">
        <div class="zen-digits" id="zenDigits">25:00</div>
        <div class="zen-task-title" id="zenTaskTitle">المهمة الحالية قيد الإنجاز</div>
        <div style="margin-top:25px; display:flex; gap:12px;">
          <button class="btn-timer-primary" id="zenToggleBtn">▶️ تشغيل</button>
          <button class="btn-timer-secondary" id="zenResetBtn">🔄 إعادة ضبط</button>
        </div>
      </div>
    </div>
    '''
    body.append(bs4.BeautifulSoup(zen_html, 'html.parser'))

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("index.html patched successfully!")
