import os

css_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update font import
old_font_import = "@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');"
new_font_import = "@import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..800;1,8..60,400..700&family=JetBrains+Mono:wght@400;500;700;800&family=Space+Mono:wght@400;700&display=swap');"

if old_font_import in css:
    css = css.replace(old_font_import, new_font_import)
else:
    print("Warning: old_font_import not directly matched, checking @import...")

# Add enhanced styles to modern.css
enhancements = """

/* ==========================================================================
   STUDIO 2026 ENHANCEMENTS: CONTRALABS, SHOWREEL, HELLOSOL, FRECKLE & LEE HOLMES
   ========================================================================== */

:root {
  --font-display: 'Alexandria', 'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Cairo', system-ui, sans-serif;
  --font-editorial: 'Source Serif 4', 'Cairo', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Space Mono', monospace;
  
  --solar-amber: #ff6b00;
  --solar-gold: #f59e0b;
  --solar-glow: rgba(255, 107, 0, 0.32);
  --cyber-cyan: #00f0ff;
  --cyber-cyan-glow: rgba(0, 240, 255, 0.35);
  --acid-emerald: #00ff9d;
  --acid-emerald-glow: rgba(0, 255, 157, 0.35);
  --astral-purple: #8b5cf6;
  --astral-purple-glow: rgba(139, 92, 246, 0.35);
  --editorial-cream: #fef3c7;
  --danger-rose: #f43f5e;
  
  --spring-ease: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ==========================================================================
   SPOTLIGHT CURSOR REFLECTION (FRAMER / LINEAR / CONTRALABS STYLE)
   ========================================================================== */
.spotlight-card, .panel, .hero-panel, .tool-card, .metric-card, .book-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.32s var(--spring-ease), box-shadow 0.32s var(--spring-ease), border-color 0.32s var(--spring-ease);
}

.spotlight-card::before, .panel::before, .hero-panel::before, .tool-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: inherit;
  background: radial-gradient(450px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(0, 240, 255, 0.09), transparent 42%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 1;
}

.spotlight-card:hover::before, .panel:hover::before, .hero-panel:hover::before, .tool-card:hover::before {
  opacity: 1;
}

/* Typographic Flourishes */
h1, h2, h3, .brand-name, .hero-copy h1, .section-heading h2 {
  font-family: var(--font-display) !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em !important;
}

.hero-copy h1 em, .editorial-quote, .philosophy-quote {
  font-family: var(--font-editorial) !important;
  font-style: italic !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #fef3c7 20%, #f59e0b 60%, #ff6b00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* ==========================================================================
   INTERACTIVE WORKFLOW OPERATING SYSTEM (THE DIGITAL THIRD / CONTRALABS / HELLOSOL)
   ========================================================================== */
.interactive-workflow-hub {
  background: linear-gradient(145deg, rgba(13, 17, 28, 0.88), rgba(7, 10, 18, 0.96));
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 32px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.workflow-hub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 26px;
  flex-wrap: wrap;
}

.workflow-hub-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.workflow-hub-title .hub-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.22), rgba(0, 240, 255, 0.16));
  border: 1px solid rgba(255, 107, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--solar-amber);
  box-shadow: 0 0 25px var(--solar-glow);
}

.workflow-hub-title h3 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #ffffff;
}

.workflow-hub-title p {
  margin: 3px 0 0 0;
  font-size: 13px;
  color: var(--text-dim);
  font-family: var(--font-body);
}

/* Mode Switcher (Pill Style) */
.flow-mode-switch {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 4px;
  gap: 4px;
}

.flow-mode-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.25s var(--spring-ease);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.flow-mode-btn:hover {
  color: var(--text-main);
}

.flow-mode-btn.active {
  background: linear-gradient(135deg, var(--solar-amber), var(--solar-gold));
  color: #000000;
  font-weight: 800;
  box-shadow: 0 4px 18px var(--solar-glow);
}

.flow-mode-btn.active.creator-mode {
  background: linear-gradient(135deg, var(--cyber-cyan), var(--acid-emerald));
  box-shadow: 0 4px 18px var(--cyber-cyan-glow);
}

/* Visual Pulse Pipeline Track */
.workflow-pipeline-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  z-index: 2;
}

.workflow-step-node {
  background: rgba(18, 24, 38, 0.72);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: all 0.26s var(--spring-ease);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.workflow-step-node:hover {
  background: rgba(26, 35, 54, 0.92);
  border-color: var(--cyber-cyan);
  transform: translateY(-4px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.55);
}

.workflow-step-node.active {
  border-color: var(--cyber-cyan);
  background: linear-gradient(145deg, rgba(0, 240, 255, 0.14), rgba(139, 92, 246, 0.09));
  box-shadow: 0 0 35px rgba(0, 240, 255, 0.28);
}

.workflow-step-node.completed {
  border-color: var(--acid-emerald);
}

.node-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.node-number-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-dim);
}

.workflow-step-node.active .node-number-pill {
  background: var(--cyber-cyan);
  color: #000000;
  box-shadow: 0 0 12px var(--cyber-cyan-glow);
}

.workflow-step-node.completed .node-number-pill {
  background: var(--acid-emerald);
  color: #000000;
}

.node-status-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.workflow-step-node.active .node-status-tag {
  color: var(--cyber-cyan);
  font-weight: 700;
}

.node-title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.4;
}

.node-desc {
  margin: 0;
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.5;
}

/* Step Inspector Detail Card */
.workflow-inspector-card {
  background: rgba(9, 12, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: 26px;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 24px;
  align-items: center;
  position: relative;
  z-index: 2;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

@media (max-width: 800px) {
  .workflow-inspector-card {
    grid-template-columns: 1fr;
  }
}

.inspector-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.inspector-badge {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(0, 240, 255, 0.15);
  color: var(--cyber-cyan);
  border: 1px solid rgba(0, 240, 255, 0.35);
}

.inspector-duration {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 4px;
}

.inspector-heading {
  margin: 0 0 10px 0;
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
}

.inspector-philosophy {
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 14px;
  color: var(--editorial-cream);
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.inspector-bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inspector-bullets li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-main);
}

.inspector-bullets li span {
  color: var(--cyber-cyan);
  font-weight: 800;
}

.inspector-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.btn-launch-step {
  background: linear-gradient(135deg, var(--solar-amber), var(--solar-gold));
  color: #000000;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
  border: none;
  border-radius: var(--radius-md);
  padding: 14px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 24px var(--solar-glow);
  transition: all 0.25s var(--spring-ease);
}

.btn-launch-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 107, 0, 0.5);
}

.btn-complete-step {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.2s var(--spring-ease);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-complete-step:hover {
  background: rgba(0, 255, 157, 0.12);
  border-color: var(--acid-emerald);
  color: var(--acid-emerald);
}

.btn-complete-step.is-done {
  background: rgba(0, 255, 157, 0.22);
  border-color: var(--acid-emerald);
  color: var(--acid-emerald);
}

/* ==========================================================================
   CONTRALABS & LEE HOLMES EDITORIAL MANIFESTO CARD
   ========================================================================== */
.editorial-manifesto-card {
  background: linear-gradient(145deg, rgba(16, 20, 32, 0.85), rgba(9, 12, 20, 0.96));
  border: 1px solid rgba(245, 158, 11, 0.28);
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  margin-bottom: 28px;
  position: relative;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.65), 0 0 35px rgba(245, 158, 11, 0.08);
}

.editorial-manifesto-card .editorial-kicker {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--solar-gold);
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

.editorial-quote {
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: 20px;
  line-height: 1.7;
  color: #fef3c7;
  margin: 0 0 18px 0;
  padding: 0;
  border: none;
}

.editorial-author-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-dim);
  font-family: var(--font-mono);
  flex-wrap: wrap;
}

.editorial-author-row .author-avatar {
  color: var(--solar-amber);
  font-size: 16px;
}

.editorial-author-row .author-benchmark {
  margin-right: auto;
  font-size: 10px;
  background: rgba(0, 255, 157, 0.12);
  border: 1px solid rgba(0, 255, 157, 0.3);
  color: var(--acid-emerald);
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  letter-spacing: 0.05em;
}

/* ==========================================================================
   HELLOSOL & SHOWREEL FLOATING ISLAND GLASS DOCK
   ========================================================================== */
.sol-floating-dock {
  position: fixed;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 14, 24, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1000;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.88), 0 0 35px rgba(0, 240, 255, 0.15);
  backdrop-filter: blur(24px) saturate(190%);
  animation: dockFloatIn 0.6s var(--spring-ease);
}

@keyframes dockFloatIn {
  from {
    opacity: 0;
    transform: translate(-50%, 25px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

.dock-pill-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.22s var(--spring-ease);
  position: relative;
  white-space: nowrap;
}

.dock-pill-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transform: translateY(-2px);
}

.dock-pill-btn:active {
  transform: translateY(0);
}

.dock-pill-btn.active {
  background: rgba(0, 240, 255, 0.16);
  color: var(--cyber-cyan);
  border: 1px solid rgba(0, 240, 255, 0.35);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.25);
}

.dock-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

.dock-pill-btn kbd {
  font-family: var(--font-mono);
  font-size: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--text-dim);
}

/* Equalizer in Dock & Header */
.dock-soundwave {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  width: 16px;
  height: 14px;
}

.dock-soundwave .bar {
  width: 2.5px;
  height: 4px;
  background: var(--cyber-cyan);
  border-radius: 1px;
  transition: height 0.2s ease;
}

.dock-soundwave.playing .bar:nth-child(1) { animation: eqBar 0.6s infinite alternate; }
.dock-soundwave.playing .bar:nth-child(2) { animation: eqBar 0.9s infinite alternate 0.15s; }
.dock-soundwave.playing .bar:nth-child(3) { animation: eqBar 0.7s infinite alternate 0.3s; }
.dock-soundwave.playing .bar:nth-child(4) { animation: eqBar 0.8s infinite alternate 0.45s; }

@keyframes eqBar {
  0% { height: 3px; }
  100% { height: 14px; }
}

@media (max-width: 768px) {
  .sol-floating-dock {
    bottom: 12px;
    padding: 6px 10px;
    gap: 4px;
  }
  .dock-pill-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  .dock-label {
    display: none;
  }
}
"""

if "/* STUDIO 2026 ENHANCEMENTS" not in css:
    css = css + "\n" + enhancements
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("modern.css successfully enhanced!")
else:
    print("modern.css already contains enhancements, updating...")
    # remove and replace
    parts = css.split("/* STUDIO 2026 ENHANCEMENTS")
    css = parts[0].strip() + "\n" + enhancements
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("modern.css successfully re-written!")
