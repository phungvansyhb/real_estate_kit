---
name: elite-ui-design
description: >
  Use this when designing or refining pages, sections, dashboards, forms, cards,
  and responsive layouts that should feel modern, premium, clean, and polished
  in ListingKit. Guides the agent to produce elegant UI with strong hierarchy,
  mobile-first responsiveness, shadcn/ui consistency, and conversion-focused
  composition.
---

# Elite UI Design for ListingKit

Use this skill when the user asks for a UI that should feel **modern, elite, clean, responsive, and production-ready**.

This skill is about **visual quality, composition, hierarchy, spacing, responsiveness, and polish** — not just “make it look nicer”.

---

## Primary goal

Design interfaces that feel:

- **Premium** — calm, confident, high-trust
- **Clean** — minimal noise, clear hierarchy, generous spacing
- **Modern** — strong typography, balanced surfaces, subtle motion/state feedback
- **Responsive** — excellent on mobile first, then enhanced for tablet and desktop
- **Useful** — every visual choice supports the user’s task or conversion goal

---

## Non-negotiable rules for this project

1. **Use shadcn/ui first**. Before inventing a UI pattern, check existing components in `src/components/ui/` and `src/components/primitives/`.
2. **Do not add another UI library**.
3. **Use Server Components by default**. Only add `"use client"` if interaction truly requires it.
4. **All visible UI text must support translation** in Vietnamese and English.
5. **All buttons must include an icon**, with **text before icon**.
6. **Do not hardcode noisy decoration**. Prefer restraint over flashy effects.
7. **Do not import Supabase directly in UI layers**.
8. **Prefer composition over custom one-off components** when existing primitives already solve the problem.

If needed, also load the `shadcn-ui` skill.

---

## Design mindset

When creating or improving UI, think in this order:

1. **Clarity** — what should the user notice first?
2. **Hierarchy** — what is primary, secondary, tertiary?
3. **Spacing** — can the layout breathe?
4. **Consistency** — does it match surrounding screens?
5. **Responsiveness** — is mobile excellent, not merely tolerated?
6. **Polish** — hover, focus, loading, empty, and error states feel intentional

Good UI here should feel like a focused SaaS product for real estate professionals — not a generic template and not an over-decorated marketing page.

---

## Visual principles

### 1. Strong hierarchy

- Make the page objective obvious in the first screenful.
- Use one clear primary CTA per area.
- Group related content into clean sections.
- Reduce visual competition: if everything is loud, nothing is important.

### 2. Premium spacing

- Prefer generous spacing over dense packing.
- Use consistent vertical rhythm.
- Avoid cramped cards, crowded forms, and tight table controls.
- Let headings, descriptions, and actions breathe.

### 3. Calm surfaces

- Prefer soft borders, subtle shadows, muted backgrounds.
- Use accent colors intentionally, not everywhere.
- Avoid stacking too many nested boxes inside boxes.
- Use radius consistently; do not mix many visual styles on one screen.

### 4. Readable typography

- Use typography to create hierarchy before using color.
- Keep body text easy to scan.
- Avoid long lines of text on desktop; keep content width controlled.
- Descriptions should support action, not overwhelm it.

### 5. Responsive composition

- Design mobile-first.
- Stack content naturally on small screens.
- Upgrade to multi-column layouts only when content truly benefits.
- Preserve clear tap targets and spacing on touch devices.

---

## Layout heuristics

### Containers and width

- Prefer centered content with a controlled max width.
- Use wider layouts only for dashboards, tables, or analytics-heavy screens.
- Avoid full-width text blocks when a narrower content column improves readability.

### Section structure

A clean section often follows this structure:

1. Eyebrow or context label (optional)
2. Strong section heading
3. Short supporting description
4. Primary action(s)
5. Main content block

### Grid usage

- **Mobile:** usually 1 column
- **Tablet:** 2 columns when cards are comparable
- **Desktop:** 3+ columns only if scanning improves
- Do not force symmetric grids when content lengths are clearly uneven

### Cards

Good cards should have:

- a clear title
- short supporting metadata
- one dominant action
- restrained secondary actions
- predictable padding

Avoid cards that try to show everything at once.

### Forms

