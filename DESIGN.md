---
version: 1
name: salfranio-github-pages-design
description: A compact engineering-portfolio design system for Song Zihan's GitHub Pages site, inspired by the DESIGN.md approach from awesome-design-md. The page should feel like a public project cockpit: precise, technical, readable, and dynamic without exposing secrets or requiring a backend.
---

# Design Direction

This site is a personal technical portfolio, not a marketing landing page. The first screen must immediately show Song Zihan, the current research direction, and proof that the work is concrete: public repos, project metrics, progress states, and contact links.

The visual language is "engineering cockpit":

- Light canvas, crisp hairlines, restrained shadows.
- Black ink for primary actions and headings.
- Blue / teal / violet / pink / amber as small system accents and progress signals.
- Mono labels for technical metadata; sans-serif for readable Chinese and English prose.
- Dynamic behavior should support browsing projects, not distract from them.

# Tokens

## Colors

- `canvas`: `#fafafa` for the page background.
- `surface`: `#ffffff` for cards, inputs, and panels.
- `surface-soft`: `#f4f5f7` for chips and inset controls.
- `ink`: `#171717` for headings, primary actions, and active states.
- `body`: `#4b5563` for paragraph text.
- `muted`: `#7b8491` for metadata.
- `hairline`: `#e6e8ec` for borders.
- `blue`: `#0070f3` for primary system accent.
- `teal`: `#00b8a9`, `violet`: `#6d28d9`, `pink`: `#e11d74`, `amber`: `#f59e0b` for progress and graph accents.

## Typography

- Use system sans for all body and display text: `Inter, system-ui, Noto Sans SC, Microsoft YaHei`.
- Use system monospace for metadata, labels, and technical kickers: `ui-monospace, SFMono-Regular, Menlo, Consolas`.
- Display headings should be large but controlled, weight around 650.
- Letter spacing stays `0`; do not use squeezed or decorative typography.

## Shape And Depth

- Card radius: `8px` maximum unless an element is intentionally a pill.
- Primary and secondary CTAs use pill shape.
- Cards use hairline border plus small stacked shadows; avoid heavy floating shadows.
- Page sections are full-width or constrained layouts, not nested cards inside cards.

# Components

## Header

Sticky header with:

- Left brand lockup: `SZH` mark + `Song Zihan`.
- Center navigation in a pill shell on desktop.
- Right email CTA.

Mobile may hide the nav, but the brand and email CTA remain visible.

## Hero

Hero must include:

- A direct headline about building runnable AI systems.
- Rotating topic text.
- A profile panel with GitHub avatar and project metrics.
- A subtle animated knowledge-network canvas.

Do not add a split marketing hero with a decorative illustration. The hero should be the working interface signal.

## Project Index

Projects are presented through:

- A left tab list.
- A right spotlight panel that updates in place.
- Metrics, current status, tags, and repository links where public.

The user should be able to understand each project without reading a resume-style wall of text.

## GitHub Lab

The GitHub section reads only public GitHub API data. It must not use private tokens in client-side code.

Required controls:

- Search input.
- Sort select.
- Language filter strip.
- Repository cards with language, stars, update date, and links.

## Progress

Progress should be honest and staged. Percent values are presentation summaries, not formal scientific metrics. Exact research metrics should remain in the project content.

# Do

- Keep Chinese-first copy with concise English technical labels.
- Keep text readable on mobile and desktop.
- Use dynamic interactions to make project browsing faster.
- Preserve the no-secret rule: no model API keys, no GitHub tokens, no private data in frontend code.
- Use public, stable links for GitHub and contact.

# Don't

- Do not deploy model API calls directly from GitHub Pages.
- Do not create a pure landing page that hides the actual projects.
- Do not dominate the site with one hue family.
- Do not add decorative gradient blobs or unrelated stock imagery.
- Do not put nested cards inside cards.
- Do not make body copy mono or all-caps.
