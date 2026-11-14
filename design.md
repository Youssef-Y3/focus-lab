# FOCUS LAB × TAFRA OS — Radical Design System & Architecture Specification

## 1. Design Philosophy & Vision

The radical redesign of **FOCUS LAB × TAFRA OS** synthesizes **high-performance cyberpunk minimalism**, **spatial 3D interactivity**, and **tactile glass-morphism**. Engineered specifically for ambitious Arab university students, creators, and researchers, the interface transcends traditional flat web pages to become a focused, ambient operating system.

### Core Architectural Pillars
1. **Spatial Depth & Dimensionality**: Transitioning flat grid elements into physical 3D objects with Three.js and WebGL shaders.
2. **Tactile Radial Ergonomics**: Replacing rigid vertical sidebars with a floating, circular HUD navigation positioned via trigonometric geometry.
3. **Ambient Audio-Visual Feedback**: Synthesizing real-time WebAudio UI acoustics (whoosh transitions, tactile clicks, error alerts, and 40Hz binaural focus beats) with an interactive Aurora Borealis hero canvas.
4. **100% Offline Autonomy**: Zero external CDN dependencies; all WebGL shaders, 3D math engines, SVG icon sprites, and fonts operate completely offline.

---

## 2. Color System & Themes

The platform implements an adaptive 3-tier theme engine toggled via header controls, floating dock shortcuts, or keyboard triggers.

### Themes Overview

```
Dark (Default) ────────► Light (Editorial) ────────► Neo (Cyberpunk)
      ▲                                                    │
      └────────────────────────────────────────────────────┘
```

### 1. Cyber Neo Theme (`[data-theme="neo"]`)
Designed for late-night focus sessions and high-immersion creative sprints.
- **Background Primary**: `#050811` (Deep Obsidian Void)
- **Background Secondary**: `rgba(10, 18, 36, 0.75)` (Glass-Morph Midnight)
- **Accent Primary (Cyan Mint)**: `#00ffcc` — Primary actions, focus indicators, glowing borders (`rgba(0, 255, 204, 0.4)`).
- **Accent Secondary (Electric Violet)**: `#9d4edd` — Badges, secondary glows, and spatial highlights.
- **Accent Vibrant (Hot Magenta)**: `#ff0077` — Interactive alerts, mode badges, active state indicators.
- **Accent Solar (Amber Gold)**: `#ffaa00` — Mastery points, achievement streaks, attention anchors.
- **Text Primary**: `#f0f6fc`
- **Text Secondary**: `#a0aec0`
- **Glass-Morph Border**: `rgba(0, 255, 204, 0.25)`

### 2. Deep Dark Theme (`[data-theme="dark"]` - Default)
- **Background Primary**: `#0b1320`
- **Surface Elevation**: `#111c30`
- **Primary Brand**: `#0284c7` (Sky Azure)
- **Accent Emerald**: `#10b981` (Zen Emerald)
- **Text Primary**: `#f8fafc`
- **Text Muted**: `#94a3b8`

### 3. Clean Light Theme (`[data-theme="light"]`)
- **Background Primary**: `#f8fafc`
- **Surface Elevation**: `#ffffff`
- **Primary Brand**: `#0284c7`
- **Border Subtle**: `#e2e8f0`
- **Text Primary**: `#0f172a`
- **Text Muted**: `#64748b`

