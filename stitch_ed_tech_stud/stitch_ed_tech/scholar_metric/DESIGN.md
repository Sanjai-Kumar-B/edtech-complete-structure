# Design System Strategy: The Academic Architect

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

Unlike generic ed-tech platforms that feel like cluttered filing cabinets, this system treats the student dashboard as a high-end, focused workspace—an architect’s desk where every tool has its place. We move away from the "boxy" look of standard dashboards by embracing **Editorial Precision**. By using intentional asymmetry, generous whitespace, and a high-contrast typographic scale, we create an environment that feels authoritative yet breathable. The goal is to reduce cognitive load while conveying a sense of academic prestige and professional momentum.

## 2. Colors & Surface Philosophy
The palette utilizes a sophisticated "Cool-to-Cold" range to maintain a serious, focused atmosphere. We rely on tonal depth rather than structural lines to organize information.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts. For example, a dashboard sidebar using `surface-container-low` (#f2f3ff) should sit directly against a `background` (#faf8ff) main stage. This creates a "seamless" interface that feels modern and high-end.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to define importance:
- **Base Level:** `surface` (#faf8ff) for the global canvas.
- **Sectioning:** `surface-container-low` (#f2f3ff) for sidebar or secondary navigation zones.
- **Active Workspaces:** `surface-container-lowest` (#ffffff) for the primary content cards and data modules.
- **Interaction Layers:** `surface-container-high` (#e2e7ff) for hover states or active selection indicators.

### The "Glass & Gradient" Rule
To elevate the "Serious" tone into "Premium," use Glassmorphism for floating elements (like toast notifications or mobile navigation bars). Apply `surface-container-lowest` at 80% opacity with a `20px` backdrop blur. 
**Signature Texture:** Main Call-to-Actions (CTAs) should use a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle. This provides a tactile "glow" that flat colors cannot achieve, making progress feel rewarding.

## 3. Typography: Editorial Authority
We utilize a dual-font system to balance character with structure. 

- **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create an authoritative, "encyclopedic" feel. 
- **Body & Labels (Inter):** Chosen for its exceptional legibility in data-dense environments. 

**Typographic Intent:**
- **The Power Gap:** Create high contrast between `headline-lg` (2rem) and `body-md` (0.875rem). This "Editorial Gap" allows the eye to quickly anchor to section headers before diving into the granular data.
- **Labels:** Use `label-md` in `on_surface_variant` (#434655) with `uppercase` styling and `0.05em` tracking for metadata to mimic academic citations.

## 4. Elevation & Depth
We eschew traditional "box-shadows" in favor of **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural "lift" that feels integrated into the page architecture.
- **Ambient Shadows:** For "floating" components (Modals, Dropdowns), use a triple-layered shadow:
  - `0 4px 6px -1px rgba(19, 27, 46, 0.04)`
  - `0 10px 15px -3px rgba(19, 27, 46, 0.08)`
  The shadow color must be a tinted version of `on_surface` (#131b2e), never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#c3c6d7) at **15% opacity**. A 100% opaque border is a failure of the design system's elegance.

## 5. Components

### Cards & Data Modules
Cards are the heart of the productivity suite.
- **Style:** No borders. `md` (0.75rem) or `lg` (1rem) corner radius.
- **Content:** Forbid divider lines. Separate "Title" from "Content" using a `1.5rem` (spacing-6) vertical gap. Use a subtle background shift (`surface-container-high`) for a card's footer instead of a line.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `full` roundedness, white text.
- **Secondary:** `surface-container-high` background with `primary` text. No border.
- **Tertiary:** Pure text with `primary` color, but with a `sm` (0.25rem) radius hover state in `primary_fixed`.

### Progress & Data Viz
- **Progress Bars:** Use `secondary` (#006b5f) for the fill and `secondary_container` (#6df5e1) for the track. The track should have a 10% opacity to feel like an "engraving" in the card.
- **Timelines:** Use the "Ghost Border" (15% opacity `outline-variant`) for the vertical stem, with `primary` dots for active milestones.

### Input Fields
- **Style:** `surface-container-low` background. On focus, transition to `surface-container-lowest` with a 2px `primary` bottom-border only (Editorial underline style).

## 6. Do's and Don'ts

### Do
- **Do** use `24` (6rem) or `20` (5rem) spacing between major sections to allow the "Serious" tone to breathe.
- **Do** use `Manrope` for all numbers in data visualizations; its geometric nature feels more "calculated."
- **Do** use `secondary_fixed` for success states or "on-track" indicators to provide a sophisticated teal accent.

### Don't
- **Don't** use 1px solid borders to separate list items; use `8` (2rem) padding and `surface` color shifts.
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#131b2e) to maintain a premium, ink-on-paper feel.
- **Don't** use "Default" blue. Every instance of blue must map to the specific `primary` or `primary_container` tokens to ensure the "Academic" brand integrity.