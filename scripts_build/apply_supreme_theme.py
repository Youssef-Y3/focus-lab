# Script to generate the comprehensive color and typography overhaul
css_additions = """
/* ==========================================================================
   SUPREME LUXURY EDITION: IBM PLEX SANS ARABIC & LUXURY OBSIDIAN PALETTE
   Ultra-clean typography, curated luxury colors, zero murky tones.
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  /* Ultra-Deep Obsidian Void (Clean, Neutral, Never Murky) */
  --bg-deep: #090b10;
  --bg-surface: #0f131d;
  --bg-card: rgba(17, 22, 33, 0.82);
  --bg-card-hover: rgba(24, 30, 46, 0.94);
  --bg-glass: rgba(13, 17, 26, 0.88);
  
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-hover: rgba(245, 158, 11, 0.4);
  --border-focus: rgba(56, 189, 248, 0.5);
  
  /* Text System */
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --text-muted: #64748b;
  
  /* Curated Harmonious Palette (Warm Gold & Ice Blue) */
  --amber: #f59e0b;
  --amber-light: #fbbf24;
  --amber-dark: #d97706;
  --amber-glow: rgba(245, 158, 11, 0.28);
  
  --cyan: #38bdf8;
  --cyan-glow: rgba(56, 189, 248, 0.28);
  
  --emerald: #10b981;
  --emerald-glow: rgba(16, 185, 129, 0.25);
  
  --rose: #f43f5e;
  --rose-glow: rgba(244, 63, 94, 0.25);
  
  --font-main: 'IBM Plex Sans Arabic', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Sans Arabic', monospace;
  
  --spring-ease: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ==========================================================================
   GLOBAL TYPOGRAPHY ENFORCEMENT (IBM PLEX SANS ARABIC)
   ========================================================================== */
*, body, button, input, select, textarea, h1, h2, h3, h4, h5, h6, p, span, a, label, div {
  font-family: var(--font-main) !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code, kbd, pre, .mono, [class*="ticker"], [class*="badge"], .step-no, .pill-num, .item-value, .stat-pill, .bento-tag, small, .brand-sub-top {
  font-family: var(--font-mono) !important;
}

h1, h2, h3, h4 {
  color: var(--text-main) !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em !important;
}

body {
  background-color: var(--bg-deep) !important;
  color: var(--text-main) !important;
  background-image: 
    radial-gradient(circle at 15% 10%, rgba(245, 158, 11, 0.05) 0%, transparent 45%),
    radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.04) 0%, transparent 42%),
    radial-gradient(circle at 50% 85%, rgba(139, 92, 246, 0.03) 0%, transparent 50%) !important;
  background-size: 100% 100% !important;
  background-attachment: fixed !important;
}

/* ==========================================================================
   COMPLETE OVERRIDE OF ALL LEGACY MURKY TEAL/NAVY CARDS & PANELS
   ========================================================================== */
.panel, 
.card, 
.metric-card, 
.tool-card, 
.book-card, 
.bank-card, 
.data-card, 
.detail-panel,
.journey-stage-card,
.research-card,
.sheet-item,
.modal-window,
.system-panel,
.progress-panel,
.next-panel,
.research-panel {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-subtle) !important;
  border-radius: 16px !important;
  color: var(--text-main) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
  transition: all 0.25s var(--spring-ease) !important;
}

.panel:hover, 
.tool-card:hover, 
.book-card:hover, 
.metric-card:hover {
  background: var(--bg-card-hover) !important;
  border-color: var(--border-hover) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 25px var(--amber-glow) !important;
}

.panel-head h3, .panel-head h4, .section-heading h2 {
  color: var(--text-main) !important;
}

.panel-kicker, .eyebrow {
  color: var(--amber-light) !important;
  font-family: var(--font-mono) !important;
  font-size: 11px !important;
  letter-spacing: 0.08em !important;
}

/* ==========================================================================
   BUTTONS (CLEAN, TACTILE, NO GREEN/TEAL TONES)
   ========================================================================== */
.btn {
  font-family: var(--font-main) !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  transition: all 0.22s var(--spring-ease) !important;
}

.btn-primary, .btn[data-go="student"] {
  background: linear-gradient(135deg, var(--amber-light), var(--amber-dark)) !important;
  color: #000000 !important;
  font-weight: 700 !important;
  border: none !important;
  box-shadow: 0 6px 20px var(--amber-glow) !important;
}

.btn-primary:hover, .btn[data-go="student"]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 28px rgba(245, 158, 11, 0.45) !important;
  color: #000000 !important;
}

.btn-ghost, .btn-secondary {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: #f1f5f9 !important;
}

.btn-ghost:hover, .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}

/* ==========================================================================
   TABS, FILTERS & FORMS (CLEAN GLASS)
   ========================================================================== */
.tab-row, .tabs {
  background: rgba(0, 0, 0, 0.35) !important;
  border: 1px solid var(--border-subtle) !important;
  border-radius: 9999px !important;
  padding: 4px !important;
  display: inline-flex !important;
  gap: 4px !important;
}

.tab {
  background: transparent !important;
  border: none !important;
  color: var(--text-dim) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 8px 18px !important;
  border-radius: 9999px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.tab:hover {
  color: #ffffff !important;
}

.tab.active {
  background: rgba(255, 255, 255, 0.14) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4) !important;
}

input, select, textarea {
  background: rgba(14, 18, 28, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  outline: none !important;
  transition: border-color 0.2s ease !important;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--amber) !important;
  box-shadow: 0 0 16px var(--amber-glow) !important;
}

/* ==========================================================================
   TASK ITEMS & CHECKLISTS
   ========================================================================== */
.task-item {
  background: rgba(18, 24, 36, 0.7) !important;
  border: 1px solid var(--border-subtle) !important;
  border-radius: 12px !important;
  padding: 14px 18px !important;
  color: var(--text-main) !important;
  transition: all 0.2s ease !important;
}

.task-item:hover {
  background: rgba(26, 34, 52, 0.9) !important;
  border-color: rgba(245, 158, 11, 0.3) !important;
}

/* ==========================================================================
   METRICS & NUMBERS
   ========================================================================== */
.metric-value, .stat-num, .pill-num, .item-value {
  font-family: var(--font-mono) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
}

.metric-label, .pill-lbl, .item-label {
  color: var(--text-dim) !important;
}

/* ==========================================================================
   LIGHT MODE (WARM EDITORIAL CANVAS - CONTRALABS STYLE)
   ========================================================================== */
[data-theme="light"] {
  --bg-deep: #fbfaf8 !important;
  --bg-surface: #ffffff !important;
  --bg-card: #ffffff !important;
  --bg-card-hover: #ffffff !important;
  --bg-glass: rgba(255, 255, 255, 0.92) !important;
  
  --border-subtle: #e7e5e0 !important;
  --border-hover: rgba(217, 119, 6, 0.5) !important;
  --border-focus: #d97706 !important;
  
  --text-main: #1c1917 !important;
  --text-dim: #78716c !important;
  --text-muted: #a8a29e !important;
}

[data-theme="light"] body {
  background-color: #fbfaf8 !important;
  color: #1c1917 !important;
  background-image: 
    radial-gradient(circle at 15% 10%, rgba(245, 158, 11, 0.08) 0%, transparent 45%),
    radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.06) 0%, transparent 42%) !important;
}

[data-theme="light"] .panel, 
[data-theme="light"] .card, 
[data-theme="light"] .metric-card, 
[data-theme="light"] .tool-card, 
[data-theme="light"] .book-card, 
[data-theme="light"] .bento-showcase-card,
[data-theme="light"] .studio-hero-section,
[data-theme="light"] .interactive-workflow-hub {
  background: #ffffff !important;
  border-color: #e7e5e0 !important;
  color: #1c1917 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
}

[data-theme="light"] h1, 
[data-theme="light"] h2, 
[data-theme="light"] h3, 
[data-theme="light"] h4, 
[data-theme="light"] .metric-value,
[data-theme="light"] .brand-name-top {
  color: #1c1917 !important;
}

[data-theme="light"] .studio-topbar {
  background: rgba(251, 250, 248, 0.9) !important;
  border-bottom-color: #e7e5e0 !important;
}

[data-theme="light"] .studio-nav-pills {
  background: #f3f0ea !important;
  border-color: #e7e5e0 !important;
}

[data-theme="light"] .studio-nav-pills .nav-item {
  color: #78716c !important;
}

[data-theme="light"] .studio-nav-pills .nav-item.active {
  background: #ffffff !important;
  color: #1c1917 !important;
  border-color: #d6d3cb !important;
}

[data-theme="light"] input, 
[data-theme="light"] select, 
[data-theme="light"] textarea {
  background: #f5f3ee !important;
  border-color: #e0dcd4 !important;
  color: #1c1917 !important;
}
"""

with open('FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css', 'a', encoding='utf-8') as f:
    f.write("\n" + css_additions)

print("Master typography & color additions appended successfully!")