### Glass-Morphic Tokens
```css
.glass-morph {
    background: rgba(11, 19, 32, 0.68);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

---

## 3. Typography System

The typography system pairs clean Arabic geometric letterforms with editorial serifs to balance high-tech precision with humanistic wisdom.

| Role | Family | Fallbacks | Weight / Style | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Display & Headings** | Alexandria / IBM Plex Sans Arabic | 'Segoe UI', Tahoma, sans-serif | 700 / 800 Bold | Topbar logo, Hero headlines, modal headers |
| **Body & UI Controls** | IBM Plex Sans Arabic / Alexandria | 'Segoe UI', sans-serif | 400 Regular, 500 Medium | Tool descriptions, prompts, radial labels, cards |
| **Editorial Manifesto & Quotes** | Source Serif 4 / Amiri | Georgia, 'Times New Roman', serif | 600 Semi-Bold / Italic | Manifesto cards, philosophical principles, reflections |
| **Data & Metrics** | JetBrains Mono / Fira Code | 'Courier New', monospace | 500 Medium | Timers, 40Hz Hz indicators, telemetry tags |

---

## 4. Radial Navigation HUD (`radial_nav.js`)

Replacing standard vertical sidebars, the floating radial HUD positions navigational nodes symmetrically around an ergonomic trigger anchor.

### Trigonometric Distribution Formula
For $N$ items evenly distributed across angular span $\Delta\theta = \theta_{end} - \theta_{start}$:
$$\theta_i = \theta_{start} + i \cdot \left(\frac{\theta_{end} - \theta_{start}}{N - 1}\right)$$
$$x_i = R \cdot \cos(\theta_i), \quad y_i = R \cdot \sin(\theta_i)$$
Where:
- Radius $R = 140\text{px}$ (expands to $160\text{px}$ on wide viewports, scales to $105\text{px}$ on mobile).
- Angular span $\theta \in [110^\circ, 330^\circ]$ oriented outward into the primary workspace canvas.

### Component Structure
- **HUD Root**: `<nav class="floating-nav glass-morph" id="sidebar">`
- **Center Trigger**: `#radialToggleBtn` with glowing pulse ring and state transformation (Hamburger $\leftrightarrow$ Cross $\times$).
- **Radial Items**: `#radialMenuItems` containing 11 specialized action buttons:
  1. `overview` (Home / الرئيسية)
  2. `student` (Student Hub / هاب الطالب)
  3. `tools` (Interactive Tools / الأدوات)
  4. `journey` (Four Stages / المراحل الأربع)
  5. `tafra` (Tafra Way / طريقة طفرة)
  6. `be-tafra` (Be Tafra / كن طفرة)
  7. `deep-work` (Deep Work / العمل العميق)
  8. `second-brain` (Second Brain / العقل الثاني)
  9. `search` (Search Engine / محرك البحث)
  10. `library` (Corpus Library / المكتبة الشاملة)
  11. `settings` (System Settings / الإعدادات)
- **Feather Icon Symbols**: Rendered via `<svg class="radial-svg-icon"><use xlink:href="#icon-..."></use></svg>`.
- **Keyboard Shortcut**: Press `Alt + N` to toggle open/close.

---

## 5. WebGL Aurora Fragment Shader Engine (`hero_shader.glsl` & `hero_shader.js`)

A hardware-accelerated dynamic fragment shader rendered onto `#heroAuroraCanvas` behind the primary Hero content.

### Shader Pipeline & Math
1. **Dynamic Wave Ribbons**: Four overlapping wave functions computed using oscillating sine/cosine harmonics:
   - *Ribbon 1 (Emerald / Mint)*: $\sin(2.8x + 0.8t) \cdot 0.25 + \cos(5.2x - 0.5t) \cdot 0.12$
   - *Ribbon 2 (Cyan / Azure)*: $\cos(2.1x - 0.6t) \cdot 0.32 + \sin(4.3x + 0.7t) \cdot 0.14$
   - *Ribbon 3 (Neon Purple)*: $\sin(1.9x + 0.4t) \cdot 0.28 + \cos(3.7x - 0.45t) \cdot 0.18$
   - *Ribbon 4 (Solar Amber)*: $\cos(3.4x + 0.9t) \cdot 0.15$
2. **Volumetric FBM Clouds**: 4-octave Fractional Brownian Motion (FBM) with matrix rotation adding fluid turbulence.
3. **Interactive Cursor Parallax**: Tracks mouse position $(u\_mouse.x, u\_mouse.y)$ with smooth linear interpolation (lerp $\alpha = 0.05$).
4. **Vignette Falloff**: Smoothstep radial masking preventing harsh container edge artifacts.
5. **Canvas 2D Fallback**: Automatic graceful degradation for low-spec devices lacking WebGL support.
6. **Efficiency**: Connected to `IntersectionObserver` to halt rendering when scrolled out of viewport (0% GPU waste).

---

## 6. Three.js 3D Spatial Bento Showcase Scene (`three_bento.js`)

The bento showcase grid seamlessly bridges 2D and 3D spatial paradigms.

### Dual-View Architecture
- **Controls**: `#bentoMode3D` and `#bentoModeGrid` buttons allow the user to toggle between interactive 3D spatial cube view and classic 2D bento card grid.
- **Canvas Container**: `.three-bento-container` holding `#threeBentoCanvas`.
- **Lightweight 3D Core**: Powered by custom offline `three.min.js` (Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Raycaster).

