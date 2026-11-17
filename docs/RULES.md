# RULES.md — Project rules for Zuri

These rules apply to every human and AI contributor. If a rule must be broken, write an ADR in `docs/adr/` explaining why.

## 1. Principles
1. **Own-the-code**: components are copied into users' projects. Keep them small, readable, dependency-light.
2. **Accessible by default**, not as an afterthought.
3. **Boring tech, beautiful result**: use well-known tools; spend the effort on design and motion quality.
4. **Never guess**: no invented prices, licence terms, brand assets, statistics or API behaviour. Verify against current docs, or ask.
5. **Small steps**: one concern per commit and per PR.

## 2. Code
- TypeScript `strict: true`; no `any` (use `unknown` + narrowing); no `@ts-ignore` without a linked reason.
- Prefer named exports. No default exports except where Next.js requires them.
- Functional components, hooks; forward refs and spread remaining props onto the root element.
- No hard-coded colours, radii, shadows or durations: use tokens (`packages/tokens`).
- Use `cn()` (clsx + tailwind-merge) for class composition; variants via `cva`.
- Server Components by default; add `"use client"` only for state, effects, or browser APIs, and keep the client boundary as small as possible.
- No `dangerouslySetInnerHTML` with unsanitised input. Validate all external input with Zod.
- No side effects at import time. No access to `window`/`document` during render.
- Files: kebab-case; components PascalCase; one component per file; colocate `*.test.tsx` and docs.
- Comments explain *why*, not *what*.

## 3. Dependencies
- Allowed in components: `react`, `motion`, Radix/Base UI primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` (icons).
- Anything else needs justification in the PR. Each extra dependency must be declared in the registry item so the CLI installs it.
- Run `pnpm audit` in CI; pin versions through the lockfile; enable Dependabot or Renovate.

## 4. Styling and tokens
- Tailwind v4 + CSS variables. Tokens: colour (semantic: `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring`, `--success`, `--warning`, `--danger`), radius, spacing, shadow, blur, duration, easing, z-index.
- Support light and dark via a class or `data-theme` attribute; also honour `prefers-color-scheme` by default.
- Use logical properties (`ms-*`, `ps-*`, `start`/`end`) so layouts work in RTL.
- Fluid, mobile-first layouts. Minimum supported width 320px.

### Glass (glassmorphism) rules
- Glass = `backdrop-filter: blur(var(--glass-blur))` + translucent background + 1px border at low opacity + soft shadow.
- **Contrast first**: text on glass must meet WCAG AA (4.5:1 body, 3:1 large) against the *worst-case* backdrop. If it can't, increase the surface opacity.
- Provide a **fallback** with `@supports not (backdrop-filter: blur(1px))` → solid surface.
- Respect `prefers-reduced-transparency` where supported → solid surface.
- Limit to a few glass layers per view (performance). Never nest more than two blurred layers. Avoid animating blur radius.

## 5. Motion
- Animate `transform` and `opacity` only where possible. Never animate layout properties on large trees.
- Springs for interactive feedback, short eased tweens for state changes. Durations from tokens (typically 120–300 ms).
- **Always** honour `prefers-reduced-motion` (replace movement with fades or nothing).
- Animations must never block interaction or hide essential information.

## 6. Accessibility (WCAG 2.2 AA)
- Native elements first; ARIA only to fill gaps. Correct roles, names, states.
- Full keyboard support, visible focus ring (`:focus-visible`), logical tab order, focus trap and return for overlays, `Esc` closes.
- Target size ≥ 24×24 CSS px (prefer 44×44 on touch).
- Don't rely on colour alone; provide text/icon.
- Live regions for async status (toasts, payment status).
- Test with axe in CI and manually with a screen reader for complex widgets.

## 7. Performance
- Per-component budget: ≤ 6 kB gzipped of own code (excluding shared deps) unless justified.
- Lazy-load heavy previews on the site; use `next/image`, `next/font`; avoid layout shift.
- Cache registry JSON at the edge; invalidate on deploy.

## 8. Testing
- Unit/behaviour: Vitest + Testing Library (render, interaction, keyboard, ARIA).
- Accessibility: `vitest-axe` or Playwright + axe on every component page.
- E2E: Playwright — install every registry item into a fresh Next.js fixture app and build it.
- Visual regression: Playwright screenshots (light/dark, mobile/desktop) for key components.
- Bug fix ⇒ regression test.

## 9. Security and privacy
- Secrets only in environment variables; `.env*` is git-ignored; `.env.example` documents keys. Enable secret scanning.
- Registry and admin endpoints: rate limiting, input validation, least-privilege DB role.
- CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` headers.
- Analytics: no IPs stored (see `ANALYTICS.md`), no cookies for anonymous visitors, honour Do-Not-Track.
- Pro keys: stored hashed; shown once; revocable.
- Never store or transmit card, PIN or mobile-money credentials from any component or demo.

## 10. Git, releases and docs
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`…). Small PRs with description and screenshots/recordings for UI changes.
- Changesets for versioning; semver; `CHANGELOG.md` updated every release.
- Every public component has a docs page (live preview, props, a11y notes, install command).
- Licence: MIT for free items; Pro items under the commercial licence in `LICENSE-PRO.md` (to be written with a lawyer — do not invent legal terms).
- Third-party code/assets: record licence and attribution in `THIRD_PARTY_NOTICES.md`. Don't bundle third-party brand logos without permission.

## 11. AI-agent behaviour
- Read the rule files first. Explain the plan briefly before large changes.
- Run lint, typecheck, tests and registry build before declaring done; report honestly what was and wasn't verified.
- Don't delete or rewrite files outside the task. Don't add dependencies silently.
- Ask when requirements are ambiguous or involve money, legal text, or brand assets.
