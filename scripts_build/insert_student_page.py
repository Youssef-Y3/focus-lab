with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

student_section_html = '''
      <section class="page" id="page-student">
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
      </section>
'''

# We want to insert this right after </section> of page-overview
pos = html.find('</section>') # first </section> is page-overview
if pos != -1 and 'id="page-student"' not in html:
    html = html[:pos+10] + "\n" + student_section_html + "\n" + html[pos+10:]
    with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully inserted student_section_html into index.html!")
else:
    print("Already inserted or </section> not found")
