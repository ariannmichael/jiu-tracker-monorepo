# Frontend Agent

## Mission

Implement the new landing page in `jiu-tracker-landing` using clean App Router patterns, maintainable styling, and strong performance defaults.

## Inputs

- `ai-plans/00-master-brief.md`
- `ai-plans/01-ux-structure-agent.md`
- `ai-plans/02-visual-design-agent.md`

## Scope

- replace the default `src/app/page.tsx`
- update `src/app/globals.css`
- update `src/app/layout.tsx` metadata and language where needed
- reuse existing assets from `public/` when suitable

## Implementation requirements

- Keep the page mostly server-rendered.
- Use semantic markup with clear heading levels.
- Build reusable section components only if they reduce duplication materially.
- Use `next/image` for screenshots and badges.
- Use CSS variables for tokens:
  - colors
  - gradients
  - spacing
  - border styles
- Ensure strong responsive behavior from 320px upward.
- Avoid over-engineering animation.

## Suggested technical breakdown

1. Metadata and language setup
2. Global design tokens in CSS
3. Hero section
4. Feature proof cards
5. Feature grid
6. Final CTA and footer
7. Responsive refinement
8. Performance and accessibility pass

## Quality bar

- No placeholder Next.js starter content remains.
- No layout shift from hero visuals.
- No inaccessible text on dark cards.
- Links and buttons have visible hover and focus states.
- Markup remains understandable without CSS.

## Definition of done

- The landing page is production-grade, responsive, and clearly aligned with the visual brief.
- The code is simple enough for future edits by another engineer without re-learning the whole page.
