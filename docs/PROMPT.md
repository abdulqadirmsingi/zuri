# MASTER BUILD PROMPT — Zuri

> Give this whole file to an AI coding agent (Claude Code, Cursor, etc.) together with the other files in this folder. Read `RULES.md`, `COMPONENT_RULES.md`, `PLAN.md` and `ANALYTICS.md` BEFORE writing any code. If anything conflicts, `RULES.md` wins.

## 1. What we are building

**Zuri** (Swahili for "beautiful") is an open-source, full React component library **and** the website that hosts it — a complete "components place" owned and run by me.

- A public website where anyone can browse components, see live previews (light/dark), read the code, copy it, and install it.
- Components are distributed as a **shadcn-compatible registry**: users run
  `npx shadcn@latest add https://zuri.dev/r/<component>.json`
  and the source lands in their project (they own the code). A small number of headless pieces (hooks, utilities, tokens) are also published to **npm** as `@zuri/*` packages.
- Free core under **MIT**. A separate **Pro** tier (premium blocks and templates) that is gated behind an API key and sold through a merchant-of-record payment provider.
- Built-in **analytics**: I must be able to see how many times each component was installed, which ones are popular, where traffic comes from, and how people use the docs site (see `ANALYTICS.md`).
- Strong focus on **fintech / payments / mobile-money UI for East Africa** (Tanzania first), plus AI-chat, dashboards, forms, marketing and motion components. Many small, single-purpose components rather than a few big ones. Full catalogue in `PLAN.md`.

Owner: Abdulqadir Mohammed Msingi, Tanzania. Audience: developers worldwide, with a strong niche in East African products.

## 2. Tech stack (use these unless you have a strong, written reason)

- **Next.js (latest stable, App Router)**, React (latest stable), **TypeScript strict**
- **Tailwind CSS v4** with CSS variables for all design tokens
- **Motion** (`motion/react`) for animation
- **Radix UI** or **Base UI** primitives for accessible behaviour
- **shadcn registry format** (`registry.json` + `shadcn build`) for distribution
- **MDX** for docs content (Fumadocs or a small custom MDX pipeline)
- **Postgres** (Neon or Supabase) + **Drizzle ORM** for analytics data; Upstash Redis allowed for rate limiting/counters
- **Auth for admin/Pro**: Auth.js or Better Auth
- **Payments**: abstract behind an interface; first adapter Polar or Lemon Squeezy (merchant of record). Do not hard-code one vendor.
- **Tests**: Vitest + Testing Library, Playwright (e2e + visual), axe for accessibility
- **Tooling**: pnpm workspaces + Turborepo, Biome or ESLint+Prettier, Changesets, GitHub Actions
- **Hosting**: Vercel (registry JSON served from the site itself)

## 3. Repository layout (monorepo)

```
zuri/
├─ apps/
│  └─ web/                 # Next.js site: landing, docs, component pages, admin dashboard, registry routes
├─ packages/
│  ├─ registry/            # component source + registry.json (the single source of truth)
│  ├─ tokens/              # design tokens (CSS vars, Tailwind theme)
│  ├─ hooks/               # @zuri/hooks  (npm)
│  ├─ utils/               # @zuri/utils  (npm)
│  └─ config/              # shared tsconfig / lint config
├─ docs/                   # PROMPT, RULES, COMPONENT_RULES, PLAN, ANALYTICS, AI_PROMPTS, SOURCES, adr/ (decisions)
├─ .claude/skills/         # design + animation skills (see THIRD_PARTY_NOTICES.md)
├─ AGENTS.md  CLAUDE.md    # entry points for AI tools (stay at the root)
└─ LICENSE (MIT)  README.md  THIRD_PARTY_NOTICES.md  CONTRIBUTING.md  SECURITY.md  CODE_OF_CONDUCT.md  CHANGELOG.md
```

## 4. The website — requirements

**Look and feel.** Premium, modern, calm. **Glassmorphism** as the signature style on the *site itself*: translucent surfaces with `backdrop-filter: blur()`, subtle 1px borders, soft layered shadows, gradient/mesh backgrounds, light and dark themes. Follow `RULES.md` §Glass for contrast and fallback rules (glass must never hurt readability).

