/**
 * FOCUS LAB × TAFRA OS — Student & Youth Mastery Hub Engine (2026 Enhanced Edition)
 * Inspired by Linear, Raycast, Vercel, and Stripe UI/UX Design Systems.
 * Complete with Web Audio Synthesizer, Live Equalizer, 4-Step Workflow Stepper,
 * Guided SOS Wizard, Session Task Checklist, Active Recall 3D Cards & Confetti.
 */

(() => {
  "use strict";

  // =========================================================================
  // 1. WEB AUDIO AMBIENT SOUND GENERATOR & SOUND EFFECTS (100% Offline)
  // =========================================================================
  class AmbientAudioEngine {
    constructor() {
      this.ctx = null;
      this.currentTrack = null;
      this.nodes = [];
      this.gainNode = null;
      this.volume = 0.55;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    stop() {
      this.nodes.forEach(n => {
        try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch (e) {}
      });
      this.nodes = [];
      this.currentTrack = null;
      this.updateUI();
    }

    setVolume(val) {
      this.volume = val;
      if (this.gainNode && this.ctx) {
        this.gainNode.gain.setValueAtTime(val, this.ctx.currentTime);
      }
    }

    playBrownNoise() {
      this.init();
      this.stop();
      this.currentTrack = "brown";
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.4;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 460;

      noise.connect(filter);
      filter.connect(this.gainNode);
      noise.start(0);
      this.nodes.push(noise, filter);
      this.updateUI();
    }

    playRain() {
      this.init();
      this.stop();
      this.currentTrack = "rain";
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 920;
      filter.Q.value = 0.95;

      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.18;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 320;
      lfo.connect(filter.frequency);
      lfo.start();

      noise.connect(filter);
      filter.connect(this.gainNode);
      noise.start(0);
      this.nodes.push(noise, filter, lfo, lfoGain);
      this.updateUI();
    }

    play40HzTone() {
      this.init();
      this.stop();
      this.currentTrack = "binaural";
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      g.gain.value = 0.18;

      osc1.type = "sine";
      osc1.frequency.value = 196; // G3
      osc2.type = "sine";
      osc2.frequency.value = 236; // 40Hz beat for Gamma cognitive focus

      osc1.connect(g);
      osc2.connect(g);
      g.connect(this.gainNode);

      osc1.start();
      osc2.start();
      this.nodes.push(osc1, osc2, g);
      this.updateUI();
    }

    playClick() {
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
        g.gain.setValueAtTime(0.08, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playChime() {
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.18); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.35); // C6
        g.gain.setValueAtTime(0.32, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.4);
      } catch (e) {}
    }

    playWhoosh() {
      try {
        this.init();
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.32);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = 2.8;
        const now = this.ctx.currentTime;
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 0.14);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.32);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
      } catch (e) {}
    }

    playError() {
      try {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(210, now + 0.09);

        g.gain.setValueAtTime(0.14, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    updateUI() {
      const btn = document.getElementById("headerAudioBtn");
      const label = document.getElementById("audioTrackName");
      if (!btn || !label) return;
      if (this.currentTrack) {
        btn.classList.add("playing");
        const names = {
          brown: "ضوضاء بنية ⚡",
          rain: "مطر وتركيز 🌧️",
          binaural: "موجات 40Hz 🧠"
        };
        label.textContent = names[this.currentTrack] || "شغال";
        // Show equalizer in header button if not present
        if (!btn.querySelector(".audio-equalizer")) {
          const eq = document.createElement("span");
          eq.className = "audio-equalizer";
          eq.innerHTML = '<span class="audio-eq-bar"></span><span class="audio-eq-bar"></span><span class="audio-eq-bar"></span><span class="audio-eq-bar"></span>';
          btn.appendChild(eq);
        }
      } else {
        btn.classList.remove("playing");
        label.textContent = "أصوات التركيز";
        const eq = btn.querySelector(".audio-equalizer");
        if (eq) eq.remove();
      }
      document.querySelectorAll(".sound-track-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.track === this.currentTrack);
      });
    }
  }

  const audio = new AmbientAudioEngine();
  window.FocusAudio = audio;

  // =========================================================================
  // 2. CONFETTI BURST (Pure Canvas, Zero External Dependencies)
  // =========================================================================
  function triggerConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#10b981", "#06b6d4", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6"];
    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.rotation += p.vr;
        p.alpha -= 0.014;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (alive && frame < 90) {
        frame++;
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(render);
  }
  window.triggerConfetti = triggerConfetti;

  // =========================================================================
  // 3. STUDENT STATE & GAMIFIED LEVELING SYSTEM
  // =========================================================================
  const DEFAULT_STUDENT_DATA = {
    xp: 220,
    streak: 4,
    lastActiveDate: new Date().toISOString().split("T")[0],
    studyMinutes: 115,
    completedSprints: 5,
    sosCount: 3,
    activeSubTab: "study",
    activeSosStep: 1,
    sessionTasks: [
      { id: 1, text: "تحديد المفهوم الأساسي للمحاضرة", done: true },
      { id: 2, text: "حل مسألتين أو تلخيص 3 صفحات مركزة", done: false },
      { id: 3, text: "تدوين ملاحظة الاستئناف للغد (30 ثانية)", done: false }
    ],
    courses: [
      { id: 1, name: "إدارة الوقت والتركيز الأكاديمي", totalPages: 120, completedPages: 55, examDate: "2026-12-15" },
      { id: 2, name: "المشروع التخرجي والبحث العلمي", totalPages: 80, completedPages: 40, examDate: "2026-12-28" }
    ],
    flashcards: [
      { id: 1, subject: "علم النفس الإدراكي", question: "ما هو تأثير زيجارنيك (Zeigarnik Effect) وكيف تستغله في المذاكرة؟", answer: "يميل الدماغ لتذكر المهام غير المكتملة أكثر من المكتملة بـ 90%. استغله ببدء المذاكرة 5 دقائق فقط لفتح حلقة ذهنية تجبر عقلك على إكمالها.", level: 1, nextReview: "2026-11-14" },
      { id: 2, subject: "إدارة الوقت", question: "ما هو قانون باركنسون (Parkinson's Law)؟", answer: "العمل يتمدد ليملأ كل الوقت المتاح لإنجازه. الحل: وضع مواعيد نهائية ضيقة ومصطنعة (Artificial Deadlines).", level: 2, nextReview: "2026-11-16" },
      { id: 3, subject: "الفيزيولوجيا العصبية", question: "كيف يعمل بروتوكول الزفير المزدوج الفسيولوجي (Physiological Sigh)؟", answer: "شهيقان متتاليان عن طريق الأنف ثم زفير طويل وبطيء بالفم، يعيد فتح الحويصلات الهوائية ويخفض معدل ضربات القلب والتوتر العصبي خلال 30 ثانية.", level: 1, nextReview: "2026-11-14" },
      { id: 4, subject: "استراتيجيات التعلم", question: "ما الفرق بين القراءة السلبية (Passive Reading) والاسترجاع النشط (Active Recall)؟", answer: "إعادة القراءة تعطي شعوراً كاذباً بالإتقان (Illusion of Competence). الاسترجاع النشط (إغلاق الكتاب ومحاولة تذكر المفاهيم واختبار النفس) يزيد نسبة التذكر في الامتحانات بـ 300%.", level: 3, nextReview: "2026-11-20" }
    ]
  };

  function getStudentState() {
    try {
      const appState = window.APP?.getState ? window.APP.getState() : null;
      if (appState && appState.student) return appState.student;
      const raw = localStorage.getItem("focus_student_data_v1");
      if (raw) return { ...DEFAULT_STUDENT_DATA, ...JSON.parse(raw) };
    } catch (e) {}
    return { ...DEFAULT_STUDENT_DATA };
  }

  function saveStudentState(s) {
    try {
      const appState = window.APP?.getState ? window.APP.getState() : null;
      if (appState) {
        appState.student = s;
        window.APP.persist();
      }
      localStorage.setItem("focus_student_data_v1", JSON.stringify(s));
      updateStudentBanner();
    } catch (e) {}
  }

  function addXP(amount, reason = "") {
    audio.playClick();
    const s = getStudentState();
    s.xp = (s.xp || 0) + amount;
    saveStudentState(s);
    if (window.APP?.toast) {
      window.APP.toast(`+${amount} XP! ${reason}`);
    }
    triggerConfetti();
  }

  function getStudentLevel(xp) {
    if (xp < 100) return { level: 1, title: "طالب مشتت يبحث عن الطريق", nextXP: 100, icon: "🌱", prevXP: 0 };
    if (xp < 300) return { level: 2, title: "مقاوم الدوبامين والمشتتات", nextXP: 300, icon: "⚔️", prevXP: 100 };
    if (xp < 700) return { level: 3, title: "وحش المذاكرة والعمل العميق", nextXP: 700, icon: "🦁", prevXP: 300 };
    if (xp < 1500) return { level: 4, title: "فارس الإنتاجية الأكاديمية", nextXP: 1500, icon: "⚡", prevXP: 700 };
    return { level: 5, title: "ماستري فوكس ليدر 👑", nextXP: 3000, icon: "👑", prevXP: 1500 };
  }

  function updateStudentBanner() {
    const s = getStudentState();
    const info = getStudentLevel(s.xp || 0);

    const avatar = document.getElementById("studentAvatar");
    const tag = document.getElementById("studentLevelTag");
    const title = document.getElementById("studentTitle");
    const label = document.getElementById("xpCountLabel");
    const fill = document.getElementById("xpProgressFill");

    if (avatar) avatar.textContent = info.icon;
    if (tag) tag.textContent = `المستوى ${info.level}`;
    if (title) title.textContent = info.title;

    const span = info.nextXP - info.prevXP;
    const progress = Math.min(100, Math.max(0, ((s.xp - info.prevXP) / span) * 100));

    if (label) label.textContent = `${s.xp} / ${info.nextXP} XP`;
    if (fill) fill.style.width = `${progress}%`;

    const statStreak = document.getElementById("statStreak");
    const statStudyMin = document.getElementById("statStudyMin");
    const statSprints = document.getElementById("statSprints");
    const statCourses = document.getElementById("statCourses");
    const statSos = document.getElementById("statSos");

    if (statStreak) statStreak.textContent = `${s.streak || 0} 🔥`;
    if (statStudyMin) statStudyMin.textContent = `${s.studyMinutes || 0} ⏱️`;
    if (statSprints) statSprints.textContent = `${s.completedSprints || 0} 🎯`;
    if (statCourses) statCourses.textContent = `${s.courses?.length || 0} 📚`;
    if (statSos) statSos.textContent = `${s.sosCount || 0} 🛡️`;

    const headerStreakCount = document.getElementById("headerStreakCount");
    if (headerStreakCount) headerStreakCount.textContent = s.streak || 4;
  }

  // =========================================================================
  // 4. STUDY TIMER ENGINE & AUDIO INTEGRATION
  // =========================================================================
  let studyTimerHandle = null;
  let studySeconds = 25 * 60;
  let studyInitialSeconds = 25 * 60;
  let studyRunning = false;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function setStudyPreset(minutes) {
    audio.playClick();
    pauseStudyTimer();
    studyInitialSeconds = minutes * 60;
    studySeconds = studyInitialSeconds;
    updateStudyTimerUI();
    document.querySelectorAll(".preset-chip").forEach(c => {
      c.classList.toggle("active", Number(c.dataset.min) === minutes);
    });
  }

  function toggleStudyTimer() {
    audio.playClick();
    if (studyRunning) {
      pauseStudyTimer();
    } else {
      startStudyTimer();
    }
  }

  function startStudyTimer() {
    if (studyRunning) return;
    studyRunning = true;
    const btn = document.getElementById("studyTimerStartBtn");
    const zenBtn = document.getElementById("zenToggleBtn");
    if (btn) btn.textContent = "⏸️ إيقاف مؤقت";
    if (zenBtn) zenBtn.textContent = "⏸️ إيقاف مؤقت";

    const label = document.getElementById("timerStateLabel");
    if (label) label.textContent = "جلسة تركيز جارية ⚡";

    studyTimerHandle = setInterval(() => {
      if (studySeconds > 0) {
        studySeconds--;
        updateStudyTimerUI();
      } else {
        completeStudySession();
      }
    }, 1000);
  }

  function pauseStudyTimer() {
    studyRunning = false;
    clearInterval(studyTimerHandle);
    studyTimerHandle = null;
    const btn = document.getElementById("studyTimerStartBtn");
    const zenBtn = document.getElementById("zenToggleBtn");
    if (btn) btn.textContent = "▶️ بدء المذاكرة";
    if (zenBtn) zenBtn.textContent = "▶️ بدء المذاكرة";

    const label = document.getElementById("timerStateLabel");
    if (label) label.textContent = "متوقف مؤقتاً";
  }

  function resetStudyTimer() {
    audio.playClick();
    pauseStudyTimer();
    studySeconds = studyInitialSeconds;
    updateStudyTimerUI();
  }

  function updateStudyTimerUI() {
    const text = formatTime(studySeconds);
    const digits = document.getElementById("studyTimerDigits");
    const zenDigits = document.getElementById("zenDigits");
    if (digits) digits.textContent = text;
    if (zenDigits) zenDigits.textContent = text;

    const circle = document.getElementById("timerProgressCircle");
    if (circle && studyInitialSeconds > 0) {
      const fraction = (studyInitialSeconds - studySeconds) / studyInitialSeconds;
      const offset = 691 - (fraction * 691);
      circle.style.strokeDashoffset = offset;
    }
  }

  function completeStudySession() {
    pauseStudyTimer();
    audio.playChime();
    triggerConfetti();

    const minCompleted = Math.round(studyInitialSeconds / 60);
    const s = getStudentState();
    s.studyMinutes = (s.studyMinutes || 0) + minCompleted;
    s.completedSprints = (s.completedSprints || 0) + 1;
    saveStudentState(s);
    addXP(50, `إنجاز جلسة تركيز كاملة (${minCompleted} دقيقة)!`);

    alert(`🎉 وحش يا بطل! أتممت جلسة مذاكرة مدتها ${minCompleted} دقيقة بنجاح. عقلك الآن في أعلى درجات الاستيعاب.`);
    resetStudyTimer();
  }

  // =========================================================================
  // 5. RENDERING THE STUDENT HUB
  // =========================================================================
  function renderStudentHub() {
    updateStudentBanner();
    const s = getStudentState();
    const activeTab = s.activeSubTab || "study";

    document.querySelectorAll(".student-tab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.stab === activeTab);
    });

    const container = document.getElementById("studentTabContent");
    if (!container) return;

    if (activeTab === "study") container.innerHTML = renderStudyRoomHTML();
    else if (activeTab === "sos") container.innerHTML = renderSOSWizardHTML();
    else if (activeTab === "syllabus") container.innerHTML = renderSyllabusHTML();
    else if (activeTab === "flashcards") container.innerHTML = renderFlashcardsHTML();
    else if (activeTab === "doctor") container.innerHTML = renderDoctorHTML();
    else if (activeTab === "career") container.innerHTML = renderCareerHTML();

    bindStudentHubEvents(activeTab);
    if (activeTab === "study") {
      updateStudyTimerUI();
    }
  }
  window.renderStudentHub = renderStudentHub;

  // --- Sub-Tab 1: Study Room ---
  function renderStudyRoomHTML() {
    const s = getStudentState();
    const tasks = s.sessionTasks || [];

    const tasksHTML = tasks.map(t => `
      <div class="session-task-row">
        <input type="checkbox" class="session-task-checkbox" data-taskid="${t.id}" ${t.done ? "checked" : ""}>
        <span class="session-task-text ${t.done ? "done" : ""}">${t.text}</span>
      </div>
    `).join("");

    return `
    <!-- 4-Step Mastery Flow -->
    <div class="workflow-stepper">
      <div class="stepper-card" onclick="window.switchStudentTab('doctor')">
        <div class="stepper-num">1</div>
        <div class="stepper-info">
          <h5>تشخيص التعطل</h5>
          <small>طبيب التركيز (60 ثانية)</small>
        </div>
      </div>
      <div class="stepper-card" onclick="window.switchStudentTab('sos')">
        <div class="stepper-num">2</div>
        <div class="stepper-info">
          <h5>كسر التسويف</h5>
          <small>بروتوكول الـ 120 ثانية</small>
        </div>
      </div>
      <div class="stepper-card active" onclick="window.switchStudentTab('study')">
        <div class="stepper-num">3</div>
        <div class="stepper-info">
          <h5>العمل العميق</h5>
          <small>بومودورو + عزل صوتي</small>
        </div>
      </div>
      <div class="stepper-card" onclick="window.switchStudentTab('flashcards')">
        <div class="stepper-num">4</div>
        <div class="stepper-info">
          <h5>تثبيت المعلومة</h5>
          <small>استرجاع نشط 3D</small>
        </div>
      </div>
    </div>

    <div class="study-war-room">
      <div class="panel timer-stage-card">
        <span class="panel-kicker" style="color:var(--emerald);">DEEP WORK WAR-ROOM</span>
        <h3 style="margin-top:4px;">غرفة المذاكرة والعمل العميق</h3>
        <p style="font-size:13px; color:var(--text-dim); margin-bottom:24px;">
          اختر وقت الجلسة، واشغل الصوت العازل المفضل لديك، وادخل في تدفق ذهني كامل بدون تشتيت.
        </p>

        <div class="timer-presets">
          <button class="preset-chip active" data-min="25">25 دقيقة (بومودورو سريع)</button>
          <button class="preset-chip" data-min="50">50 دقيقة (فاينال وعمق)</button>
          <button class="preset-chip" data-min="90">90 دقيقة (ماستري كامل)</button>
          <button class="preset-chip" data-min="10">10 دقائق (كسر الجمود)</button>
        </div>

        <div class="circular-timer-box">
          <svg viewBox="0 0 240 240">
            <circle class="timer-circle-bg" cx="120" cy="120" r="110"></circle>
            <circle class="timer-circle-progress" id="timerProgressCircle" cx="120" cy="120" r="110"></circle>
          </svg>
          <div class="timer-display-inner">
            <div class="timer-big-digits" id="studyTimerDigits">25:00</div>
            <div class="timer-state-label" id="timerStateLabel">جاهز للبدء</div>
          </div>
        </div>

        <div class="timer-controls-row">
          <button class="btn-timer-primary" id="studyTimerStartBtn">▶️ بدء المذاكرة</button>
          <button class="btn-timer-secondary" id="studyTimerResetBtn">🔄 إعادة ضبط</button>
          <button class="btn-timer-secondary" id="openZenBtn" title="ملء الشاشة">⛶ وضع الزن (Zen)</button>
        </div>

        <div class="timer-task-input">
          <input type="text" id="studyTaskInput" placeholder="ما هي المادة أو الشابتر الذي تذاكره الآن؟ (مثلاً: المحاضرة 4 تشريح)">
        </div>

        <!-- Session Tasks Checklist -->
        <div class="session-tasks-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <b style="font-size:12px; color:#fff;">🎯 مهام هذه الجلسة المصغرة:</b>
            <span style="font-size:11px; color:var(--emerald);">+10 XP لكل مهمة</span>
          </div>
          <div id="sessionTaskList">${tasksHTML}</div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <input type="text" id="newSessionTaskInput" placeholder="أضف مهمة مصغرة للجلسة..." style="flex:1; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); padding:8px 12px; border-radius:6px; color:#fff; font-size:12px;">
            <button class="btn btn-secondary" id="addSessionTaskBtn" style="padding:6px 14px; font-size:12px;">+ إضافة</button>
          </div>
        </div>
      </div>

      <!-- Ambient Sound Studio -->
      <div class="panel ambient-sound-panel">
        <span class="panel-kicker" style="color:var(--cyan);">ACOUSTIC ISOLATION</span>
        <h3 style="margin-top:4px;">محطة العزل الصوتي</h3>
        <p style="font-size:12px; color:var(--text-dim);">
          أصوات فيزيائية يتم توليدها محلياً في متصفحك لقطع المشتتات المحيطة وتحفيز التركيز.
        </p>

        <button class="sound-track-btn" data-track="brown">
          <span>⚡ ضوضاء بنية عازلة (Brown Noise)</span>
          <small>قطع الضجيج</small>
        </button>

        <button class="sound-track-btn" data-track="rain">
          <span>🌧️ مطر وتركيز عميق (Rain Flow)</span>
          <small>هدوء عصبي</small>
        </button>

        <button class="sound-track-btn" data-track="binaural">
          <span>🧠 موجات 40Hz بيتا (Binaural)</span>
          <small>تحفيز القشرة المخية</small>
        </button>

        <button class="btn btn-secondary" id="stopAudioBtn" style="margin-top:10px;">
          ⏹️ إيقاف الصوت
        </button>

        <div style="margin-top:14px; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">
          <label style="font-size:12px; color:var(--text-dim); display:flex; justify-content:space-between; margin-bottom:6px;">
            <span>مستوى الصوت</span>
            <span id="volLabel">55%</span>
          </label>
          <input type="range" id="audioVolumeSlider" min="0" max="1" step="0.05" value="0.55" style="width:100%;">
        </div>

        <div style="background:rgba(255,255,255,0.02); border-radius:10px; padding:12px; font-size:11px; color:var(--text-dim); line-height:1.6;">
          💡 <b>نصيحة هوبرمان:</b> الموجات فوق 40Hz والضوضاء البنية تزيد إفراز الأسيتيل كولين في الفص الجبهي، مما يرفع دقة الاستيعاب بنسبة 40%.
        </div>
      </div>
    </div>
    `;
  }

  // --- Sub-Tab 2: Guided Procrastination SOS Wizard ---
  function renderSOSWizardHTML() {
    const s = getStudentState();
    const currentStep = s.activeSosStep || 1;

    return `
    <div class="panel sos-wizard-box">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span class="badge" style="background:#e11d48; color:#fff;">SOS PROTOCOL</span>
          <h2 style="margin:6px 0 0; color:#fff;">طوارئ التسويف والشلل الذهني الفوري</h2>
        </div>
        <span style="font-size:32px;">🛡️</span>
      </div>
      <p style="color:#fda4af; font-size:14px; margin-top:8px;">
        لو حاسس بجمود ومش طايق تبدأ المذاكرة ومصدع من الذنب — اتبع الخطوات الـ 4 دي بالترتيب خطوة بخطوة.
      </p>

      <!-- Step Indicator Dots -->
      <div class="sos-steps-indicator">
        <div class="sos-step-dot ${currentStep >= 1 ? "active" : ""}"></div>
        <div class="sos-step-dot ${currentStep >= 2 ? "active" : ""}"></div>
        <div class="sos-step-dot ${currentStep >= 3 ? "active" : ""}"></div>
        <div class="sos-step-dot ${currentStep >= 4 ? "active" : ""}"></div>
      </div>

      <!-- Step 1: Breathing -->
      <div class="sos-step-pane ${currentStep === 1 ? "active" : ""}" id="sosPane1">
        <div class="panel" style="background:rgba(0,0,0,0.3); border-color:rgba(244,63,94,0.2);">
          <span class="panel-kicker" style="color:var(--emerald);">الخطوة 1 من 4: الزفير الفسيولوجي المزدوج (30 ثانية)</span>
          <p style="font-size:13px; color:var(--text-dim);">
            التسويف يبدأ من توتر لاواعي في الجهاز العصبي. التنفس ده بيعيد تشغيل قشرة الدماغ الأمامية فوراً.
          </p>
          <div class="breathing-circle-container">
            <div class="breathing-glow-ring" id="breathingRing"></div>
            <div class="breathing-text" id="breathingText">اضغط لبدء التنفس</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-secondary" id="startBreathingBtn">🫁 ابدأ تمرين التنفس (3 دورات)</button>
            <button class="btn btn-primary" onclick="window.nextSosStep(2)">الخطوة التالية ➔</button>
          </div>
        </div>
      </div>

      <!-- Step 2: Cognitive Reframe -->
      <div class="sos-step-pane ${currentStep === 2 ? "active" : ""}" id="sosPane2">
        <div class="panel" style="background:rgba(0,0,0,0.3); border-color:rgba(244,63,94,0.2);">
          <span class="panel-kicker" style="color:var(--cyan);">الخطوة 2 من 4: الحقيقة العلمية (تفريغ الذنب)</span>
          <p style="font-size:15px; color:#e2e8f0; line-height:1.7; margin:16px 0;">
            <b>اعترف بده بصوت مسموع:</b> أنت مش غبي ومش فاشل ومش كسول. مخك بيهرب من المحاضرة علشان بيحمي نفسه من (الملل، أو الخوف من الامتحان).
            بمجرد ما تقول لنفسك: <i>"أنا حاسس بملل وخوف، وده شعور بشري طبيعي جداً ومش هيموتني"</i> — قوة التسويف بتقل 50%.
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-secondary" onclick="window.nextSosStep(1)">السابق</button>
            <button class="btn btn-primary" onclick="window.nextSosStep(3)">الخطوة التالية ➔</button>
          </div>
        </div>
      </div>

      <!-- Step 3: The 5-Minute Deal -->
      <div class="sos-step-pane ${currentStep === 3 ? "active" : ""}" id="sosPane3">
        <div class="panel" style="background:rgba(0,0,0,0.3); border-color:rgba(244,63,94,0.2);">
          <span class="panel-kicker" style="color:var(--amber);">الخطوة 3 من 4: خدعة الـ 5 دقائق الخادعة</span>
          <p style="font-size:15px; color:#e2e8f0; line-height:1.7; margin:16px 0;">
            اتفق مع عقلك على الاتفاق السحري: <b>"أنا مش هخلص المنهج، أنا هفتح صفحة واحدة بس وأبص فيها لمدة 5 دقائق. لو حبيت أوقف بعدها، هقوم فوراً من غير تأنيب ضمير."</b>
            في 85% من الحالات، عقلك هيكمل بمجرد كسر عتبة البداية (تأثير زيجارنيك).
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-secondary" onclick="window.nextSosStep(2)">السابق</button>
            <button class="btn btn-primary" onclick="window.nextSosStep(4)">الخطوة الأخيرة ➔</button>
          </div>
        </div>
      </div>

      <!-- Step 4: Tiny Step & Launch -->
      <div class="sos-step-pane ${currentStep === 4 ? "active" : ""}" id="sosPane4">
        <div class="panel" style="background:rgba(0,0,0,0.3); border-color:rgba(16,185,129,0.35);">
          <span class="panel-kicker" style="color:var(--emerald);">الخطوة 4 من 4: تحديد الخطوة التافهة الصغر والبدء</span>
          <p style="font-size:13px; color:var(--text-dim); margin-bottom:14px;">
            اكتب أصغر حركة مادية تقدر تعملها في 60 ثانية (مثلاً: "فتح السلايد رقم 1 وقراءة أول سطر"):
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <input type="text" id="sosTinyStepInput" placeholder="أصغر حركة مصغرة..." value="فتح السلايد رقم 1 وقراءة العنوان الأول" style="flex:1; min-width:240px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.15); padding:12px; border-radius:10px; color:#fff;">
            <button class="btn btn-primary" id="launchSosTimerBtn" style="background:linear-gradient(135deg,#10b981,#059669); border:0; padding:12px 28px; font-weight:800;">
              🚀 ابدأ الـ 5 دقائق الآن (+30 XP)
            </button>
          </div>
          <div style="margin-top:14px;">
            <button class="btn btn-secondary" onclick="window.nextSosStep(3)">السابق</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  window.nextSosStep = function(step) {
    audio.playClick();
    const s = getStudentState();
    s.activeSosStep = step;
    saveStudentState(s);
    renderStudentHub();
  };

  window.switchStudentTab = function(tabName) {
    if (audio) audio.playClick();
    if (window.APP?.openPage) window.APP.openPage("student");
    const s = getStudentState();
    s.activeSubTab = tabName;
    saveStudentState(s);
    renderStudentHub();
  };

  // --- Sub-Tab 3: Syllabus & Exam Chunker ---
  function renderSyllabusHTML() {
    const s = getStudentState();
    const courses = s.courses || [];

    const coursesHTML = courses.map(c => {
      const pct = Math.round((c.completedPages / c.totalPages) * 100) || 0;
      const daysLeft = Math.max(1, Math.round((new Date(c.examDate) - new Date()) / (1000 * 60 * 60 * 24)));
      const pagesPerDay = Math.ceil((c.totalPages - c.completedPages) / daysLeft);

      return `
      <div class="panel" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:20px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="badge" style="background:rgba(6,182,212,0.15); color:var(--cyan); font-weight:800;">${daysLeft} يوم متبقي على الفاينال</span>
            <h4 style="margin:8px 0 4px; font-size:17px; color:#fff;">${c.name}</h4>
            <small style="color:var(--text-dim);">متبقي: ${c.totalPages - c.completedPages} من أصل ${c.totalPages} جزء/صفحة</small>
          </div>
          <div style="text-align:left;">
            <div style="font-size:20px; font-weight:900; color:var(--emerald);">${pagesPerDay} وحدة / يومياً</div>
            <small style="color:var(--text-dim);">لإنهاء المنهج والمراجعة</small>
          </div>
        </div>

        <div style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px; color:var(--text-dim);">
            <span>نسبة الإنجاز الأكاديمي</span>
            <span style="font-weight:700; color:#fff;">${pct}%</span>
          </div>
          <div style="height:10px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
            <div style="height:100%; width:${pct}%; background:linear-gradient(90deg,var(--cyan),var(--emerald)); box-shadow:0 0 10px rgba(16,185,129,0.5);"></div>
          </div>
        </div>

        <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <button class="btn btn-secondary" onclick="window.incrementCourseProgress(${c.id})" style="font-size:12px; padding:8px 16px;">
            + أنجزت 5 وحدات / صفحات (+15 XP)
          </button>
          <button class="btn btn-danger" onclick="window.deleteCourse(${c.id})" style="font-size:11px; padding:6px 12px; background:transparent; border:1px solid rgba(244,63,94,0.3); color:#fda4af;">
            حذف المقرر
          </button>
        </div>
      </div>
      `;
    }).join("");

    return `
    <div style="display:grid; grid-template-columns: 1fr 350px; gap:24px;">
      <div>
        <div style="margin-bottom:18px;">
          <h3 style="margin:0; color:#fff;">مقرراتك الدراسية النشطة</h3>
          <small style="color:var(--text-dim);">تفكيك المنهج لجرعات يومية محكومة بالوقت</small>
        </div>
        ${courses.length ? coursesHTML : '<div class="panel" style="text-align:center; padding:35px; color:var(--text-dim);">لا توجد مقررات بعد. أضف مقررك الأول من النموذج المقابل!</div>'}
      </div>

      <!-- Add Course Form -->
      <div class="panel">
        <span class="panel-kicker" style="color:var(--emerald);">SYLLABUS CHUNKER</span>
        <h4 style="margin-top:4px;">تفكيك مقرر أو مادة دراسية</h4>
        <p style="font-size:12px; color:var(--text-dim); margin-bottom:18px;">
          أدخل بيانات المنهج وسنقوم بحساب الجرعة اليومية المناسبة لمنع تراكم ليلة الامتحان.
        </p>

        <form id="addCourseForm">
          <label style="font-size:12px; color:var(--text-dim); display:block; margin-bottom:4px;">اسم المادة / المقرر</label>
          <input type="text" id="courseNameInput" placeholder="مثلاً: خوارزميات وهياكل بيانات" required style="width:100%; background:rgba(0,0,0,0.35); border:1px solid var(--border-subtle); padding:11px; border-radius:8px; color:#fff; margin-bottom:14px;">

          <label style="font-size:12px; color:var(--text-dim); display:block; margin-bottom:4px;">إجمالي الوحدات (صفحات أو محاضرات)</label>
          <input type="number" id="courseTotalInput" min="1" placeholder="مثلاً: 12 محاضرة أو 250 صفحة" required style="width:100%; background:rgba(0,0,0,0.35); border:1px solid var(--border-subtle); padding:11px; border-radius:8px; color:#fff; margin-bottom:14px;">

          <label style="font-size:12px; color:var(--text-dim); display:block; margin-bottom:4px;">تاريخ الفاينال / الامتحان</label>
          <input type="date" id="courseDateInput" required style="width:100%; background:rgba(0,0,0,0.35); border:1px solid var(--border-subtle); padding:11px; border-radius:8px; color:#fff; margin-bottom:18px;">

          <button type="submit" class="btn btn-primary" style="width:100%;">
            ➕ فكك المنهج واحفظ الخطة
          </button>
        </form>
      </div>
    </div>
    `;
  }

  // --- Sub-Tab 4: Active Recall Flashcards ---
  let currentCardIndex = 0;
  function renderFlashcardsHTML() {
    const s = getStudentState();
    const cards = s.flashcards || [];
    const card = cards[currentCardIndex % (cards.length || 1)] || null;

    if (!card) {
      return `<div class="panel" style="text-align:center; padding:40px;">لا توجد بطاقات استرجاع نشط. أضف بطاقات جديدة!</div>`;
    }

    return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <div>
          <span class="panel-kicker" style="color:var(--purple);">SPACED REPETITION & ACTIVE RECALL</span>
          <h3 style="margin:4px 0 0; color:#fff;">استوديو الاسترجاع النشط والتكرار المتباعد</h3>
          <p style="font-size:12px; color:var(--text-dim); margin-top:2px;">
            اضغط على البطاقة لقلبها بـ 3D ورؤية الإجابة، ثم قيّم مدى سهولتها لتحديد موعد المراجعة القادم.
          </p>
        </div>
        <div>
          <span class="badge" style="background:rgba(168,85,247,0.2); color:#c084fc; font-weight:800;">البطاقة ${currentCardIndex + 1} من ${cards.length}</span>
        </div>
      </div>

      <div class="flashcard-stage" id="activeRecallCard" onclick="this.classList.toggle('flipped'); window.FocusAudio.playClick();">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <span class="flashcard-tag">${card.subject}</span>
            <div class="flashcard-prompt">${card.question}</div>
            <div class="flashcard-hint">🔄 اضغط في أي مكان لقلب البطاقة ومعاينة الإجابة</div>
          </div>
          <div class="flashcard-back">
            <span class="flashcard-tag" style="color:var(--emerald); background:rgba(16,185,129,0.15);">الإجابة النموذجية</span>
            <div class="flashcard-prompt" style="font-size:16px; font-weight:600; line-height:1.7;">${card.answer}</div>
            <div class="flashcard-hint" style="color:#a7f3d0;">كيف تقيّم استرجاعك لهذه المعلومة؟</div>
          </div>
        </div>
      </div>

      <div class="flashcard-actions">
        <button class="btn-card-rate btn-card-easy" onclick="window.rateCard(3)">
          🟢 سهل (+20 XP · تكرار بعد 4 أيام)
        </button>
        <button class="btn-card-rate btn-card-medium" onclick="window.rateCard(2)">
          🟡 متوسط (+10 XP · تكرار بعد يومين)
        </button>
        <button class="btn-card-rate btn-card-hard" onclick="window.rateCard(1)">
          🔴 صعب (إعادة فورية اليوم)
        </button>
      </div>
    </div>
    `;
  }

  // --- Sub-Tab 5: Student Focus Doctor ---
  function renderDoctorHTML() {
    const DILEMMAS = [
      {
        id: "d1",
        badge: "الأزمة الأكثر شيوعاً",
        title: "📚 تراكم المواد قبل الفاينال بأسبوع",
        symptom: "حاسس إن المنهج جبل مستحيل يتلم، وكل ما تبص في الورق تحس بصداع ورغبة في النوم.",
        rootCause: "شلل التراكم (Analysis Paralysis). مخك شايف المهمة ضخمة فبيهرب للدوبامين الرخيص.",
        protocol: "1. حل امتحانات سابقة فوراً (Reverse Engineering) بدون قراءة السلايدات من الصفر. 2. ركز على الأسئلة الأكثر تكراراً (قانون باريتو 80/20). 3. طبق 4 جلسات 50/10 يومياً.",
        toolId: "urgent-important",
        toolName: "مصفوفة أيزنهاور لتصفية الأولويات"
      },
      {
        id: "d2",
        badge: "إدمان الدوبامين",
        title: "📱 الموبايل والتيك توك بيضيعوا 6 ساعات كل يوم",
        symptom: "تفتح التليفون عشان تشوف مسج مهمة، تلاقي نفسك بتسكرول فيديوهات بقالك ساعتين.",
        rootCause: "تغذية الدوبامين المتغيرة (Variable Reward Schedule) المصممة في خوارزميات المنصات لخطف انتباهك.",
        protocol: "1. حط التليفون في أوضة تانية خالص أثناء المذاكرة. 2. شغل الشاشة بالأبيض والأسود (Grayscale). 3. ابدأ جلسة بومودورو 25 دقيقة مغلقة بدون أي شاشات.",
        toolId: "digital-hygiene",
        toolName: "فحص النظافة الرقمية"
      },
      {
        id: "d3",
        badge: "أزمة الشغف",
        title: "🥱 الملل السريع وفقدان الشغف بعد 10 دقائق مذاكرة",
        symptom: "تبدأ متحمس، وبعد صفحتين تحس بزهق لا يطاق وتسأل نفسك: 'أنا بدرس ده ليه أصلاً؟'",
        rootCause: "انفصال الفعل عن القيمة (Values Detachment). عقلك مش شايف علاقة بين المادة دي ومستقبلك.",
        protocol: "1. اربط المادة بهدف شخصي أو مالي (مثلاً: النجاح ده هيخليني أخد منحة أو أشتغل في شركة كذا). 2. ذاكر بطريقة المكافأة الفورية بعد كل 25 دقيقة.",
        toolId: "identity-values",
        toolName: "بوصلة الهوية والقيم"
      },
      {
        id: "d4",
        badge: "توتر الاختبارات",
        title: "😰 الخوف المرضي من الامتحانات وبياض الذهن (Blank Mind)",
        symptom: "تدخل اللجنة تلاقي نفسك ناسي كل حاجة وإيدك بترتعش وضربات قلبك سريعة.",
        rootCause: "نشاط اللوزة الدماغية المفرط (Amygdala Hijack) اللي بيعطل وصول الدم لقشرة الذاكرة.",
        protocol: "1. اعمل الزفير المزدوج 3 مرات قبل الدخول للجنة. 2. اكتب مخاوفك في ورقة مسودة قبل قراءة الأسئلة لتفريغ القلق العامل (Expressive Writing).",
        toolId: "rumination",
        toolName: "تفريغ الاجترار والوساوس"
      },
      {
        id: "d5",
        badge: "حيرة المستقبل",
        title: "💼 الموازنة بين دراسة الكلية وبناء مهارات العمل الحر والـ AI",
        symptom: "مشتت بين إنك تذاكر للكلية وبين إنك تتعلم برمجة، جرافيك، لغات، أو تسويق ومش لاحق تعمل حاجة.",
        rootCause: "تضارب المسارات بدون تخطيط زمني محكم (Context Switching Loss).",
        protocol: "1. خصص وقت الكلية للحد الأدنى المقبول (تقدير جيد أو جيد جداً). 2. خصص ساعتين يومياً في المساء ككتلة مقدسة لتعلم المهارة ذات الدخل المرتفع. 3. لا تفتح المهارة وقت المحاضرات.",
        toolId: "timebox",
        toolName: "التخطيط بالصناديق الزمنية"
      },
      {
        id: "d6",
        badge: "ساعة بيولوجية مدمرة",
        title: "🌙 السهر المفرط وتلف التركيز الصباحي",
        symptom: "بتنام الساعة 5 الفجر وتصحى الضهر مهدود الحيل وتركيزك شبه معدوم.",
        rootCause: "اضطراب الساعة البيولوجية وتأخر إفراز الميلاتونين بسبب الضوء الأزرق في الليل.",
        protocol: "1. اتعرض لضوء الشمس المباشر في أول 30 دقيقة بعد الصحيان. 2. امنع الكافيين بعد الساعة 2 الظهر. 3. نفذ روتين إغلاق الشاشات قبل النوم بساعة.",
        toolId: "sleep-planner",
        toolName: "منظم النوم والتعافي العصبي"
      },
      {
        id: "d7",
        badge: "فخ التخطيط الوهمي",
        title: "🤯 الأفكار الكتيرة والشعور بالذنب بدون تنفيذ حقيقي",
        symptom: "عندك 10 خطط للمذاكرة والكورسات وكل يوم تشتري كشكول جديد وتعمل جدول وما تنفذش.",
        rootCause: "وهم الإنتاجية (Planning as Procrastination). التخطيط بيعطي دوبامين رخيص بدون تعب.",
        protocol: "1. وقف أي تخطيط جديد لمدة أسبوع. 2. اختار مادة واحدة ومهمة واحدة ونفذها فوراً عبر الخطوة متناهية الصغر.",
        toolId: "next-tiny-step",
        toolName: "الخطوة شديدة الصغر"
      },
      {
        id: "d8",
        badge: "وهم الحفظ",
        title: "🔍 النسيان السريع بعد القراءة المتكررة",
        symptom: "تقرا الشابتر 4 مرات وتلون بالماركر، وتاني يوم ماتفتكرش نص المعلومات.",
        rootCause: "وهم الإتقان بالقراءة السلبية (Illusion of Competence). التلوين والقراءة مش تعلم.",
        protocol: "1. اقفل الكتاب بعد كل فقرة وحاول تشرحها لنفسك بصوت عالي (تقنية فاينمان). 2. استخدم بطاقات الاسترجاع النشط والتكرار المتباعد.",
        toolId: "active-recall",
        toolName: "بطاقة الاسترجاع النشط"
      }
    ];

    const cardsHTML = DILEMMAS.map(d => `
      <div class="doctor-card">
        <span class="doctor-badge">${d.badge}</span>
        <div class="doctor-title">${d.title}</div>
        <div class="doctor-summary"><b>العرض:</b> ${d.symptom}</div>
        <div style="font-size:12px; color:#cbd5e1; margin-bottom:10px;">
          <b>التفسير العلمي:</b> ${d.rootCause}
        </div>
        <div class="doctor-protocol-box">
          <b>⚡ بروتوكول الـ 24 ساعة:</b> ${d.protocol}
        </div>
        <div style="margin-top:14px; text-align:left;">
          <button class="btn btn-primary" onclick="window.FocusAudio.playClick(); window.APP.openTool('${d.toolId}')" style="font-size:12px; padding:8px 16px;">
            افتح أداة الحل: ${d.toolName} ↗
          </button>
        </div>
      </div>
    `).join("");

    return `
    <div>
      <div style="margin-bottom:20px;">
        <span class="panel-kicker" style="color:var(--cyan);">STUDENT FOCUS DOCTOR</span>
        <h3 style="margin:2px 0 0; color:#fff;">طبيب التركيز الجامعي وتشخيص التعطل</h3>
        <p style="font-size:13px; color:var(--text-dim); margin-top:4px;">
          اختر المعضلة التي تواجهها اليوم لمعرفة التشخيص العلمي والبروتوكول الفوري لكسرها في 24 ساعة.
        </p>
      </div>
      <div class="doctor-grid">${cardsHTML}</div>
    </div>
    `;
  }

  // --- Sub-Tab 6: Career & Freelance Launchpad ---
  function renderCareerHTML() {
    return `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
      <div class="panel">
        <span class="panel-kicker" style="color:var(--emerald);">SKILL STACKING</span>
        <h3 style="margin-top:4px;">بناء مهارات ذات دخل مرتفع أثناء دراستك</h3>
        <p style="font-size:13px; color:var(--text-dim); line-height:1.6;">
          الجامعة بتديك شهادة، بس المهارات والبراند الشخصي هما اللي بيدوك وظيفة وفريلانس ودخل حر.
          ما تستناش لما تتخرج علشان تبدأ تجرب.
        </p>

        <div style="margin-top:18px; display:grid; gap:14px;">
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:12px;">
            <b style="color:var(--cyan);">1. مهارة الـ AI Prompting والأتمتة</b>
            <p style="font-size:12px; color:var(--text-dim); margin:4px 0 0;">
              تعلم استخدام الذكاء الاصطناعي في إنجاز المهام في ربع الوقت (بحث، تلخيص، برمجة، كتابة سكريبتات).
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:12px;">
            <b style="color:var(--amber);">2. صناعة المحتوى التعليمي والتقني</b>
            <p style="font-size:12px; color:var(--text-dim); margin:4px 0 0;">
              وثق رحلة تعلمك على لينكدإن ويوتيوب. المحرك TAFRA بيوفر لك 4,175 فكرة جاهزة بالسكريبتات والهوكس.
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:12px;">
            <b style="color:var(--purple);">3. بناء بورتفوليو حقيقي (Case Studies)</b>
            <p style="font-size:12px; color:var(--text-dim); margin:4px 0 0;">
              حل مشاكل حقيقية لشركات أو مبادرات طلابية واعرض النتيجة كدراسة حالة قبل التخرج.
            </p>
          </div>
        </div>

        <div style="margin-top:22px;">
          <button class="btn btn-primary" onclick="window.FocusAudio.playClick(); window.APP.openPage('tafra')">
            ✦ استكشف بنك الـ 4,175 فكرة محتوى في TAFRA ENGINE
          </button>
        </div>
      </div>

      <div class="panel">
        <span class="panel-kicker" style="color:var(--purple);">COLLEGE BALANCE RULES</span>
        <h3 style="margin-top:4px;">قواعد الموازنة الذهبية للشباب الجامعي</h3>
        <ul style="padding-right:20px; font-size:13px; line-height:1.8; color:#e2e8f0; margin-top:14px;">
          <li><b>قاعدة 70/30:</b> 70% من مجهود الأسبوع للمذاكرة والامتحانات، و30% للمهارات والعمل الحر.</li>
          <li><b>فصل الفصول عن الصيف:</b> استغل الإجازات الصيفية للتعمق الشامل في بناء المشاريع والتدريبات.</li>
          <li><b>لا تدرس للامتحان ليلة الامتحان فقط:</b> التكرار المتباعد يوفر 80% من وقت المذاكرة ويمنع التوتر.</li>
          <li><b>بناء شبكة معارف حقيقية:</b> زمايلك في الكلية هما شركاء عملك وعملاؤك في المستقبل.</li>
          <li><b>حماية النوم والصحة:</b> قلة النوم تدمر الخلايا العصبية المسؤولة عن حل المشكلات المعقدة.</li>
        </ul>

        <div style="margin-top:22px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:16px; border-radius:12px;">
          <b style="color:var(--emerald);">نصيحة المنظومة:</b>
          <p style="font-size:12px; color:#cbd5e1; margin:4px 0 0;">
            «من المعرفة إلى الفعل، ومن الفعل إلى الإتقان». لا تكتفِ بتجميع الكورسات وقراءة النصائح، أنجز شيئاً واحداً صغيراً اليوم.
          </p>
        </div>
      </div>
    </div>
    `;
  }

  // =========================================================================
  // 6. EVENT BINDINGS FOR STUDENT HUB
  // =========================================================================
  function bindStudentHubEvents(activeTab) {
    document.querySelectorAll(".student-tab-btn").forEach(b => {
      b.onclick = () => {
        audio.playClick();
        const s = getStudentState();
        s.activeSubTab = b.dataset.stab;
        saveStudentState(s);
        renderStudentHub();
      };
    });

    if (activeTab === "study") {
      document.querySelectorAll(".preset-chip").forEach(c => {
        c.onclick = () => setStudyPreset(Number(c.dataset.min));
      });

      const startBtn = document.getElementById("studyTimerStartBtn");
      if (startBtn) startBtn.onclick = toggleStudyTimer;

      const resetBtn = document.getElementById("studyTimerResetBtn");
      if (resetBtn) resetBtn.onclick = resetStudyTimer;

      const zenBtn = document.getElementById("openZenBtn");
      if (zenBtn) zenBtn.onclick = openZenMode;

      // Audio buttons
      document.querySelectorAll(".sound-track-btn").forEach(b => {
        b.onclick = () => {
          audio.playClick();
          const track = b.dataset.track;
          if (audio.currentTrack === track) {
            audio.stop();
          } else {
            if (track === "brown") audio.playBrownNoise();
            else if (track === "rain") audio.playRain();
            else if (track === "binaural") audio.play40HzTone();
          }
        };
      });

      const stopBtn = document.getElementById("stopAudioBtn");
      if (stopBtn) stopBtn.onclick = () => { audio.playClick(); audio.stop(); };

      const slider = document.getElementById("audioVolumeSlider");
      if (slider) {
        slider.oninput = e => {
          const v = Number(e.target.value);
          audio.setVolume(v);
          const lbl = document.getElementById("volLabel");
          if (lbl) lbl.textContent = `${Math.round(v * 100)}%`;
        };
      }

      // Session tasks
      document.querySelectorAll(".session-task-checkbox").forEach(box => {
        box.onchange = e => {
          const id = Number(e.target.dataset.taskid);
          const s = getStudentState();
          const task = (s.sessionTasks || []).find(t => t.id === id);
          if (task) {
            task.done = e.target.checked;
            saveStudentState(s);
            if (task.done) {
              addXP(10, `إنجاز مهمة مصغرة: ${task.text}`);
            } else {
              audio.playClick();
            }
            renderStudentHub();
          }
        };
      });

      const addTaskBtn = document.getElementById("addSessionTaskBtn");
      if (addTaskBtn) {
        addTaskBtn.onclick = () => {
          const input = document.getElementById("newSessionTaskInput");
          const val = input?.value?.trim();
          if (!val) return;
          audio.playClick();
          const s = getStudentState();
          s.sessionTasks = s.sessionTasks || [];
          s.sessionTasks.push({ id: Date.now(), text: val, done: false });
          saveStudentState(s);
          renderStudentHub();
        };
      }
    }

    if (activeTab === "sos") {
      const breathBtn = document.getElementById("startBreathingBtn");
      if (breathBtn) breathBtn.onclick = runBreathingCycle;

      const launchSosBtn = document.getElementById("launchSosTimerBtn");
      if (launchSosBtn) {
        launchSosBtn.onclick = () => {
          audio.playClick();
          const s = getStudentState();
          s.sosCount = (s.sosCount || 0) + 1;
          s.activeSosStep = 1;
          saveStudentState(s);
          addXP(30, "كسر حاجز التسويف بنجاح!");

          s.activeSubTab = "study";
          saveStudentState(s);
          renderStudentHub();
          setStudyPreset(5);
          startStudyTimer();
          audio.playRain();
        };
      }
    }

    if (activeTab === "syllabus") {
      const addForm = document.getElementById("addCourseForm");
      if (addForm) {
        addForm.onsubmit = e => {
          e.preventDefault();
          audio.playClick();
          const name = document.getElementById("courseNameInput").value.trim();
          const total = Number(document.getElementById("courseTotalInput").value);
          const date = document.getElementById("courseDateInput").value;

          if (!name || !total || !date) return;

          const s = getStudentState();
          s.courses = s.courses || [];
          s.courses.push({
            id: Date.now(),
            name,
            totalPages: total,
            completedPages: 0,
            examDate: date
          });
          saveStudentState(s);
          addXP(25, `إضافة وتفكيك مقرر: ${name}`);
          renderStudentHub();
        };
      }
    }
  }

  // --- Breathing Exercise Animation ---
  let breathingActive = false;
  function runBreathingCycle() {
    if (breathingActive) return;
    breathingActive = true;
    audio.playClick();

    const ring = document.getElementById("breathingRing");
    const text = document.getElementById("breathingText");
    const btn = document.getElementById("startBreathingBtn");
    if (btn) btn.disabled = true;

    let cycle = 1;
    function doCycle() {
      if (cycle > 3) {
        breathingActive = false;
        if (text) text.textContent = "أحسنت! جهازك العصبي جاهز الآن 🌿";
        if (ring) ring.className = "breathing-glow-ring";
        if (btn) {
          btn.disabled = false;
          btn.textContent = "إعادة تمرين التنفس";
        }
        addXP(15, "جلسة زفير فسيولوجي مهدئة");
        return;
      }

      if (text) text.textContent = `دورة ${cycle}/3: خذ شهيقاً عميقاً بالأنف (4 ثوانٍ)`;
      if (ring) ring.className = "breathing-glow-ring inhale";

      setTimeout(() => {
        if (text) text.textContent = "شهيق إضافي سريع واحبس النفس (ثانيتان)";
        if (ring) ring.className = "breathing-glow-ring hold";

        setTimeout(() => {
          if (text) text.textContent = "زفير بطيء وطويل جداً بالفم (6 ثوانٍ)";
          if (ring) ring.className = "breathing-glow-ring exhale";

          setTimeout(() => {
            cycle++;
            doCycle();
          }, 6000);
        }, 2000);
      }, 4000);
    }

    doCycle();
  }

  // --- Course Progression Helpers ---
  window.incrementCourseProgress = function(id) {
    audio.playClick();
    const s = getStudentState();
    const c = (s.courses || []).find(x => x.id === id);
    if (c) {
      c.completedPages = Math.min(c.totalPages, c.completedPages + 5);
      saveStudentState(s);
      addXP(15, `إنجاز وحدات في مقرر: ${c.name}`);
      renderStudentHub();
    }
  };

  window.deleteCourse = function(id) {
    audio.playClick();
    if (!confirm("هل أنت متأكد من حذف هذا المقرر؟")) return;
    const s = getStudentState();
    s.courses = (s.courses || []).filter(x => x.id !== id);
    saveStudentState(s);
    renderStudentHub();
  };

  // --- Flashcard Rating Helper ---
  window.rateCard = function(score) {
    audio.playClick();
    const s = getStudentState();
    const cards = s.flashcards || [];
    const card = cards[currentCardIndex % (cards.length || 1)];

    if (card) {
      if (score === 3) addXP(20, "استرجاع ممتاز للبطاقة!");
      else if (score === 2) addXP(10, "استرجاع متوسط للبطاقة");
      else addXP(5, "إعادة مراجعة البطاقة");
    }

    currentCardIndex = (currentCardIndex + 1) % (cards.length || 1);
    const cardElem = document.getElementById("activeRecallCard");
    if (cardElem) cardElem.classList.remove("flipped");
    renderStudentHub();
  };

  // =========================================================================
  // 7. ZEN FULLSCREEN MODE
  // =========================================================================
  function openZenMode() {
    audio.playClick();
    const modal = document.getElementById("zenModal");
    if (!modal) return;
    modal.classList.add("active", "open");

    const input = document.getElementById("studyTaskInput");
    const zenTitle = document.getElementById("zenTaskTitle");
    if (zenTitle) zenTitle.textContent = input?.value?.trim() || "المهمة الحالية قيد الإنجاز العميق";

    updateStudyTimerUI();
    if (!studyRunning) startStudyTimer();
  }

  function closeZenMode() {
    audio.playClick();
    const modal = document.getElementById("zenModal");
    if (modal) modal.classList.remove("active", "open");
  }

  // =========================================================================
  // 8. TELEPROMPTER FOR CREATORS
  // =========================================================================
  let prompterRunning = false;
  let prompterTimer = null;

  function openTeleprompter(title, text) {
    audio.playClick();
    const modal = document.getElementById("teleprompterModal");
    const titleEl = document.getElementById("prompterTitle");
    const textEl = document.getElementById("prompterText");
    if (!modal || !textEl) return;

    if (titleEl) titleEl.textContent = title || "ملقن الكاميرا";
    textEl.innerHTML = text.replace(/\n/g, "<br><br>");
    modal.classList.add("active", "open");
  }
  window.openTeleprompter = openTeleprompter;

  function togglePrompterScroll() {
    audio.playClick();
    const body = document.getElementById("prompterBody");
    const playBtn = document.getElementById("prompterPlayBtn");
    if (!body) return;

    if (prompterRunning) {
      prompterRunning = false;
      clearInterval(prompterTimer);
      if (playBtn) playBtn.textContent = "▶️ تشغيل";
    } else {
      prompterRunning = true;
      if (playBtn) playBtn.textContent = "⏸️ إيقاف";
      const speed = Number(document.getElementById("prompterSpeed")?.value || 3);
      prompterTimer = setInterval(() => {
        body.scrollTop += speed;
      }, 40);
    }
  }

  // =========================================================================
  // 9. THEME TOGGLER (Dark / Light / Neo Cycling)
  // =========================================================================
  function syncThemeUI(theme) {
    const themeBtn = document.getElementById("themeToggleBtn");
    const dockTheme = document.getElementById("dockThemeBtn");
    const icons = { dark: "🌙", light: "☀️", neo: "⚡" };
    const labels = { dark: "DARK", light: "LIGHT", neo: "NEO" };
    const titles = {
      dark: "الوضع الليلي الكلاسيكي (Dark)",
      light: "الوضع النهاري المضيء (Light)",
      neo: "وضع النيون التفاعلي السايبربانك (Neo Glow)"
    };

    if (themeBtn) {
      themeBtn.setAttribute("title", titles[theme] || titles.dark);
      const iconSpan = themeBtn.querySelector(".theme-icon");
      if (iconSpan) {
        iconSpan.textContent = icons[theme] || "🌙";
      }
      const labelSpan = themeBtn.querySelector(".theme-label");
      if (labelSpan) {
        labelSpan.textContent = labels[theme] || "DARK";
      }
    }
    if (dockTheme) {
      dockTheme.setAttribute("title", titles[theme] || titles.dark);
    }
  }

  function initTheme() {
    const saved = localStorage.getItem("focus_app_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    syncThemeUI(saved);
  }

  function toggleTheme() {
    if (audio && audio.playClick) audio.playClick();
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("focus_app_theme", next);
    syncThemeUI(next);
  }

  // =========================================================================
  // 10. GLOBAL BINDINGS
  // =========================================================================
  
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
    const headerBtn = document.getElementById("headerAudioBtn");
    const bentoBars = document.getElementById("bentoAudioBars");
    const bentoBtn = document.getElementById("bentoAudioToggleBtn");
    const heroCapsule = document.getElementById("heroCapsuleAudio");
    const audioTrackLabel = document.getElementById("audioTrackName");
    const isPlaying = !!(window.FocusAudio && window.FocusAudio.currentTrack);

    if (headerBtn) {
      headerBtn.classList.toggle("playing", isPlaying);
    }
    if (audioTrackLabel) {
      const names = { binaural: "موجات 40Hz", brown: "ضوضاء بنية", rain: "صوت المطر" };
      audioTrackLabel.textContent = isPlaying ? (names[window.FocusAudio.currentTrack] || "الصوت الحي") : "أصوات 40Hz";
    }
    if (bentoBars) {
      bentoBars.classList.toggle("active", isPlaying);
    }
    if (bentoBtn) {
      bentoBtn.innerHTML = isPlaying ? '<span>⏹ إيقاف الصوت الحي</span>' : '<span>🎧 تشغيل الصوت الحي</span>';
    }
    if (heroCapsule) {
      heroCapsule.classList.toggle("playing", isPlaying);
      const chip = heroCapsule.querySelector(".capsule-chip-live");
      if (chip) chip.textContent = isPlaying ? "● يعمل الآن" : "● حي";
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


  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    updateStudentBanner();

    const audioBtn = document.getElementById("headerAudioBtn");
    if (audioBtn) {
      audioBtn.onclick = () => {
        audio.playClick();
        if (audio.currentTrack) {
          audio.stop();
        } else {
          audio.playRain();
        }
      };
    }

    const sosBtn = document.getElementById("headerSosBtn");
    if (sosBtn) {
      sosBtn.onclick = () => {
        audio.playClick();
        if (window.APP?.openPage) window.APP.openPage("student");
        const s = getStudentState();
        s.activeSubTab = "sos";
        s.activeSosStep = 1;
        saveStudentState(s);
        renderStudentHub();
      };
    }

    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) themeBtn.onclick = toggleTheme;

    const closeZenBtn = document.getElementById("closeZenBtn");
    if (closeZenBtn) closeZenBtn.onclick = closeZenMode;

    const zenToggleBtn = document.getElementById("zenToggleBtn");
    if (zenToggleBtn) zenToggleBtn.onclick = toggleStudyTimer;

    const zenResetBtn = document.getElementById("zenResetBtn");
    if (zenResetBtn) zenResetBtn.onclick = resetStudyTimer;

    const pClose = document.getElementById("prompterCloseBtn");
    if (pClose) pClose.onclick = () => {
      audio.playClick();
      document.getElementById("teleprompterModal")?.classList.remove("active", "open");
      if (prompterRunning) togglePrompterScroll();
    };

    const pPlay = document.getElementById("prompterPlayBtn");
    if (pPlay) pPlay.onclick = togglePrompterScroll;

    const pMirror = document.getElementById("prompterMirrorBtn");
    if (pMirror) pMirror.onclick = () => {
      audio.playClick();
      const text = document.getElementById("prompterText");
      if (text) text.style.transform = text.style.transform ? "" : "scaleX(-1)";
    };

    const pFont = document.getElementById("prompterFontSize");
    if (pFont) pFont.oninput = e => {
      const text = document.getElementById("prompterText");
      if (text) text.style.fontSize = `${e.target.value}px`;
    };

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeZenMode();
        document.getElementById("teleprompterModal")?.classList.remove("active", "open");
        if (prompterRunning) togglePrompterScroll();
      }
    });

    
    
  // =========================================================================
  // 12. BENTO & STUDIO HERO CONTROLLERS (SHOWREEL & MYSTACK)
  // =========================================================================
  function initBentoAndHero() {
    const heroAudioCapsule = document.getElementById("heroCapsuleAudio");
    if (heroAudioCapsule) {
      heroAudioCapsule.onclick = () => {
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
    const heroWorkflowBtn = document.getElementById("heroScrollWorkflowBtn");
    if (heroWorkflowBtn) {
      heroWorkflowBtn.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        const hub = document.getElementById("interactiveWorkflowHub");
        if (hub) hub.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    }

    const bentoAudioBtn = document.getElementById("bentoAudioToggleBtn");
    if (bentoAudioBtn) {
      bentoAudioBtn.onclick = () => {
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

    const bentoSosBtn = document.getElementById("bentoSosLaunchBtn");
    if (bentoSosBtn) {
      bentoSosBtn.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        if (window.APP?.openPage) window.APP.openPage("student");
        const s = getStudentState();
        s.activeSubTab = "sos";
        s.activeSosStep = 1;
        saveStudentState(s);
        renderStudentHub();
      };
    }

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    if (mobileMenuBtn) {
      mobileMenuBtn.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        document.getElementById("sidebar")?.classList.toggle("open");
      };
    }

    const heroFullscreenBtn = document.getElementById("heroFullscreenBtn");
    const heroSection = document.querySelector(".studio-hero-section") || document.querySelector(".hero-section");
    if (heroFullscreenBtn && heroSection) {
      heroFullscreenBtn.onclick = () => {
        if (window.FocusAudio) window.FocusAudio.playClick();
        if (!document.fullscreenElement) {
          if (heroSection.requestFullscreen) {
            heroSection.requestFullscreen().catch(() => {});
          } else if (heroSection.webkitRequestFullscreen) {
            heroSection.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      };

      const syncFsState = () => {
        const isFs = !!document.fullscreenElement;
        heroSection.classList.toggle("is-fullscreen", isFs);
        const iconUse = heroFullscreenBtn.querySelector("use");
        if (iconUse) {
          const iconId = isFs ? "#icon-minimize" : "#icon-maximize";
          iconUse.setAttribute("xlink:href", iconId);
          iconUse.setAttribute("href", iconId);
        }
        heroFullscreenBtn.setAttribute("title", isFs ? "الخروج من الشاشة الكاملة (Esc)" : "ملء الشاشة للتركيز الشامل");
      };

      document.addEventListener("fullscreenchange", syncFsState);
      document.addEventListener("webkitfullscreenchange", syncFsState);
    }
  }

  // Hook into updateAudioVisualizers to sync bentoAudioBars
  const originalUpdateVisualizers = updateAudioVisualizers;
  updateAudioVisualizers = function() {
    originalUpdateVisualizers();
    const bentoBars = document.getElementById("bentoAudioBars");
    const bentoBtn = document.getElementById("bentoAudioToggleBtn");
    const isPlaying = !!(window.FocusAudio && window.FocusAudio.currentTrack);
    
    if (bentoBars) {
      if (isPlaying) bentoBars.classList.add("active");
      else bentoBars.classList.remove("active");
    }
    if (bentoBtn) {
      bentoBtn.innerHTML = isPlaying ? 
        `<span>⏹ إيقاف الصوت (${window.FocusAudio.currentTrack === "binaural" ? "40Hz" : "المطر"})</span>` : 
        `<span>🎧 تشغيل الصوت الحي</span>`;
    }
  };

    initBentoAndHero();
    initWorkflowHub();
    initSolFloatingDock();
    initSpotlightTracker();
    renderStudentHub();
    
    // Periodically sync equalizer
    setInterval(updateAudioVisualizers, 800);

    document.querySelectorAll(".mobile-nav-pill").forEach(p => {
      p.onclick = () => {
        audio.playClick();
        document.querySelectorAll(".mobile-nav-pill").forEach(x => x.classList.remove("active"));
        p.classList.add("active");
        if (window.APP?.openPage) window.APP.openPage(p.dataset.page);
      };
    });
  });

})();