### Interactive 3D Cubes
Each cube is textured using dynamic procedural high-DPI canvas textures rendering typography, icons, and subtle holographic borders:
1. **Cube 0 - Focus Engine (40Hz)**:
   - Color Accent: Mint Emerald (`#00ffcc`)
   - Feature: Binaural Beats generator & Pomodoro telemetry.
2. **Cube 1 - Active Recall Vault**:
   - Color Accent: Azure Sky (`#0284c7`)
   - Feature: Leitner flashcard system & confidence intervals.
3. **Cube 2 - Content Studio & Teleprompter**:
   - Color Accent: Solar Amber (`#ffaa00`)
   - Feature: Inverted selfie teleprompter for video creators.
4. **Cube 3 - Academic Mastery Tracker**:
   - Color Accent: Electric Purple (`#9d4edd`)
   - Feature: GPA simulator & syllabus milestone progress.

### Raycasting & Expansion
- **Hover**: Mouse coordinates projected through camera frustum via Raycaster; targeted cube elevates along Z-axis ($\Delta z = +0.5$) with accelerated rotational velocity.
- **Click**: Opens `#bentoExpandedModal` with full feature controls, interactive sliders, and contextual audio feedback.

---

## 7. Ambient Audio Engine (`AmbientAudioEngine`)

UI interactions are coupled with low-latency WebAudio oscillators:
- `playClick()`: Short sine pulse ($680\text{Hz} \to 880\text{Hz}$, $40\text{ms}$) for crisp tactile feedback.
- `playWhoosh()`: Frequency-swept band-passed white noise ($180\text{Hz} \to 720\text{Hz} \to 240\text{Hz}$, $280\text{ms}$) accompanying radial menu expansion, page navigation, and modal openings.
- `playError()`: Low-frequency sawtooth dissonance ($150\text{Hz} / 112\text{Hz}$, $220\text{ms}$) for invalid actions or validation stops.
- `binauralBeats`: 40Hz gamma frequency carrier ($200\text{Hz}$ Left, $240\text{Hz}$ Right) for focused study states.
- **Sync**: Unified state across Topbar `#audioToggleBtn`, Sol Dock soundwave equalizer, and user settings.

---

## 8. Hero Fullscreen Mode

- **Trigger**: `#heroFullscreenBtn` located in top-right of Hero section.
- **Behavior**: Toggles `document.documentElement.requestFullscreen()` with graceful cross-browser fallbacks (`webkitRequestFullscreen`, `mozRequestFullScreen`).
- **Icon Swap**: Feather `#icon-maximize` swaps to `#icon-minimize` with animated scale feedback.

---

## 9. File Manifest & Architecture Map

```
FOCUS_LAB_TAFRA_DIGITAL_PRODUCT/
├── index.html                           # Modernized HTML5 Application Shell
├── FOCUS_LAB_TAFRA_OS_Standalone.html   # Bundled 100% Inlined Standalone Build
└── assets/
    ├── app.css                          # Base design foundations & grid layout
    ├── modern.css                       # Radical redesign styles (glass-morph, neo theme, 3D bento)
    ├── data.js                          # Core interactive tools & prompts dataset
    ├── corpus.js                        # Tafra intellectual library corpus
    ├── app.js                           # Core application controller & routing
    ├── student-hub.js                   # Student Hub, Sol dock, audio engine, theme cycling
    ├── three.min.js                     # Offline lightweight 3D graphics engine
    ├── hero_shader.glsl                 # GLSL fragment shader source
    ├── hero_shader.js                   # WebGL Aurora canvas controller
    ├── radial_nav.js                    # Floating circular radial navigation controller
    ├── three_bento.js                   # Spatial 3D Bento scene with raycaster & modal
    ├── icons.svg                        # Feather SVG symbol sprite
    └── favicon.svg                      # Platform identity vector icon

scripts_build/
├── build_standalone.py                  # Standalone bundler (inlines all CSS, JS & SVG)
├── verify_complete_upgrade.py           # 17-point regression & component test suite
└── verify_radical_components.py         # 6-point radical UI verification test suite
```

---

## 10. Verification & Quality Assurance

- **17/17 Complete Upgrade Checks**: `PASSED [✓]`
- **6/6 Radical Components Checks**: `PASSED [✓]`
- **Offline Reliability**: `100% Verified` (Zero external network dependencies)