**Pages.**
1. Landing page: hero, live interactive demo, category showcase, install command with copy button, social proof (live install counter), Pro teaser, footer.
2. `/components`: filterable, searchable grid by category, tag and "free/pro". Command palette (⌘K).
3. `/components/[slug]`: live preview, light/dark toggle, responsive preview (mobile/tablet/desktop), **Code** tab, install tabs (pnpm / npm / yarn / bun), props table, accessibility notes, variants, related components, install count badge, "copy prompt for AI tools" button.
4. `/blocks` and `/templates`: composed sections and full pages (dashboards, pricing, checkout, auth, AI chat).
5. `/docs`: getting started, installation, theming, dark mode, CLI usage, RSC notes, contributing, FAQ, changelog.
6. `/pricing` (Pro), `/account` (licence key, downloads), `/sponsor`.
7. `/admin` (owner only): analytics dashboard (see `ANALYTICS.md`), component management, Pro licence management.
8. `/r/[name]` registry endpoints (JSON) with install counting.
9. `llms.txt`, `sitemap.xml`, `robots.txt`, OG images per component, RSS for changelog.

**Quality bars (non-negotiable).** Lighthouse ≥ 95 on Performance/Accessibility/Best Practices/SEO; WCAG 2.2 AA; keyboard-complete; `prefers-reduced-motion` and `prefers-color-scheme` respected; no layout shift; responsive from 320px; RTL-safe layout (logical properties); English first, structured for Swahili (`sw`) i18n.

## 5. Components — requirements

Follow `COMPONENT_RULES.md` exactly. Summary: one file per component where possible, minimal dependencies, accessible, themeable via tokens, light/dark, reduced-motion, SSR/RSC-safe (`"use client"` only when needed), typed props with JSDoc, documented variants, tests, and a docs entry with live preview. Build the catalogue in `PLAN.md` phase by phase — **start with Phase 0 and Phase 1, do not jump ahead**.

## 6. Analytics — requirements

Implement `ANALYTICS.md`: install counting at the registry endpoint, privacy-friendly usage analytics on the docs site, and the admin dashboard. No personal data stored. Document exactly what is collected.

## 7. Monetisation — requirements

- Free components: public registry, MIT.
- Pro: registry items behind `Authorization: Bearer <key>` (use shadcn's authenticated-registry support; verify against current shadcn docs). Licence keys issued after purchase via webhook; keys revocable; rate-limited.
- Payment provider behind an interface (`PaymentProvider`) so it can be swapped. Must work for a seller based in Tanzania — document which provider was chosen and why.
- Never store card data. Our *card UI components* are presentation only (see `COMPONENT_RULES.md` §Payments).

## 8. Things the owner may not have thought of — handle them

Licensing and attribution (MIT for free, commercial licence for Pro, third-party notices) · trademark rules for payment-provider logos (don't bundle logos we lack rights to; use neutral placeholders + user-supplied assets) · versioning and changelog (Changesets, semver, registry item `version`) · upgrade path for copied components (diff/"what changed" page) · accessibility audits · bundle-size budget · security (CSP, rate limiting, input validation, dependency audit, secret scanning) · SEO and OG images · privacy policy and cookie-free analytics · contribution guide, issue/PR templates, code of conduct · "request a component" form · status/uptime page · backups of analytics DB · cost controls (caching registry JSON at the edge) · AI-friendliness (`llms.txt`, per-component "copy prompt", optional MCP server later) · documentation of every design decision as an ADR.

## 9. How to work

1. Read all rule files. Summarise the plan back to me in ≤ 15 lines and list any open questions.
2. Scaffold the monorepo, tooling, CI and the token system first. Show me.
3. Build the registry pipeline and ONE exemplary component end-to-end (source → docs page → install via CLI in a fresh test app → install counted). Show me.
4. Then build components in the order of `PLAN.md`. After each batch: run lint, typecheck, tests, a11y checks and the registry build. Fix before continuing.
5. Make small, well-named commits (Conventional Commits). Never commit secrets. Keep `CHANGELOG.md` current.
6. When unsure, ask. Do not invent requirements, brand assets, prices or licence terms.

## 10. Definition of done (per phase)

All checks green in CI · every component has docs, preview, tests and passes `COMPONENT_RULES.md` checklist · registry build succeeds and a fresh Next.js app can install every item · analytics event recorded for each install · Lighthouse targets met · README and docs updated.