- Keep forms visually calm and easy to complete
- Group related fields into sections
- Use 1 column on mobile by default
- Use 2 columns only when it reduces scroll without harming clarity
- Show helper text only where it genuinely reduces confusion
- Error messages must be visible and near the field

---

## Interaction and state quality

Every polished UI should consider:

- `hover` state
- `focus-visible` state
- disabled state
- loading state
- empty state
- error state
- success feedback
- skeletons or placeholders where content delay is expected

Do not ship a “finished” UI that only looks good in its default state.

---

## Styling guidance for a modern premium look

Prefer:

- clean spacing
- muted backgrounds
- subtle borders
- limited accent usage
- concise copy
- crisp icon usage
- strong CTA contrast
- shallow visual depth

Avoid:

- gradient overload
- too many badge colors
- heavy shadows everywhere
- dense toolbars
- long paragraphs in cards
- inconsistent icon sizing
- too many actions competing in one row
- decorative elements that do not support comprehension

---

## Responsive checklist

When building responsive UI, verify:

- content stacks cleanly below `md`
- primary CTA remains visible and easy to tap
- cards do not become cramped at intermediate breakpoints
- tables degrade gracefully or switch to card/list presentation when needed
- text does not overflow or wrap awkwardly
- modals/sheets are usable on small screens
- spacing remains intentional across breakpoints
- images keep stable aspect ratios

If a layout feels “desktop shrunk onto mobile”, redesign it.

---

## ListingKit-specific design patterns

### Public listing / marketing surfaces

- Lead with the property or value proposition
- Use large, confident media blocks
- Keep metadata scannable
- Make inquiry / booking CTA obvious
- Build trust with clean facts, not clutter
- Keep sections digestible: overview, gallery, highlights, location, contact

### Dashboard surfaces

- Prioritize clarity and speed of use
- Show the most important metrics first
- Keep filters and actions easy to scan
- Use cards, tables, tabs, and sheets carefully
- Avoid turning dashboards into visually busy admin panels

### Empty states

A good empty state should include:

- a clear title
- one sentence explaining the situation
- one primary next step
- optional supportive secondary action

### CTAs

For this project, CTA buttons should:

- use clear action-first labels
- include icons
- place text before icon
- avoid vague wording like “Submit” when a concrete action is better

---

## Recommended implementation workflow

When using this skill, follow this process:

1. **Identify the screen goal**
   - Is it conversion, management, review, input, or exploration?
2. **Audit existing patterns**
   - Reuse nearby layouts, primitives, and shadcn components where possible.
3. **Plan the hierarchy**
   - Decide what is primary, what is supportive, and what can be removed.
4. **Compose the layout mobile-first**
   - Build the smallest-screen experience first.
5. **Improve desktop intentionally**
   - Add columns, sticky side panels, or denser layouts only when useful.
6. **Polish states**
   - Add loading, empty, hover, focus, validation, and disabled states.
7. **Review visual noise**
   - Remove anything that does not improve clarity or trust.

---

## What the agent should actively do

When this skill is active, the agent should:

- favor elegant composition over decorative complexity
- simplify cluttered layouts
- improve spacing and hierarchy before adding new visual flourishes
- reuse shadcn/ui and project primitives
- choose responsive layouts deliberately, not mechanically
- add helpful empty/loading/error states when missing
- keep copy concise and action-oriented
- ensure buttons include icons and remain consistent with project rules
- keep the final UI aligned with ListingKit’s premium SaaS identity

---

## What the agent should avoid

Do not:

- create visually noisy screens just to look “fancy”
- overload the interface with gradients, color accents, or shadow depth
- use tiny text or dense layouts to fit more content
- create custom components when shadcn/ui already covers the need
- make desktop-first layouts that collapse poorly on mobile
- add multiple competing primary actions in the same view
- ignore empty/loading/error states
- hardcode display text without translation support

---

## Definition of done

A UI task is only complete when:

- the layout feels clean and intentional
- the primary action is obvious
- spacing and hierarchy are consistent
- the screen works well on mobile and desktop
- the design matches existing ListingKit patterns
- text is translation-ready
- button/icon rules are respected
- loading, empty, and error states are handled where relevant

If the result is merely functional but not polished, continue refining.
