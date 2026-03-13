# QA / Performance Agent

## Mission

Validate that the landing page redesign is visually solid, accessible, performant, and safe to ship.

## Inputs

- `ai-plans/00-master-brief.md`
- implemented page in `src/app`

## Review checklist

1. Responsive layout
   - 320px mobile
   - tablet
   - desktop
   - large desktop
2. Visual integrity
   - hero balance
   - card spacing
   - screenshot cropping
   - CTA prominence
3. Accessibility
   - heading order
   - contrast
   - keyboard focus states
   - reduced motion handling
   - alt text quality
4. Performance
   - image sizing
   - LCP candidates
   - unused heavy assets
   - layout shift
5. SEO
   - metadata present
   - page language correct
   - semantic sections
   - crawlable text content

## Expected outputs

- a prioritized bug / risk list
- recommendations for polish before launch
- testing notes covering:
  - lint
  - build
  - manual responsive review

## Quality thresholds

- No blocking accessibility issues.
- No broken layout at common mobile widths.
- Hero loads cleanly without jank.
- Primary CTA remains visible early in the page.
- Metadata is product-specific and no starter defaults remain.

## Definition of done

- The landing page is ready for final stakeholder review or production polish.
