import os

css_path = 'FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/assets/modern.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

radical_overhaul_css = """
/* ==========================================================================
   RADICAL TRANSFORMATION: STUDIO 2026 FULL-WIDTH EXPERIENCE
   Inspired by: ContraLabs, Showreel.design, HelloSol.app, Freckle.tech,
   Lee Holmes, MyStack.com, & The Digital Third.
   ========================================================================== */

/* Full Bleed Canvas & Centered Container */
.app-shell {
  display: flex !important;
  flex-direction: column !important;
  min-height: 100vh !important;
  background: var(--bg-deep) !important;
  width: 100% !important;
}

/* Hide legacy sidebar on desktop in favor of the floating studio topbar */
@media (min-width: 1100px) {
  .sidebar {
    display: none !important;
  }
  .main-area {
    width: 100% !important;
    max-width: 1440px !important;
    margin: 0 auto !important;
    padding: 0 32px 120px 32px !important;
    min-height: 100vh !important;
  }
}

@media (max-width: 1099px) {
  .sidebar {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 280px !important;
    z-index: 2000 !important;
    transform: translateX(105%) !important;
    transition: transform 0.3s var(--spring-ease) !important;
    background: rgba(10, 14, 24, 0.98) !important;
    box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8) !important;
  }
  .sidebar.open {
    transform: translateX(0) !important;
  }
  .main-area {
    width: 100% !important;
    padding: 0 16px 120px 16px !important;
  }
}

/* Hide the old legacy topbar */
header.topbar {
  display: none !important;
}

/* ==========================================================================
   FLOATING STUDIO TOPBAR (HELLOSOL / CONTRALABS / SHOWREEL CAPSULE)
   ========================================================================== */
.studio-topbar {
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
  padding: 16px 0 !important;
  background: linear-gradient(180deg, rgba(6, 8, 13, 0.92) 0%, rgba(6, 8, 13, 0.75) 70%, transparent 100%) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
  margin-bottom: 24px !important;
}

.topbar-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 8px;
}

/* Brand Lockup in Topbar */
.brand-lockup-top {
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
}

.brand-mark-glow {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.25), rgba(0, 240, 255, 0.2));
  border: 1px solid rgba(255, 107, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  box-shadow: 0 0 25px var(--solar-glow);
  transition: transform 0.25s var(--spring-ease);
}

.brand-lockup-top:hover .brand-mark-glow {
  transform: scale(1.05) rotate(-2deg);
}

.brand-mark-glow i {
  font-style: normal;
  color: var(--solar-amber);
  font-size: 11px;
}

.brand-name-top {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.brand-name-top b {
  color: var(--solar-amber);
}

.brand-sub-top {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-dim);
  letter-spacing: 0.12em;
}

/* Navigation Pill Capsule (Center) */
.studio-nav-pills {
  display: inline-flex;
  align-items: center;
  background: rgba(14, 19, 32, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  padding: 5px 8px;
  gap: 4px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

@media (max-width: 1100px) {
  .studio-nav-pills {
    display: none !important;
  }
}

.studio-nav-pills .nav-item {
  background: transparent !important;
  border: none !important;
  color: var(--text-dim) !important;
  font-family: var(--font-display) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  padding: 8px 14px !important;
  border-radius: var(--radius-full) !important;
  cursor: pointer !important;
  transition: all 0.22s var(--spring-ease) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  white-space: nowrap !important;
  width: auto !important;
  box-shadow: none !important;
}

.studio-nav-pills .nav-item:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-1px) !important;
}

.studio-nav-pills .nav-item.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.06)) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
}

.studio-nav-pills .nav-item.student-pill-highlight {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.08)) !important;
  border: 1px solid rgba(245, 158, 11, 0.35) !important;
  color: #fef3c7 !important;
}

.studio-nav-pills .nav-item.student-pill-highlight.active {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #000000 !important;
  font-weight: 800 !important;
  border-color: #f59e0b !important;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.45) !important;
}

.studio-nav-pills .nav-item kbd {
  display: none !important;
}

/* Actions Cluster (Left) */
.topbar-actions-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
}

.global-search-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 19, 32, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  padding: 6px 14px;
  color: var(--text-dim);
  cursor: text;
  transition: all 0.25s var(--spring-ease);
}

.global-search-pill:focus-within {
  border-color: var(--cyber-cyan);
  background: rgba(18, 25, 42, 0.9);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
}

.global-search-pill input {
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 12px;
  outline: none;
  width: 140px;
  font-family: var(--font-display);
}

.global-search-pill kbd {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 5px;
  border-radius: 4px;
}

.mobile-menu-btn {
  display: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 18px;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1099px) {
  .mobile-menu-btn {
    display: flex !important;
  }
}

/* ==========================================================================
   THE GRAND STUDIO HERO (AWWWARDS / CONTRALABS / LEE HOLMES LEVEL)
   ========================================================================== */
.studio-hero-section {
  position: relative;
  background: linear-gradient(145deg, rgba(14, 19, 32, 0.9), rgba(8, 10, 18, 0.98)) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: var(--radius-xl) !important;
  padding: 56px 48px !important;
  margin-bottom: 28px !important;
  overflow: hidden !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
}

.hero-aurora-glow {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 107, 0, 0.18) 0%, rgba(0, 240, 255, 0.12) 40%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
  animation: auroraPulse 8s infinite alternate ease-in-out;
}

@keyframes auroraPulse {
  0% { transform: scale(0.9) translate(0, 0); opacity: 0.6; }
  100% { transform: scale(1.15) translate(-30px, 30px); opacity: 0.9; }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 960px;
}

.hero-telemetry-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  padding: 5px 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 20px;
  letter-spacing: 0.06em;
}

.pulse-beacon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--acid-emerald);
  box-shadow: 0 0 12px var(--acid-emerald);
  animation: beaconPulse 1.8s infinite;
}

@keyframes beaconPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.hero-telemetry-badge .highlight-text {
  color: #ffffff;
  font-weight: 700;
}

.hero-telemetry-badge .badge-tag {
  background: rgba(0, 255, 157, 0.15);
  color: var(--acid-emerald);
  padding: 2px 7px;
  border-radius: var(--radius-xs);
  font-size: 9px;
  font-weight: 800;
}

.hero-display-headline {
  font-family: var(--font-display) !important;
  font-size: clamp(34px, 4.4vw, 56px) !important;
  font-weight: 900 !important;
  line-height: 1.25 !important;
  letter-spacing: -0.035em !important;
  color: #ffffff !important;
  margin: 0 0 18px 0 !important;
}

.solar-gradient-heading {
  background: linear-gradient(135deg, #fef3c7 15%, #f59e0b 55%, #ff6b00 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  font-family: var(--font-editorial) !important;
  font-style: italic !important;
  font-weight: 700 !important;
  display: inline-block !important;
}

.hero-editorial-lead {
  font-size: 16px !important;
  line-height: 1.9 !important;
  color: #cbd5e1 !important;
  max-width: 820px !important;
  margin: 0 0 32px 0 !important;
  font-weight: 500 !important;
}

.hero-cta-cluster {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.btn-hero-gold {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #000000 !important;
  font-family: var(--font-display) !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  border: none !important;
  border-radius: var(--radius-md) !important;
  padding: 14px 26px !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.45) !important;
  transition: all 0.25s var(--spring-ease) !important;
}

.btn-hero-gold:hover {
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: 0 16px 40px rgba(245, 158, 11, 0.6) !important;
}

.btn-hero-cyan {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.16), rgba(0, 240, 255, 0.05)) !important;
  border: 1px solid rgba(0, 240, 255, 0.4) !important;
  color: var(--cyber-cyan) !important;
  font-family: var(--font-display) !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  border-radius: var(--radius-md) !important;
  padding: 14px 24px !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  box-shadow: 0 8px 24px rgba(0, 240, 255, 0.18) !important;
  transition: all 0.25s var(--spring-ease) !important;
}

.btn-hero-cyan:hover {
  background: rgba(0, 240, 255, 0.22) !important;
  border-color: var(--cyber-cyan) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 30px rgba(0, 240, 255, 0.35) !important;
}

.btn-hero-ghost {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  color: #f1f5f9 !important;
  font-family: var(--font-display) !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  border-radius: var(--radius-md) !important;
  padding: 14px 22px !important;
  cursor: pointer !important;
  transition: all 0.25s var(--spring-ease) !important;
}

.btn-hero-ghost:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.28) !important;
  transform: translateY(-2px) !important;
}

.hero-stats-ticker {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-pill .pill-num {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
}

.stat-pill .pill-lbl {
  font-size: 12px;
  color: var(--text-dim);
}

.stat-pill.status-live {
  margin-right: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--acid-emerald);
}

.stat-bullet {
  color: rgba(255, 255, 255, 0.2);
}

/* ==========================================================================
   BENTO LIVE SHOWCASE GRID (SHOWREEL.DESIGN & MYSTACK STYLE)
   ========================================================================== */
.bento-showcase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;
}

@media (max-width: 1200px) {
  .bento-showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .bento-showcase-grid {
    grid-template-columns: 1fr;
  }
}

.bento-showcase-card {
  background: linear-gradient(145deg, rgba(14, 19, 32, 0.85), rgba(8, 11, 20, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.3s var(--spring-ease);
}

.bento-showcase-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 240, 255, 0.35);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.14);
}

.bento-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bento-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--cyber-cyan);
  background: rgba(0, 240, 255, 0.1);
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(0, 240, 255, 0.25);
}

.sos-bento .bento-tag {
  color: var(--solar-amber);
  background: rgba(255, 107, 0, 0.1);
  border-color: rgba(255, 107, 0, 0.25);
}

.recall-bento .bento-tag {
  color: var(--astral-purple);
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.25);
}

.journey-bento .bento-tag {
  color: var(--acid-emerald);
  background: rgba(0, 255, 157, 0.1);
  border-color: rgba(0, 255, 157, 0.25);
}

.bento-card-body h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
}

.bento-card-body p {
  margin: 0 0 14px 0;
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.6;
}

/* Audio Visualizer Bars in Bento */
.bento-audio-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
}

.bento-audio-bars span {
  width: 4px;
  height: 6px;
  background: var(--cyber-cyan);
  border-radius: 2px;
  transition: height 0.2s ease;
}

.bento-audio-bars.active span:nth-child(odd) { animation: bentoEq 0.7s infinite alternate ease-in-out; }
.bento-audio-bars.active span:nth-child(even) { animation: bentoEq 0.9s infinite alternate ease-in-out 0.2s; }

@keyframes bentoEq {
  0% { height: 4px; }
  100% { height: 22px; }
}

/* SOS Progress Meter in Bento */
.bento-sos-meter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bento-sos-meter .meter-bar {
  height: 6px;
  background: linear-gradient(90deg, var(--solar-amber), var(--danger-rose));
  border-radius: 3px;
  box-shadow: 0 0 12px var(--solar-glow);
}

.bento-sos-meter .meter-lbl {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
}

/* 3D Holographic Card in Bento */
.bento-mini-card {
  perspective: 600px;
  height: 80px;
  cursor: pointer;
  position: relative;
}

.mini-front, .mini-back {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backface-visibility: hidden;
  transition: transform 0.5s var(--spring-ease);
  font-size: 11px;
}

.mini-front {
  background: rgba(139, 92, 246, 0.12);
  border: 1px dashed rgba(139, 92, 246, 0.4);
  color: #e2e8f0;
}

.mini-back {
  background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 240, 255, 0.15));
  border: 1px solid var(--acid-emerald);
  color: #ffffff;
  transform: rotateY(180deg);
}

.bento-mini-card.flipped .mini-front {
  transform: rotateY(180deg);
}

.bento-mini-card.flipped .mini-back {
  transform: rotateY(360deg);
}

.mini-front small, .mini-back small {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--cyber-cyan);
}

/* Week Pills in Bento */
.bento-week-pills {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bento-week-pills .week-pill {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-dim);
}

.bento-week-pills .week-pill.done {
  background: rgba(0, 255, 157, 0.12);
  color: var(--acid-emerald);
}

.bento-week-pills .week-pill.current {
  background: rgba(255, 107, 0, 0.15);
  color: var(--solar-amber);
  border: 1px solid rgba(255, 107, 0, 0.35);
}

/* Bento Footer Button */
.btn-bento-action {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  padding: 9px 14px;
  cursor: pointer;
  transition: all 0.22s var(--spring-ease);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-bento-action:hover {
  background: rgba(0, 240, 255, 0.18);
  border-color: var(--cyber-cyan);
  color: var(--cyber-cyan);
  transform: translateY(-2px);
}

.btn-bento-action.sos-btn:hover {
  background: rgba(255, 107, 0, 0.22);
  border-color: var(--solar-amber);
  color: var(--solar-amber);
}

.bento-meta-txt {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 4px;
}
"""

if "/* RADICAL TRANSFORMATION" not in css:
    css = css + "\n" + radical_overhaul_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("modern.css radical styles appended!")
else:
    parts = css.split("/* RADICAL TRANSFORMATION")
    css = parts[0].strip() + "\n" + radical_overhaul_css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("modern.css radical styles updated!")
