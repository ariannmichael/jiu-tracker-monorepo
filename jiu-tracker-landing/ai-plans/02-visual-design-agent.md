# Visual Design Agent

## Mission

Translate the reference image into a distinctive, production-ready visual system for the landing page without copying it literally.

## Inputs

- `ai-plans/00-master-brief.md`
- `ai-plans/01-ux-structure-agent.md`
- real product screenshots already stored in `public/`

## Deliverables

1. Visual system direction:
   - color palette
   - typography pairing
   - shadows
   - borders
   - gradients
2. Section-by-section visual guidance.
3. Card and button patterns.
4. Mobile adaptation rules.
5. Motion guidance that can be implemented with CSS only.

## Design constraints

- Dark theme is the primary visual mode.
- The page should feel premium and athletic, not generic SaaS.
- Use restrained glow and blur; avoid excessive neon.
- UI panels should feel intentional and readable, not decorative noise.
- Store badges and screenshots should sit comfortably inside the composition instead of floating randomly.

## Visual recommendations

- Background base: very dark graphite with layered radial gradients.
- Accent colors:
  - blue for primary CTA
  - indigo / violet for charts and highlights
  - small coral / orange accent for contrast in metrics
- Headings:
  - strong, compact, slightly rounded or geometric sans
- Body:
  - neutral sans with excellent readability on dark surfaces
- Cards:
  - semi-transparent dark panels
  - 1px subtle border
  - large radius
  - soft inner highlight

## Component guidance

- Hero CTA:
  - filled primary button
  - outlined or low-emphasis secondary button
- Feature cards:
  - one visual anchor per card
  - short headline
  - one or two lines of copy
- Device mockup:
  - use a high-quality frame or a carefully rounded screenshot container
  - avoid fake reflections that look synthetic

## Definition of done

- The page immediately evokes the supplied reference in mood and hierarchy.
- The design still feels like a custom product page, not a traced imitation.
- The visuals are implementable with the current Next.js and CSS stack.
