import os

js_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/student-hub.js'
with open(js_path, 'r', encoding='utf-8') as f:
    code = f.read()

bento_events = '''
  // =========================================================================
  // 12. BENTO & STUDIO HERO CONTROLLERS (SHOWREEL & MYSTACK)
  // =========================================================================
  function initBentoAndHero() {
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
'''

if "initBentoAndHero" not in code:
    insertion_marker = 'initWorkflowHub();'
    if insertion_marker in code:
        code = code.replace(insertion_marker, bento_events + "\n    initBentoAndHero();\n    " + insertion_marker)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(code)
        print("student-hub.js updated with Bento & Hero controllers!")
    else:
        print("insertion marker not found!")
else:
    print("initBentoAndHero already present!")

