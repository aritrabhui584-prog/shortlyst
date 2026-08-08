---
name: Lumina Hiring
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-desktop: 32px
  container-padding-mobile: 16px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is rooted in the "AI Copilot" philosophy—positioning the interface as a calm, intelligent partner rather than a complex tool. The aesthetic merges **Minimalism** with **Modern Corporate** sensibilities, utilizing a dark-mode-first approach to reduce cognitive load during intensive hiring tasks.

The visual narrative is defined by:
- **Quiet Intelligence:** A high-end, dark environment that feels premium and focused.
- **Layered Clarity:** Using depth and subtle translucency to organize information without overwhelming the user.
- **Precision Accents:** Using vibrant indigo and violet solely for action and intelligence markers, ensuring the "AI" feels integrated but not distracting.
- **Soft Professionalism:** Large corner radii and generous whitespace create an approachable yet authoritative atmosphere.

## Colors
The palette is built on a foundation of deep slate and charcoal to establish a "pro-tool" environment.

- **Background (Base):** `#020617` — The deepest layer for the main application canvas.
- **Surface (Layered):** `#0f172a` — Used for primary panels and sidebars.
- **Surface-Elevated:** `#1e293b` — Used for cards, modals, and active states.
- **Primary Indigo:** `#6366f1` — Reserved for primary actions, focus states, and AI-driven insights.
- **Success/Score Green:** `#10b981` — Used for high candidate match scores and positive status indicators.
- **Warning/Score Amber:** `#f59e0b` — Used for mid-range candidate scores.
- **Border/Stroke:** `#334155` — A subtle, low-contrast stroke to define boundaries without visual noise.

## Typography
This design system utilizes **Inter** for all primary interface text to ensure maximum legibility and a neutral, professional tone. **Geist** is introduced for labels and monospaced data points to provide a technical, high-precision feel appropriate for AI data visualization.

- **Headlines:** Use tighter letter-spacing and bold weights to create a strong hierarchy.
- **Body:** Standard weight with generous line-height for long-form candidate summaries and job descriptions.
- **Labels:** Uppercase is permitted for `label-sm` when used in table headers or category tags.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum widths for content readability.

- **Grid:** 12-column layout for desktop, 4-column for mobile.
- **Rhythm:** An 8px linear scale is used for all internal component spacing, while 4px increments are used for fine-tuning labels and icons.
- **Safe Margins:** Content should never sit flush against the screen; a minimum of 32px padding is maintained on large displays to emphasize the "generous whitespace" brand pillar.
- **Sidebars:** Fixed-width navigation (280px) with fluid main content areas to maximize the candidate list view.

## Elevation & Depth
Depth is achieved through **Tonal Layering** supplemented by **Ambient Shadows**.

- **Level 0 (Base):** `#020617`.
- **Level 1 (Panels):** Surface `#0f172a` with a 1px solid border of `#1e293b`.
- **Level 2 (Cards):** Surface `#1e293b` with an ambient shadow (0px 4px 20px rgba(0,0,0,0.4)).
- **Level 3 (Modals/Popovers):** Surface `#1e293b` with a distinct violet-tinted glow (0px 10px 40px rgba(99,102,241,0.15)).

Use background blurs (12px) behind modals and flyout menus to maintain the layered panel aesthetic.

## Shapes
A consistent "Rounded" language is applied to soften the high-tech feel.

- **Components:** Standard buttons and inputs use `rounded-md` (0.5rem).
- **Cards & Containers:** Main dashboard panels and candidate cards use `rounded-xl` (1.5rem) to create the signature "soft SaaS" look.
- **Chips & Pills:** Always use `rounded-full` for status badges and candidate attributes.

## Components
Consistent application of components ensures a trustworthy user experience.

- **Candidate Cards:** Feature a high-contrast score badge in the top right. Use `#10b981` (Green) for scores >80, `#f59e0b` (Amber) for 50-80, and neutral for <50.
- **Upload Zones:** 2px dashed border using color `#334155`. On hover, the border transitions to the primary indigo with a subtle violet wash background.
- **Textareas:** Character counters should appear in the bottom right, using `label-sm` typography. The border should expand vertically to accommodate text, but maintain a fixed maximum height with an internal scroll.
- **Skeleton Loaders:** Use a base color of `#1e293b` with a linear-gradient shimmer effect moving from left to right in a 2-second loop.
- **File Chips:** Compact pills containing a file icon, name, and "remove" action. Background should be `#334155` with white text.
- **Buttons:** 
  - *Primary:* Indigo background with white text. 
  - *Secondary:* Ghost style with Indigo border and transparent background.
  - *Ghost:* No border, Indigo text, subtle slate background on hover.