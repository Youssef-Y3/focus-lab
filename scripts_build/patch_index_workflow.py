import re

index_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Target the system-panel to replace with the Interactive Workflow Hub and Manifesto
manifesto_and_hub_html = '''
<div class="editorial-manifesto-card spotlight-card">
  <div class="editorial-kicker">[ HUMAN BENCHMARK // AXIOM // ذوق وانضباط ]</div>
  <blockquote class="editorial-quote">
    «التركيز ليس مجرد حجبٍ للمشتتات؛ بل هو فنّ اختيار المعركة التي تستحق استثمار عمرك فيها، وتحويل المعرفة الراكدة إلى أثرٍ حقيقيٍ وفعلٍ يوميٍ متراكم.»
  </blockquote>
  <div class="editorial-author-row">
    <span class="author-avatar">◈</span>
    <span class="author-name">FOCUS LAB × TAFRA</span>
    <span class="author-dot">·</span>
    <span class="author-spec">STUDIO EDITION 2026</span>
    <span class="author-benchmark">100% HUMAN-VERIFIED RIGOR</span>
  </div>
</div>

<div class="interactive-workflow-hub spotlight-card" id="interactiveWorkflowHub">
  <div class="workflow-hub-header">
    <div class="workflow-hub-title">
      <div class="hub-icon">⚡</div>
      <div>
        <div class="eyebrow" style="margin-bottom:0;">THE OPERATING PIPELINE // مسار العمل التفاعلي</div>
        <h3>محرك سير العمل الذكي</h3>
        <p>اختر مسارك لتنشيط الخطوات التكتيكية، تشغيل الأدوات، ومتابعة الإنجاز لحظياً.</p>
      </div>
    </div>
    <div class="flow-mode-switch" id="flowModeSwitch">
      <button class="flow-mode-btn active" id="btnStudentFlow" data-flow="student">
        <span>🎓</span>
        <span>مسار الطالب والشباب</span>
      </button>
      <button class="flow-mode-btn" id="btnCreatorFlow" data-flow="creator">
        <span>✦</span>
        <span>مسار الماستري والصانع</span>
      </button>
    </div>
  </div>

  <div class="workflow-pipeline-track" id="workflowTrack">
    <!-- Populated dynamically by JavaScript -->
  </div>

  <div class="workflow-inspector-card" id="workflowInspector">
    <!-- Populated dynamically by JavaScript -->
  </div>
</div>
'''

# Find the start of system-panel and its end
start_idx = html.find('<div class="panel system-panel">')
if start_idx != -1:
    # Find matching closing div for system-panel
    # It contains "CONNECTED ECOSYSTEM"
    end_marker = '<div class="panel next-panel">'
    end_idx = html.find(end_marker, start_idx)
    if end_idx != -1:
        # replace system-panel block
        html = html[:start_idx] + manifesto_and_hub_html + "\n" + html[end_idx:]
        print("Replaced system-panel successfully with Interactive Workflow Hub & Manifesto!")
    else:
        print("Error finding end_marker")
else:
    print("system-panel not found, checking if already replaced...")

# 2. Add Sol Floating Dock before </div>\n</main> or before </body>
sol_dock_html = '''
<nav class="sol-floating-dock" id="solFloatingDock">
  <button class="dock-pill-btn active" id="dockWorkflowBtn" title="محرك سير العمل التفاعلي">
    <span class="dock-icon">⚡</span>
    <span class="dock-label">سير العمل</span>
  </button>
  <div class="dock-divider"></div>
  <button class="dock-pill-btn" id="dockAudioBtn" title="تشغيل أصوات التركيز 40Hz">
    <span class="dock-soundwave" id="dockSoundwave"><i class="bar"></i><i class="bar"></i><i class="bar"></i><i class="bar"></i></span>
    <span class="dock-label" id="dockAudioLabel">الصوت الحي</span>
  </button>
  <button class="dock-pill-btn" id="dockZenBtn" title="الوضع الصامت بدون مشتتات">
    <span class="dock-icon">🧘</span>
    <span class="dock-label">وضع الزن</span>
  </button>
  <button class="dock-pill-btn" id="dockSosBtn" title="طوارئ التسويف الفورية">
    <span class="dock-icon">🚨</span>
    <span class="dock-label">طوارئ SOS</span>
  </button>
  <div class="dock-divider"></div>
  <button class="dock-pill-btn" id="dockSearchBtn" title="البحث السريع (⌘K)">
    <span class="dock-icon">⌕</span>
    <kbd>⌘K</kbd>
  </button>
  <button class="dock-pill-btn" id="dockThemeBtn" title="تبديل الإضاءة">
    <span class="dock-icon">🌓</span>
  </button>
</nav>
'''

if 'id="solFloatingDock"' not in html:
    pos = html.rfind('</div><!-- .app-shell -->')
    if pos == -1:
        pos = html.rfind('</div>\n</main>')
    if pos == -1:
        pos = html.rfind('</body>')
    html = html[:pos] + sol_dock_html + "\n" + html[pos:]
    print("Added solFloatingDock successfully!")
else:
    print("solFloatingDock already exists!")

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated successfully!")
