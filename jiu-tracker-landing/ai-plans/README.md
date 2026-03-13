# Jiu Tracker Landing AI Plans

These plans are meant to be used as shared context for parallel agents working on the `jiu-tracker-landing` redesign.

## How to use

1. Read `00-master-brief.md` first. It defines the product goal, visual direction, UX rules, engineering constraints, and page structure.
2. Then assign one agent per specialty file:
   - `01-ux-structure-agent.md`
   - `02-visual-design-agent.md`
   - `03-frontend-agent.md`
   - `04-seo-content-agent.md`
   - `05-qa-performance-agent.md`
3. Keep all outputs aligned with the same target experience:
   - premium dark landing page
   - Portuguese-first copy
   - mobile app promotion
   - strong App Store / Google Play conversion
4. Prefer real product screenshots from `public/` over invented mockups whenever possible.

## Expected execution order

1. UX / structure
2. Visual design
3. SEO / content
4. Frontend implementation
5. QA / performance

## Shared constraints

- Preserve the existing Next.js App Router setup.
- Build a single high-quality marketing page before adding extra routes.
- Ship semantic HTML, accessible contrast, keyboard-safe interactions, and responsive layouts.
- Optimize for Core Web Vitals and crawlable content.
- Do not copy the reference image literally; use it as direction for hierarchy, mood, and composition.
