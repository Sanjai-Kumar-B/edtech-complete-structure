# Design System Specification: The Academic Architect

## 1. Overview & Creative North Star
**Creative North Star: "The Intellectual Atelier"**
This design system rejects the "standard SaaS dashboard" aesthetic in favor of a high-end, editorial experience tailored for deep focus and academic rigor. We move beyond generic boxes by treating the UI as a curated workspace. The "Academic Architect" ethos combines the structural precision of a blueprint with the warmth of a high-end physical library.

To break the "template" look, this system utilizes **Intentional Asymmetry** and **Tonal Depth**. We favor generous white space (breathing room) over dense information packing. Overlapping elements—such as a floating glass card subtly breaking the plane of a section header—create a sense of sophisticated, layered space that signals quality and focus.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a professional, high-contrast foundation, utilizing tonal shifts rather than lines to define architecture.

### Color Tokens (Material Design Convention)
- **Primary (The Intellectual Signal):** `#3525cd` (used for core actions).
- **Primary Container (The Emphasis):** `#4f46e5` (vibrant indigo for progress and highlights).
- **On-Surface (Typography):** `#191c1e` (a deep, authoritative navy-black).
- **Surface (The Canvas):** `#f7f9fb` (a clean, scholarly light background).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or containers. Boundaries must be established through background color shifts. A section should sit as `surface-container-low` on a `surface` background. If an element requires separation, use a shift in tonal value, never a stroke.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. 
- **Base Layer:** `surface` (#f7f9fb)
- **Secondary Sections:** `surface-container-low` (#f2f4f6)
- **Interactive Cards:** `surface-container-lowest` (#ffffff)
- **Floating Overlays:** Use `surface-container-highest` with a **Glass & Gradient** treatment.

### Signature Textures
Main CTAs and hero-level progress indicators should utilize a subtle linear gradient from `primary` (#3525cd) to `primary-container` (#4f46e5) at a 135-degree angle. This adds "visual soul" and depth, preventing the platform from feeling like a flat, utilitarian tool.

---

## 3. Typography
We use a dual-sans-serif approach to balance modern tech with editorial authority.

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-intellectual" feel.
  - `display-lg` (3.5rem): Used for high-level data milestones.
  - `headline-md` (1.75rem): Used for module titles.
- **Body & Labels (Inter):** The workhorse of readability.
  - `body-lg` (1rem): Standard reading text with a generous 1.6 line-height.
  - `label-md` (0.75rem): Used for metadata, always set in Medium or Semi-bold weight to ensure authority at small scales.

**Editorial Hierarchy:** Use wide tracking (letter-spacing: 0.05em) on `label-sm` elements to create a premium, "architectural" feel in navigation and category tags.

---

## 4. Elevation & Depth
Depth is a functional tool, not a stylistic flourish.

### The Layering Principle
Achieve hierarchy by "stacking" surface tiers. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f2f4f6) background to create a soft, natural lift.

### Ambient Shadows
Where floating elements (like Modals or Tooltips) are required:
- **Shadow:** `0 20px 40px -12px rgba(25, 28, 30, 0.06)`. 
- The shadow must be large, diffused, and tinted with the `on-surface` color to mimic natural, ambient light. Avoid generic black shadows.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use a **Ghost Border**: `outline-variant` (#c7c4d8) at **15% opacity**. This creates a perceived edge without adding visual noise.

### Glassmorphism
For sidebar navigation or floating header elements, use a backdrop-blur (12px to 20px) combined with a semi-transparent `surface-container-lowest` color. This integrates the UI, allowing the content to "bleed" through the edges, softening the experience.

---

## 5. Components

### Cards & Lists
*   **Cards:** Use `rounded-xl` (1.5rem) for main dashboard cards. **Forbid dividers.** Use vertical white space (`spacing-8` or `spacing-10`) to separate internal content.
*   **Lists:** Items are separated by a subtle background hover state (`surface-container-high`) rather than lines.

### Buttons
*   **Primary:** Gradient-filled (`primary` to `primary-container`), `rounded-md` (0.75rem), white text.
*   **Tertiary:** No background or border. Use `primary` text weight 600. These must be used for low-priority actions to maintain the "editorial" clean look.

### Progress Bars & Charts
*   **Progress Bars:** Use a thick (8px) track in `surface-container-highest` with the `primary` indigo fill.
*   **Charts:** Radar and Line charts must use a 2px stroke width. Areas under lines should use a 5% opacity fill of the line color to create a "ghost" volume effect.

### Data Tables
*   Header rows should be `surface-container-low` with `label-md` uppercase typography. 
*   No vertical lines. No horizontal lines. Use alternating row colors (Zebra striping) using `surface` and `surface-container-lowest`.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical margins (e.g., more padding on the left of a container than the right) to create an editorial feel.
- **Do** use `primary-fixed-dim` for "Success" states instead of a bright green to maintain the professional Indigo/Navy tone.
- **Do** prioritize white space over font size for hierarchy.

### Don’t
- **Don't** use 100% opaque borders. They clutter the academic focus.
- **Don't** use "rounded-full" for buttons (pills). It feels too playful/mobile. Stick to `rounded-md` or `rounded-lg` for a structured, serious tone.
- **Don't** use drop shadows on every card. Reserve them for active, floating, or interactive elements.