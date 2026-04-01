# Design System Specification: High-End Productivity Experience

## 1. Overview & Creative North Star
**Creative North Star: The Kinetic Chronometer**

This design system moves beyond the "static dashboard" trope to create a living, breathing environment for high-stakes focus. The objective is to evoke the precision of a high-end mechanical watch—complex yet legible, premium yet functional. 

We break the "standard template" look by rejecting the rigid 1px border. Instead, we define space through **Tonal Sculpting**: using the subtle shifts between deep charcoals and slates to guide the eye. By utilizing intentional asymmetry in sidebar widths and overlapping "glass" surfaces, we create a UI that feels "tech-native" and editorial rather than generic.

---

## 2. Color Theory & Surface Strategy

The palette is rooted in deep obsidian tones, punctuated by a hyper-chromatic "Electric Indigo."

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` task list sitting on a `surface` background provides all the separation a professional user needs without the visual noise of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of obsidian glass.
- **Base Layer**: `surface` (#131315) - The global canvas.
- **Primary Workspaces**: `surface-container-low` (#1c1b1d) - Main content areas.
- **Interactive Elements**: `surface-container` (#201f22) - Hover states or active modules.
- **Prominent Cards**: `surface-container-high` (#2a2a2c) - Critical task items or focus blocks.

### The "Glass & Gradient" Rule
To achieve a "signature" feel, floating elements (Modals, Popovers, Context Menus) must use **Glassmorphism**. Apply `surface-container-highest` with a 70% opacity and a `24px` backdrop-blur. 

**Signature Texture:** Main CTAs should utilize a linear gradient from `primary` (#c0c1ff) to `primary-container` (#8083ff) at 135 degrees. This provides a "soul" to the action that a flat hex code cannot replicate.

---

## 3. Typography: Editorial Authority

We use **Inter** as our core typeface, focusing on extreme weight contrast to establish hierarchy.

| Level | Size | Weight | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | 3.5rem | 700 (Bold) | -0.04em | High-impact data metrics (e.g., Total Focus Time) |
| **Headline-SM** | 1.5rem | 600 (Semi) | -0.02em | Section headers within the dashboard |
| **Title-MD** | 1.125rem | 500 (Med) | 0 | Card titles and task names |
| **Body-MD** | 0.875rem | 400 (Reg) | 0 | General descriptive text and inputs |
| **Label-SM** | 0.6875rem | 600 (Semi) | +0.05em | Uppercase status labels and metadata |

**Typography Rule:** All `label-sm` elements must be set in All Caps with the specified letter-spacing to provide an "architectural" feel to the data.

---

## 4. Elevation & Depth: Tonal Layering

We convey hierarchy through material depth rather than structural lines.

- **The Layering Principle:** Place a `surface-container-lowest` (#0e0e10) card within a `surface-container-low` (#1c1b1d) section to create a "recessed" effect for secondary data.
- **Ambient Shadows:** When a "floating" effect is required (e.g., a dragged task), use a shadow with a `32px` blur and `6%` opacity. The shadow color should be a tinted version of the indigo `primary-fixed-dim` to mimic light refraction.
- **The Ghost Border Fallback:** If a border is required for accessibility (e.g., Input focus), use `outline-variant` (#464554) at 20% opacity. 100% opaque borders are forbidden.

---

## 5. Components

### Buttons & Chips
- **Primary Action**: Gradient fill (`primary` to `primary-container`), roundedness `md` (0.375rem). No border.
- **Secondary Action**: Background `surface-container-highest`, `on-surface` text.
- **Chips**: Use `surface-container-low` for filter chips. Active chips should use a "Ghost Border" of the `primary` color at 40% opacity.

### Lists & Tables (The "Zero-Divider" Approach)
- Forbid 1px dividers between list items.
- Use **Vertical White Space**: Use the `spacing-4` (0.9rem) or `spacing-5` (1.1rem) scale to separate tasks. 
- Use **Zebra Striping**: Apply `surface-container-low` to alternating rows in complex tables to maintain legibility without lines.

### Input Fields
- **Default State**: `surface-container-highest` background, no border.
- **Focus State**: 1px "Ghost Border" of `primary` (#c0c1ff).
- **Error State**: Text in `error` (#ffb4ab), background remains dark to maintain focus.

### Additional Signature Component: The "Focus Ring"
A minimalist progress ring (circular chart) used for streaks. Use `primary` (#c0c1ff) for the progress and `surface-container-highest` (#353437) for the track. The track should have a `2px` stroke, while the progress has a `4px` stroke to create a layered, "raised" visual.

---

## 6. Do's and Don'ts

### Do
- **Do** use `surface-container-lowest` for the "Sidebar" background to create a grounding anchor for the application.
- **Do** lean into asymmetry. A wider left margin on a header conveys a bespoke, editorial feel.
- **Do** use `tertiary` (#ffb783) sparingly for "Warning" or "Slow down" states to provide a warm counterpoint to the cool indigo.

### Don't
- **Don't** use pure black (#000000) or pure white (#ffffff). It breaks the "high-end obsidian" aesthetic.
- **Don't** use standard 1px lines to separate sidebar items. Use a 4px vertical "pill" of `primary` color to the left of the active nav item instead.
- **Don't** use high-intensity drop shadows. If you can clearly see where the shadow ends, it is too heavy. Decrease opacity and increase blur.

### Spacing Reference
Always use the defined spacing scale. For card padding, default to `spacing-6` (1.3rem) for a spacious, "breathable" luxury feel. For tight metadata, use `spacing-2` (0.4rem).