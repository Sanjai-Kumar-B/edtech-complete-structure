# Design System Strategy: The Expert's Console

## 1. Overview & Creative North Star
The core philosophy of this design system is **"The Expert’s Console."** We are not building a generic dashboard; we are crafting a high-precision instrument for educators who manage complex data ecosystems. 

While the requirements call for a "data-dense" and "table-heavy" environment, our editorial approach ensures this density never feels like clutter. We achieve this through **Atmospheric Hierarchy**. Instead of using traditional lines to box in information, we use tectonic shifts in surface color and sophisticated typographic scales to guide the eye. The interface should feel like a custom-machined tool—authoritative, silent, and flawlessly responsive.

## 2. Colors & Surface Philosophy
The palette is rooted in deep Indigos and architectural Slates, designed to provide a calm, low-strain environment for long-duration work.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. 
Traditional borders create visual "noise" that tires the eye in data-dense layouts. Instead, boundaries must be established through:
*   **Tonal Shifts:** Placing a `surface-container-low` (#f2f4f6) card against a `surface` (#f7f9fb) background.
*   **Negative Space:** Utilizing the Spacing Scale (specifically `spacing-8` and `spacing-10`) to create "rivers" of focus.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following hierarchy to "stack" importance:
1.  **Base Layer:** `surface` (#f7f9fb) – The desk.
2.  **Sectional Layer:** `surface-container-low` (#f2f4f6) – The tray.
3.  **Actionable Layer:** `surface-container-lowest` (#ffffff) – The paper. 
*By nesting a white card (Lowest) inside a light gray section (Low), we create a "natural lift" that defines the component without a single border.*

### The "Glass & Gradient" Rule
To elevate the system above standard SaaS templates:
*   **Header & Floating Actions:** Use `surface_container_lowest` with a 80% opacity and a `backdrop-blur` of 12px. This creates a "frosted glass" effect that allows the content to feel integrated into a single 3D space.
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#00288e) to `primary_container` (#1e40af) at a 135-degree angle. This adds "soul" and depth to the "Expert's" touchpoints.

## 3. Typography
We utilize a dual-font strategy to balance editorial sophistication with raw functional utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `headline-lg` and `headline-md` for page titles and high-level metrics. It signals the "Editorial" voice of the console.
*   **Body & Labels (Inter):** The workhorse. Use `body-md` for table data and `label-sm` for metadata. Inter’s high x-height ensures readability even when data density is high.
*   **Intentional Asymmetry:** Avoid centering text in large cards. Use flush-left alignment with generous `spacing-12` top-padding to create an architectural, modern look.

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not structural scaffolding.

*   **Ambient Shadows:** For floating elements (like Modals or Tooltips), use a triple-layered shadow:
    *   *Layer 1:* 0px 4px 20px (4% opacity of `on_surface`)
    *   *Layer 2:* 0px 8px 40px (2% opacity of `on_surface`)
    *   This mimics natural light rather than a "drop shadow" effect.
*   **The "Ghost Border" Fallback:** If a separation is required for accessibility (e.g., in a high-density split-panel), use `outline_variant` (#c4c5d5) at **15% opacity**. It should be felt, not seen.
*   **Stateful Depth:** On hover, a card should not grow in size; it should shift from `surface-container-lowest` to `surface-container-high` (#e6e8ea). This "recession" or "lift" is purely tonal.

## 5. Components

### Data Tables (The Core)
*   **Headers:** Use `label-md` in `on_surface_variant` (#444653) with `all-caps` and `0.05rem` letter spacing.
*   **Rows:** No horizontal dividers. Use a subtle `surface-container-low` background on `:hover` and `spacing-3` vertical padding to maintain density without friction.
*   **Status Badges:** Use soft, desaturated backgrounds with high-contrast text. For example, a "Success" badge uses a light green background with `on_tertiary_fixed_variant` text. Use `rounded-full` (9999px) for the radius.

### Clean Summary Cards
*   **Structure:** No borders. Background: `surface-container-lowest` (#ffffff).
*   **Shadow:** Use the Ambient Shadow spec mentioned above.
*   **Content:** Lead with a `title-lg` metric, followed by a `label-sm` descriptor in `secondary` (#515f74).

### Split-Panel Layouts
*   **Function:** Used for student review. The left panel (Master) uses `surface-container-low`, while the right panel (Detail) uses `surface_container_lowest`. 
*   **Visual Separator:** A single vertical "Ghost Border" (15% opacity `outline-variant`).

### Input Fields
*   **Default State:** `surface-container-highest` (#e0e3e5) background with no border. 
*   **Focus State:** A 2px "Ghost Border" using `primary` (#00288e) at 40% opacity and a subtle `primary_fixed` glow.

### Sidebar (The Anchor)
*   **Style:** Fixed. Background: `inverse_surface` (#2d3133). 
*   **Active State:** Use a vertical "pill" indicator in `primary_fixed` (#dde1ff) on the far left edge, with the menu icon shifting to `primary_fixed`.

## 6. Do's and Don'ts

### Do:
*   **Do** use `spacing-1.5` and `spacing-2` for tight data groupings within tables.
*   **Do** lean on typography weight (SemiBold vs Regular) to create hierarchy before reaching for a new color.
*   **Do** use Glassmorphism for the "Top Header" to maintain a sense of place as users scroll through dense data.

### Don't:
*   **Don't** use 1px solid borders to separate list items. Use vertical white space.
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain a premium, ink-on-paper feel.
*   **Don't** use aggressive shadows. If the shadow is the first thing you notice, it is too dark.
*   **Don't** mix Manrope into body paragraphs; keep it strictly for "Display" and "Headline" levels to preserve its impact.