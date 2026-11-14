import os

js_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js'
with open(js_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Let's check where to hook our Workflow Engine and Floating Dock logic
workflow_engine_code = '''
  // =========================================================================
  // 9. THE INTERACTIVE WORKFLOW OPERATING SYSTEM & SOL DOCK (2026 EDITION)
  // Inspired by: ContraLabs, Showreel.design, HelloSol.app, Freckle & Lee Holmes
  // =========================================================================

  const WORKFLOW_DATA = {
    student: [
      {
        id: "diag",
        num: "01",
        title: "التشخيص وفك الشلل الذهني",
        subtitle: "طبيب التركيز وطوارئ التسويف",
        badge: "PROTOCOL // DIAGNOSE",
        duration: "60 ثانية — 5 دقائق",
        philosophy: "«أعظم علاج للتسويف ليس التحفيز العاطفي، بل تصغير الخطوة الأولى حتى يستحيل على عقلك مقاومتها.»",
        bullets: [
          "تشخيص نمط التشتت بدقة (إرهاق، تردد، خوف، فوضى)",
          "تفعيل بروتوكول الـ 120 ثانية لتجاوز العتبة الصفرية",
          "تحديد مهمة صغرى وحيدة للبدء فيها فوراً"
        ],
        btnLabel: "انطلق إلى معالج طوارئ التسويف (SOS) ⚡",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("student");
          const s = getStudentState();
          s.activeSubTab = "sos";
          s.activeSosStep = 1;
          saveStudentState(s);
          renderStudentHub();
        }
      },
      {
        id: "deep",
        num: "02",
        title: "الغوص في العمل العميق",
        subtitle: "بومودورو + عزل صوتي 40Hz",
        badge: "ALPHA FLOW // 40Hz GAMMA",
        duration: "25 دقيقة (أو 50 دقيقة)",
        philosophy: "«التركيز العميق حالة بيولوجية تتطلب 15 دقيقة للدخول إليها وثانية واحدة لتدميرها.. اعزل نفسك تماماً.»",
        bullets: [
          "توليد موجات جاما 40Hz لعزل المشتتات المحيطة",
          "تفعيل مؤقت البومودورو المظلم دون أي تنبيهات خارجية",
          "تطبيق دائرة التنفس الصامت لخفض مستويات التوتر"
        ],
        btnLabel: "ادخل غرفة العمل العميق وشغّل 40Hz 🎧",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("student");
          const s = getStudentState();
          s.activeSubTab = "study";
          saveStudentState(s);
          renderStudentHub();
          if (window.FocusAudio) window.FocusAudio.play40HzTone();
        }
      },
      {
        id: "recall",
        num: "03",
        title: "التثبيت بالاسترجاع النشط 3D",
        subtitle: "Active Recall & Spaced Repetition",
        badge: "COGNITIVE EMBEDDING",
        duration: "10 دقائق",
        philosophy: "«القراءة المتكررة وهم بالفهم.. الاسترجاع الذاتي الصعب هو الطريقة الوحيدة لبناء مسارات عصبية دائمة.»",
        bullets: [
          "تقليب بطاقات الاسترجاع النشط ثلاثية الأبعاد",
          "اختبار الذاكرة واستدعاء المفاهيم قبل مراجعة الحل",
          "تطبيق تقنية فاينمان لشرح المبدأ بكلماتك الخاصة"
        ],
        btnLabel: "ابدأ تدريب البطاقات التفاعلية 3D 🧠",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("student");
          const s = getStudentState();
          s.activeSubTab = "flashcards";
          saveStudentState(s);
          renderStudentHub();
        }
      },
      {
        id: "output",
        num: "04",
        title: "الإخراج والإنتاج المهني",
        subtitle: "الملخصات الذكية والمخرجات المهنية",
        badge: "REAL-WORLD OUTPUT",
        duration: "15 دقيقة",
        philosophy: "«المعلومة التي لا تتحول إلى منتج، نص مكتوب، أو مهارة قابلة للتطبيق تتبخر في غضون 48 ساعة.»",
        bullets: [
          "تحويل الملاحظات إلى مسودة تسليم أو مشروع حقيقي",
          "استخدام التلقين الذكي (Teleprompter) للشرح والعرض",
          "تسجيل نقاط الخبرة XP والارتقاء في رتبة التركيز"
        ],
        btnLabel: "افتح مسار الإخراج والنمو المهني 🚀",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("student");
          const s = getStudentState();
          s.activeSubTab = "career";
          saveStudentState(s);
          renderStudentHub();
        }
      }
    ],
    creator: [
      {
        id: "learn",
        num: "01",
        title: "الفهم والبحث الرصين",
        subtitle: "مكتبة FOCUS LEARN والموسوعة",
        badge: "DEEP FOUNDATION",
        duration: "30 دقيقة",
        philosophy: "«لا تصنع محتوى أو تبنِ مشروعاً على أرض هشة.. اسند كل فكرة إلى أصل معرفي موثق.»",
        bullets: [
          "استكشاف ملخصات الكتب الـ 8 الأساسية ونماذج التفكير",
          "استخراج النماذج العقلية للإنتاجية والماستري",
          "توثيق الملاحظات المنضبطة في مساحة البحث"
        ],
        btnLabel: "تصفح مكتبة FOCUS LEARN 📚",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("learn");
        }
      },
      {
        id: "tools",
        num: "02",
        title: "الأدوات العملية الـ 26",
        subtitle: "تحويل الفهم إلى بروتوكولات تنفيذ",
        badge: "26 TACTICAL TOOLS",
        duration: "15 دقيقة",
        philosophy: "«المبادئ بدون أدوات مجرد نوايا حسنة.. الأدوات هي التي تصنع فارق النتيجة على أرض الواقع.»",
        bullets: [
          "تطبيق أداة قاعدة الدقائق الـ 5 أو مصفوفة التشتت",
          "تفعيل لوحة تحديد الأولويات الحاسمة",
          "نسخ نماذج العمل القابلة للتطبيق الفوري"
        ],
        btnLabel: "افتح مختبر الأدوات (FOCUS TOOLS) ✳",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("tools");
        }
      },
      {
        id: "journey",
        num: "03",
        title: "رحلة العادات الـ 28 يوماً",
        subtitle: "بناء وتثبيت نظام التركيز المستمر",
        badge: "28-DAY ARCHITECTURE",
        duration: "يومياً",
        philosophy: "«النجاح ليس قفزة واحدة عملاقة؛ بل تكرار يومي متقن ومستمر لخطوة صغيرة ذكية.»",
        bullets: [
          "متابعة تقدم اليوم الحالي في خارطة الـ 28 يوماً",
          "توثيق انتصار اليوم وتثبيت العادة العصبية",
          "مراجعة شريط الأسابيع ورفع نسبة الالتزام"
        ],
        btnLabel: "سجّل تقدمك في رحلة الـ 28 يوماً ↗",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("journey");
        }
      },
      {
        id: "tafra",
        num: "04",
        title: "محرك صناعة المحتوى TAFRA",
        subtitle: "بنك الـ 4,100+ فكرة والأطر الفيروسية",
        badge: "CONTENT OPERATING ENGINE",
        duration: "45 دقيقة",
        philosophy: "«حوّل خلاصات تركيزك وتجاربك إلى محتوى يترك أثراً حقيقياً ويبني لك سلطة معرفية.»",
        bullets: [
          "استكشاف بنك الـ 60 فكرة بطلة و600 فكرة ريل",
          "توليد الهوك (Hook) والسيناريو والنداء للإجراء",
          "جدولة النشر عبر الـ 84 يوماً القادمة"
        ],
        btnLabel: "ادخل محرك TAFRA للأفكار ✦",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("tafra");
        }
      },
      {
        id: "mastery",
        num: "05",
        title: "إدارة المشروعات والماستري OS",
        subtitle: "لوحة كانبان والمراجعة الأسبوعية",
        badge: "EXECUTION & COMPOUNDING",
        duration: "أسبوعياً",
        philosophy: "«ما لا يُقاس لا يُدار.. والمراجعة الأسبوعية هي البوصلة التي تمنعك من الركض في الاتجاه الخاطئ.»",
        bullets: [
          "نقل المهام من الالتقاط (Capture) إلى التوضيح والتنفيذ",
          "إجراء المراجعة الأسبوعية وضبط بوصلة الأهداف",
          "قياس العائد التراكمي وتفريغ الذهن"
        ],
        btnLabel: "افتح لوحة كانبان والماستري ▦",
        action: () => {
          if (window.APP?.openPage) window.APP.openPage("mastery");
        }
      }
    ]
  };

  let currentFlowMode = "student";
  let currentStepIdx = 0;
  let completedWorkflowSteps = {};

  try {
    const raw = localStorage.getItem("focus_workflow_v2");
    if (raw) {
      const parsed = JSON.parse(raw);
      currentFlowMode = parsed.mode || "student";
      currentStepIdx = parsed.step || 0;
      completedWorkflowSteps = parsed.completed || {};
    }
  } catch (e) {}

  function saveWorkflowState() {
    try {
      localStorage.setItem("focus_workflow_v2", JSON.stringify({
        mode: currentFlowMode,
        step: currentStepIdx,
        completed: completedWorkflowSteps
      }));
    } catch (e) {}
  }

  function renderInteractiveWorkflow() {
    const track = document.getElementById("workflowTrack");
    const inspector = document.getElementById("workflowInspector");
    if (!track || !inspector) return;

    const steps = WORKFLOW_DATA[currentFlowMode] || WORKFLOW_DATA.student;
    if (currentStepIdx >= steps.length) currentStepIdx = 0;

    // Render Track
    track.innerHTML = steps.map((s, idx) => {
      const isActive = idx === currentStepIdx;
      const isDone = !!completedWorkflowSteps[`${currentFlowMode}_${s.id}`];
      return `
        <div class="workflow-step-node ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" 
             data-stepidx="${idx}">
          <div class="node-top-row">
            <span class="node-number-pill">${s.num}</span>
            <span class="node-status-tag">${isDone ? 'مكتمل ✓' : (isActive ? 'قيد التركيز ●' : 'متاح')}</span>
          </div>
          <h4 class="node-title">${s.title}</h4>
          <p class="node-desc">${s.subtitle}</p>
        </div>
      `;
    }).join("");

    // Bind Track Clicks
    track.querySelectorAll(".workflow-step-node").forEach(node => {
      node.onclick = () => {
        const idx = parseInt(node.dataset.stepidx, 10);
        currentStepIdx = idx;
        saveWorkflowState();
        if (window.FocusAudio) window.FocusAudio.playClick();
        renderInteractiveWorkflow();
      };
    });

    // Render Inspector
    const currentStep = steps[currentStepIdx];
    const isCurrentDone = !!completedWorkflowSteps[`${currentFlowMode}_${currentStep.id}`];

    inspector.innerHTML = `
      <div>
        <div class="inspector-meta">
          <span class="inspector-badge">${currentStep.badge}</span>
          <span class="inspector-duration">⏱️ ${currentStep.duration}</span>
        </div>
        <h4 class="inspector-heading">${currentStep.title}</h4>
        <div class="inspector-philosophy">${currentStep.philosophy}</div>
        <ul class="inspector-bullets">
          ${currentStep.bullets.map(b => `<li><span>✦</span> ${b}</li>`).join("")}
        </ul>
      </div>
      <div class="inspector-actions">
        <button class="btn-launch-step" id="btnLaunchCurrentStep">
          <span>${currentStep.btnLabel}</span>
        </button>
        <button class="btn-complete-step ${isCurrentDone ? 'is-done' : ''}" id="btnToggleStepComplete">
          <span>${isCurrentDone ? '✓ تم إنجاز هذه الخطوة' : '○ وضع علامة الإنجاز (+50 XP)'}</span>
        </button>
      </div>
    `;

    // Bind Inspector Buttons
    const launchBtn = document.getElementById("btnLaunchCurrentStep");
    if (launchBtn) {
      launchBtn.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        if (currentStep.action) currentStep.action();
      };
    }

    const completeBtn = document.getElementById("btnToggleStepComplete");
    if (completeBtn) {
      completeBtn.onclick = () => {
        const key = `${currentFlowMode}_${currentStep.id}`;
        if (completedWorkflowSteps[key]) {
          delete completedWorkflowSteps[key];
        } else {
          completedWorkflowSteps[key] = true;
          addXP(50, `إنجاز خطوة: ${currentStep.title}`);
          if (window.FocusAudio) window.FocusAudio.playChime();
          triggerConfetti();
        }
        saveWorkflowState();
        renderInteractiveWorkflow();
      };
    }
  }

  function initWorkflowHub() {
    const btnStudent = document.getElementById("btnStudentFlow");
    const btnCreator = document.getElementById("btnCreatorFlow");

    if (btnStudent && btnCreator) {
      btnStudent.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        currentFlowMode = "student";
        btnStudent.classList.add("active");
        btnStudent.classList.remove("creator-mode");
        btnCreator.classList.remove("active", "creator-mode");
        currentStepIdx = 0;
        saveWorkflowState();
        renderInteractiveWorkflow();
      };

      btnCreator.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        currentFlowMode = "creator";
        btnCreator.classList.add("active", "creator-mode");
        btnStudent.classList.remove("active", "creator-mode");
        currentStepIdx = 0;
        saveWorkflowState();
        renderInteractiveWorkflow();
      };

      if (currentFlowMode === "creator") {
        btnCreator.classList.add("active", "creator-mode");
        btnStudent.classList.remove("active");
      } else {
        btnStudent.classList.add("active");
        btnCreator.classList.remove("active");
      }
    }

    renderInteractiveWorkflow();
  }

  // =========================================================================
  // 10. SOL FLOATING ISLAND DOCK & SOUND EQUALIZER (HELLOSOL STYLE)
  // =========================================================================
  function initSolFloatingDock() {
    const dock = document.getElementById("solFloatingDock");
    if (!dock) return;

    const dockWorkflow = document.getElementById("dockWorkflowBtn");
    const dockAudio = document.getElementById("dockAudioBtn");
    const dockZen = document.getElementById("dockZenBtn");
    const dockSos = document.getElementById("dockSosBtn");
    const dockSearch = document.getElementById("dockSearchBtn");
    const dockTheme = document.getElementById("dockThemeBtn");
    const dockWave = document.getElementById("dockSoundwave");
    const dockAudioLabel = document.getElementById("dockAudioLabel");

    if (dockWorkflow) {
      dockWorkflow.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        if (window.APP?.openPage) window.APP.openPage("overview");
        const el = document.getElementById("interactiveWorkflowHub");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    }

    if (dockAudio) {
      dockAudio.onclick = () => {
        if (window.FocusAudio) {
          window.FocusAudio.playClick();
          if (window.FocusAudio.currentTrack) {
            window.FocusAudio.stop();
          } else {
            window.FocusAudio.play40HzTone();
          }
          updateAudioVisualizers();
        }
      };
    }

    if (dockZen) {
      dockZen.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        openZenMode();
      };
    }

    if (dockSos) {
      dockSos.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        if (window.APP?.openPage) window.APP.openPage("student");
        const s = getStudentState();
        s.activeSubTab = "sos";
        s.activeSosStep = 1;
        saveStudentState(s);
        renderStudentHub();
      };
    }

    if (dockSearch) {
      dockSearch.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        const searchInput = document.getElementById("globalSearch");
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      };
    }

    if (dockTheme) {
      dockTheme.onclick = () => {
        toggleTheme();
      };
    }
  }

  function updateAudioVisualizers() {
    const dockWave = document.getElementById("dockSoundwave");
    const dockAudioLabel = document.getElementById("dockAudioLabel");
    const headerBtn = document.getElementById("headerAudioBtn");
    const isPlaying = !!(window.FocusAudio && window.FocusAudio.currentTrack);

    if (dockWave) {
      if (isPlaying) dockWave.classList.add("playing");
      else dockWave.classList.remove("playing");
    }
    if (dockAudioLabel) {
      dockAudioLabel.textContent = isPlaying ? (window.FocusAudio.currentTrack === "binaural" ? "موجات 40Hz" : "صوت المطر") : "الصوت الحي";
    }
    if (headerBtn) {
      if (isPlaying) headerBtn.classList.add("playing");
      else headerBtn.classList.remove("playing");
    }
  }

  // =========================================================================
  // 11. MOUSE SPOTLIGHT FOLLOWER (FRAMER / LINEAR / CONTRALABS)
  // =========================================================================
  function initSpotlightTracker() {
    document.addEventListener("pointermove", e => {
      const cards = document.querySelectorAll(".spotlight-card, .panel, .tool-card, .metric-card, .book-card");
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    }, { passive: true });
  }

'''

# Let's insert these into student-hub.js before the final closing of DOMContentLoaded
hook_target = 'document.querySelectorAll(".mobile-nav-pill").forEach(p => {'
if hook_target in code and "WORKFLOW_DATA" not in code:
    insertion = """
    initWorkflowHub();
    initSolFloatingDock();
    initSpotlightTracker();
    
    // Periodically sync equalizer
    setInterval(updateAudioVisualizers, 800);
"""
    # Insert functions before the DOMContentLoaded listener
    dom_target = 'document.addEventListener("DOMContentLoaded", () => {'
    code = code.replace(dom_target, workflow_engine_code + "\n  " + dom_target)
    
    # Insert initialization calls inside DOMContentLoaded
    code = code.replace(hook_target, insertion + "\n    " + hook_target)
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("student-hub.js updated successfully with Workflow Engine & Sol Dock!")
else:
    print("Already hooked or target not found, checking...")

