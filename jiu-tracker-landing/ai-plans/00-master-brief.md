# Master Brief

## Objective

Redesign `jiu-tracker-landing` into a premium landing page for a Brazilian Jiu-Jitsu training tracker app. The reference image suggests the right direction:

- dark cinematic background
- large left-aligned hero copy
- strong mobile device mockup on the right
- gradient accents in blue, violet, and warm highlights
- feature cards with glass / metallic surfaces
- repeated conversion opportunities to download the app

The final experience should feel credible for athletes, modern for a mobile SaaS product, and clear enough to convert first-time visitors quickly.

## Product positioning

Jiu Tracker helps practitioners record training sessions, analyze stats, review techniques, and improve performance over time.

Core value propositions:

- track every training session
- view meaningful performance stats
- learn and revisit techniques
- identify strengths, weaknesses, and consistency trends

## Primary audience

- Brazilian Jiu-Jitsu practitioners who train consistently
- hobbyists trying to measure progress
- competitors preparing more intentionally
- coaches or academies evaluating student progress

## Page goals

1. Explain the app in under 10 seconds.
2. Show visual proof that the product exists and looks polished.
3. Build trust with concrete features and meaningful metrics.
4. Drive clicks on primary download CTAs.
5. Leave room for future app-store links, waitlist, analytics, and testimonials.

## UX principles

- Lead with one message and one primary CTA.
- Keep the page scannable with clear sections and short paragraphs.
- Use progressive disclosure: summary first, detail second.
- Every major section should answer one user question:
  - What is this?
  - Why should I care?
  - What can it do?
  - Why trust it?
  - What should I do next?
- Use repeated CTA moments without making the page feel sales-heavy.

## Visual direction

- Background: dark graphite / charcoal with subtle texture, glow, and vignette.
- Surface treatment: soft glassmorphism or brushed-card surfaces with thin borders.
- Accent palette: cool blue, electric indigo, muted cyan, and small warm coral highlights.
- Typography: bold display headings paired with a clean readable body font.
- Composition: asymmetrical hero, centered feature sections, generous spacing, large-radius cards.
- Imagery: real app screenshots inside a believable phone frame or polished UI cards.

## Content language

Portuguese-first, because the reference and likely target audience are in Brazil. Use direct, confident copy. Avoid vague marketing filler.

Example tone:

- "Acompanhe sua evolução no Jiu-Jitsu"
- "Estatísticas detalhadas para treinar com intenção"
- "Registre treinos, analise desempenho e evolua com clareza"

## Proposed page structure

1. Hero
   - logo
   - headline
   - short supporting paragraph
   - primary CTA: download app
   - secondary CTA: explore features / saiba mais
   - app store badges
   - device visual with real app screenshots
2. Product proof section
   - 3 highlighted capability cards
   - examples: treino, estatísticas, biblioteca de técnicas
3. Core features grid
   - 4 to 6 cards with short copy and icons
4. Benefits / insights section
   - explain why analytics matter
   - reinforce differentiation vs plain notes apps
5. Social proof or credibility section
   - placeholder if real testimonials are not ready
   - can temporarily use "feito para praticantes de Jiu-Jitsu"
6. Final CTA band
   - concise headline
   - supporting copy
   - download buttons
7. Footer
   - brand
   - legal / contact / privacy placeholders

## Engineering expectations

- Use semantic sections, headings, lists, buttons, and links.
- Break the page into reusable components if the implementation grows.
- Avoid unnecessary client components; default to server-rendered markup.
- Prefer CSS variables for palette and spacing tokens.
- Use `next/image` for screenshots and hero visuals.
- Keep the page lightweight; avoid animation libraries unless clearly justified.
- Add subtle CSS-based motion only where it supports hierarchy.

## SEO expectations

- Replace default metadata with product-specific title and description.
- Set Portuguese page language if the content remains in Portuguese.
- Ensure one clear `h1`.
- Use structured section headings with natural keywords.
- Add Open Graph / Twitter metadata.
- Use descriptive alt text for product imagery.
- Prepare for future FAQ structured data if content expands.

## Accessibility expectations

- Meet accessible contrast on dark surfaces.
- Keep body copy legible on desktop and mobile.
- Make CTA labels explicit.
- Preserve keyboard focus visibility.
- Respect reduced motion preferences.
- Avoid using screenshots as the only way to communicate important content.

## Performance expectations

- Optimize screenshots before use.
- Limit font choices and weights.
- Defer non-critical imagery below the fold.
- Avoid layout shifts in hero media.
- Keep LCP centered on headline + hero image.

## Success criteria

- The page no longer resembles the default Next starter.
- The first viewport communicates product, audience, and action immediately.
- The design clearly echoes the supplied reference without becoming a clone.
- The site is ready for production content and store links.

## Open assumptions

- App store URLs are not yet finalized.
- Existing screenshots in `public/` are acceptable raw source material.
- Testimonials, pricing, and legal pages can be placeholders for now.
