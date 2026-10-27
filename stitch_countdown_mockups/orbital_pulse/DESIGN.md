---
name: Orbital Pulse
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c5c9ae'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8f937a'
  outline-variant: '#444934'
  surface-tint: '#aed500'
  primary: '#ffffff'
  on-primary: '#293500'
  primary-container: '#c8f32c'
  on-primary-container: '#576c00'
  inverse-primary: '#526600'
  secondary: '#44e2cd'
  on-secondary: '#003731'
  secondary-container: '#03c6b2'
  on-secondary-container: '#004d44'
  tertiary: '#ffffff'
  on-tertiary: '#490080'
  tertiary-container: '#f0dbff'
  on-tertiary-container: '#8a33d9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c8f32c'
  primary-fixed-dim: '#aed500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3d4d00'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  timer-display:
    fontFamily: Space Mono
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 68px
    letterSpacing: -0.05em
  timer-display-mobile:
    fontFamily: Space Mono
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  metric-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  badge-code:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system defines a technical, high-momentum visual language crafted for event-driven developer experiences and launch weeks. It combines precision engineering aesthetics with cinematic, nocturnal anticipation. 

### Visual Philosophy
- **Modernist Precision:** Rooted in Swiss grid discipline, extreme typographic clarity, and monospaced data density inspired by command-line interfaces and mission control dashboards.
- **Controlled Luminescence:** Deep zinc foundations juxtaposed with high-energy spectral accents. Energy is drawn through focused points of interest—countdown digits, live status lights, and holographic foil accents—rather than broad surface illumination.
- **Tactile Surface Engineering:** Subtle technical gridlines, hairline borders, and faint film grain eliminate plastic flatness, delivering a hardware-grade digital surface.

### Target Audience & Emotional Impact
Designed for engineers, technical founders, and product power-users. The interface evokes anticipation, operational excellence, clockwork dependability, and high-velocity shipping momentum.

## Colors

The palette operates in a strict, high-contrast dark environment. Lightness values are tightly metered to maintain deep contrast while preserving eye comfort under extended viewing.

### Palette Architecture
- **Base Canvas (`#09090B`):** The foundational space. Deep obsidian zinc that anchors foreground elements.
- **Base Surface (`#111113`):** Default card and structural container surface.
- **Surface Elevated (`#18181B`):** Lifted modules, dropdowns, floating panels, and hover states.
- **Structural Stroke (`#26262B`):** Precision 1px container boundaries and divider rules.
- **High-Contrast Text (`#F4F4F5`):** Primary data, headers, and prominent metric values.
- **Muted Carbon (`#8B8B93`):** Labels, secondary metadata, inactive markers, and inactive calendar days.
- **Primary Accent Lime (`#D4FF3A`):** High-voltage indicator used strictly for active states, CTA triggers, primary timers, and live notifications.

### Holographic Foil Accent Spectrum
Multi-spectrum accents reflect high-grade packaging and specialized event credentials:
- **Teal Horizon (`#2DD4BF`):** Secondary release streams, architecture tags, and operational health.
- **Deep Violet (`#A855F7`):** Specialized releases, keynotes, and milestone triggers.
- **Solar Gold (`#F59E0B`):** T-minus alerts, lock states, and premiere milestones.

Foil gradients combine these tokens linearly at dynamic 135-degree sweeps with minimal opacities (12% to 28%) across card borders, glass highlights, and headline text masks.

## Typography

Typography balances Swiss proportional grotesk forms for natural scanning with mechanical monospace elements for numeric certainty.

### Roles and Hierarchies
- **Proportional UI (`Geist`):** Delivers clean neutral legibility for headings, marketing narratives, body content, and standard input surfaces. Tight negative tracking is applied to large sizes to enhance punch and authority.
- **Monospace Telemetry (`Space Mono`):** Dedicated to mission-critical numeric feedback: countdown units, Day 01–05 milestones, git commit SHAs, terminal telemetry, and status pills. Fixed glyph widths guarantee jitter-free rendering as values count down dynamically.
- **Kerning and Metrics:** All tabular figures in `Geist` must inherit `font-variant-numeric: tabular-nums` when rendered in comparison tables or secondary counters.

## Layout & Spacing

Layout geometry follows an explicit structural cadence based on a rigid 4px/8px incremental base unit.

### Screen Adaptations
- **Desktop (1024px+):** Fixed 12-column architecture constrained within a 1280px max-width boundary. Grid gutters are set to `gutter` (24px) with dynamic outer margins matching `margin` (32px).
- **Tablet (768px – 1023px):** 8-column layout. Gutters compress to 16px; side canvas margins adjust to 24px.
- **Mobile (Below 768px):** 4-column single-stack structure. Gutters collapse to `gutter-sm` (16px), outer boundaries snap to `margin-sm` (16px).

### The Technical Matrix Pattern
The canvas utilizes an active background texture to contextualize modular elements:
- **Matrix Grid:** A structural dot grid with 1px dots positioned at 24px intervals across x/y planes, masked at a constant 6% opacity (`rgba(244, 244, 245, 0.06)`).
- **Film Noise Grain:** An overlay grain tile (SVG turbulence layer) applied across the viewport at 2.5% opacity, breaking digital color banding across wide gradient fields.

## Elevation & Depth

This design system avoids traditional dropped shadows, relying instead on tonal stepping, translucent glass layers, and hairline luminosity.

### Elevation Architecture
- **Layer 0 (Canvas Base):** Surface `#09090B` containing the structural dot matrix.
- **Layer 1 (Card Standard):** Surface `#111113` backed by a 1px solid border of `#26262B`. No shadow displacement.
- **Layer 2 (Elevated State / Active Day Card):** Surface `#18181B` bordered by high-contrast hairlines (`#3F3F46`). Ambient glow: a diffuse, 32px radial bloom utilizing the primary accent color at 8% opacity (`rgba(212, 255, 58, 0.08)`).
- **Layer 3 (Floating HUD / Overlays / Flyouts):** Translucent backing at 85% opacity `#111113` with `backdrop-filter: blur(16px)` and a subtle interior highlight border: 1px top stroke at `#3F3F46`, fading to `#26262B` on lateral edges.

### Optical Foil Edging
Special active release cards utilize a pseudo-border technique: a 1px gradient wrapping the container combining Lime (`#D4FF3A`), Teal (`#2DD4BF`), and Violet (`#A855F7`) at 40% master opacity, creating the impression of precision-milled iridescent foil.

## Shapes

The design system uses a controlled, low-radius shape system (`1` / Soft). This aesthetic choice avoids toy-like organic roundness, anchoring the experience in architectural, developer-centric precision.

### Application Rules
- **Base Controls & Inputs (`rounded` / 4px):** Checkboxes, code chips, inline tag badges, text inputs, and micro-buttons.
- **Structural Modules (`rounded-lg` / 8px):** Day-release launch cards, countdown containers, console terminal blocks, and dialog panels.
- **Outer Shells (`rounded-xl` / 12px):** Top-level hero banners and primary media wrappers.
- **Pill Exception:** Terminal status beacons (e.g., `LIVE`, `DAY 03`, `LOCKED`) retain fully rounded geometry (9999px) strictly when containing dot indicators or micro metadata.

## Components

### Buttons
- **Primary Kinetic:** Background `#D4FF3A`, foreground `#09090B`, font weight 600. On hover, produces an 8px blurred ambient lime glow. Click state scales to 0.98.
- **Secondary Ghost:** Background `#111113`, border 1px solid `#26262B`, foreground `#F4F4F5`. On hover, border transitions to `#3F3F46` and surface shifts to `#18181B`.
- **Command Mono (HUD):** Monospace font, background `rgba(24, 24, 27, 0.6)`, 1px border `#26262B`, foreground `#8B8B93`. Includes keyboard accelerator brackets (e.g., `[ ⌘K ]`).

### Chips & Badges
- **Milestone Day Badge:** Monospace font, uppercase, 11px. Inactive state: `#18181B` fill, `#26262B` border, `#8B8B93` text. Active state: `#D4FF3A` fill at 10% opacity, `#D4FF3A` border at 40%, `#D4FF3A` solid text, paired with a pulsing 6px lime beacon.
- **Foil Tier Chip:** Inset background `#111113`, perimeter wrapped in holographic gradient hairline (Lime/Teal/Violet), foreground `#F4F4F5`.

### Countdown Digits Block
- Stacked modular unit: Background `#111113`, 1px border `#26262B`, corner radius 8px, padding 16px. Top half separated by a subtle 1px horizontal score line mimicking split-flap displays. Numbers rendered in `timer-display` Space Mono. Bottom micro-label rendered in Geist 10px uppercase muted text.

### Day Release Cards (Launch Week Matrix)
- 5-column horizontal strip or stacked grid.
- **Past / Unlocked:** Dark surface `#111113`, crisp `#F4F4F5` title, secondary monospace changelog tag, active media preview.
- **Current Day (Active):** Foil border gradient, ambient lime underglow, prominent badge, expanded announcement summary.
- **Future / Locked:** Surface `#09090B` at 60% opacity, dashed border `#26262B`, lock icon glyph, countdown micro-timer showing T-minus release time in Space Mono.

### Form Inputs
- Background `#111113`, border 1px solid `#26262B`, corner radius 4px, height 40px, typography `body-base`. Placeholder text `#8B8B93`. Focused state transitions border directly to `#D4FF3A` without heavy rings, accompanied by an ultra-subtle box-shadow: `0 0 0 1px #D4FF3A`.

### Selection Controls
- **Checkboxes:** 16x16px square, radius 3px. Checked state: `#D4FF3A` fill with `#09090B` angled check icon.
- **Radio Buttons:** 16x16px ring. Active state: `#26262B` outer border enclosing a detached `#D4FF3A` 6px solid central disc.