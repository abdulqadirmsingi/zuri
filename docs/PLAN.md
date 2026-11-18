# PLAN.md — Zuri catalogue and roadmap

Many small, single-purpose components, grouped by area. Each item is a separate registry entry. **Free** = MIT public registry. **Pro** = gated.

## Phase 0 — Foundation (before any component)
Monorepo, tooling, CI, tokens (incl. glass tokens), registry pipeline, docs shell, install-count endpoint, one exemplary component (`button`) proven end-to-end in a fresh test app.

## Phase 1 — Core primitives (Free)
**Actions:** button, icon-button, button-group, toggle, toggle-group, link, copy-button

**Button upgrades (planned, from the owner's reference image, 2026-11-18):** extend `button` with a `destructive` variant (danger-coloured text on a light surface), icon-only sizes (`icon-sm`, `icon`, `icon-lg`, which require an `aria-label`), an optional pill `shape`, automatic icon sizing for leading and trailing icons (for example "Add item" and "Continue →"), and a `loading` state (disabled, `aria-busy`, spinner, which also guards against double submit). `copy-button` shows brief "Copied" feedback, in both a labelled and an icon-only form, announced through a live region and handling clipboard failure. Composed components that import another one (such as copy-button using button) need explicit `@/components/ui/<name>` path aliases in the registry tests and web app, so that decision comes first.
**Inputs:** input, textarea, label, field (label+hint+error), select, combobox, checkbox, radio-group, switch, slider, number-input, search-input, tag-input, file-dropzone
**Display:** badge, avatar, avatar-group, card, separator, kbd, skeleton, spinner, progress, empty-state, stat
**Overlays:** tooltip, popover, dialog, sheet, drawer, dropdown-menu, context-menu, toast, alert, banner
**Navigation:** tabs, accordion, breadcrumbs, pagination, stepper, navbar, sidebar, command-palette
**Glass set:** glass-card, glass-panel, glass-navbar, glass-dock, glass-button, glass-modal, glass-input

## Phase 2 — Payments & fintech (Free core + Pro blocks) ⭐ signature niche
**Small pieces (Free):**
- amount-input (minor units, currency-aware, TZS default)
- currency-select, currency-badge, exchange-rate-chip
- phone-input (E.164, +255 default, country picker)
- card-number-input, card-expiry-input, card-cvc-input, card-holder-input
- card-preview (flip animation, brand detection)
- payment-method-select (card / mobile money / bank / cash / QR)
- mobile-money-provider-select (neutral placeholders; user supplies logos)
- pin-pad (masked, keyboard + touch, shuffle option)
- otp-input (paste, auto-advance, `autocomplete="one-time-code"`)
- transaction-status-badge (pending / success / failed / reversed)
- payment-status-screen (animated success / failure / pending / timeout)
- qr-pay (QR display + countdown + refresh)
- receipt-card, receipt-line-item, receipt-share-button
- balance-card (hide/show, animated number)
- transaction-row, transaction-list (grouped by date, skeleton, empty state)
- fee-breakdown, order-summary, promo-code-input
- send-money-stepper (recipient → amount → confirm → result)
- bill-payment-tile (utilities, airtime, TV; generic icons)
- wakala-withdraw-qr (agent withdrawal via QR concept)
- split-bill, request-money-link, saved-recipient-chip
**Blocks (Pro):** checkout-page, checkout-modal, pricing-table (monthly/yearly), billing-settings, invoice-page, wallet-dashboard, send-money-flow, withdraw-flow, subscription-manager, payout-history.

## Phase 3 — Forms & auth
login-card, signup-card, forgot-password, password-input (strength meter), magic-link-sent, two-factor-card, social-login-buttons, profile-form, settings-section, address-form, multi-step-form, form-wizard, date-picker, date-range-picker, time-picker, calendar, rating-input.

## Phase 4 — Dashboard & data
stat-card, sparkline, area-chart, bar-chart, donut-chart (themed wrappers), data-table (sort/filter/paginate), activity-feed, timeline, notification-bell + panel, kanban-card/board, tree-view, user-menu, org-switcher, usage-meter, **Blocks (Pro):** analytics-dashboard, admin-shell, crm-table, team-members.

## Phase 5 — AI & chat
chat-bubble, chat-thread, prompt-input (attachments, shortcuts), typing-indicator, streaming-text, tool-call-card, source-citation, reasoning-collapsible, agent-status, model-picker, message-actions (copy/regenerate/feedback), conversation-list, voice-input-button. **Blocks (Pro):** ai-chat-app-shell, support-chatbot-widget.

## Phase 6 — Marketing & motion
hero (several variants), feature-grid, logo-cloud, testimonial, faq, cta, footer, pricing-card, stats-band, marquee, animated-number, text-reveal, magnetic-button, spotlight-card, tilt-card, aurora-background, mesh-gradient, dock, confetti, flip-board, scroll-progress, cursor-follow. **Templates (Pro):** SaaS landing, fintech landing, portfolio, docs site.

### Showcase ideas (not scheduled; pull forward when wanted)
Added 2026-11-18 from the owner's inspiration screenshots. Ideas and direction only: build our own, never copy their code, imagery or branding.
- **Curved 3D gallery carousel**: a row of cards bent into a perspective arc that scrolls or drags, for showing templates or products. Needs a keyboard-operable fallback (a plain list or arrow buttons) and a static layout under `prefers-reduced-motion`.
- **Progressive blur edge**: content fades into a blur at the bottom (or top) of a scroller, so cards soften as they leave the view. Pure CSS (a masked, stacked `backdrop-filter`), subject to the glass rules in RULES.md (few blurred layers, no animated blur radius, solid fallback). Text under the blur must stay readable or be hidden from assistive technology.
- **Helix / spiral gallery**: cards arranged on a rising spiral that rotates with scroll or drag, with an index counter and small caption labels. Our own design and our own placeholder imagery. Needs arrow-key and button controls, an accessible list of the items, and a static grid under `prefers-reduced-motion`.
- More hero variants and richer scroll-driven sections (pinned scroll, cursor-reactive effects, looping auto-playing product demos), each with a reduced-motion version.
- Optional grain texture on glass and gradient surfaces.
- Heavier effects (WebGL/shaders) need an ADR first, because they break the dependency and size budgets.

### Interaction patterns to carry into components (from the owner's examples, 2026-11-18)
The owner shared three example components (a password-strength field, an account menu, an expanding icon-button group). Ideas only: write originals, never copy (see docs/SOURCES.md). Their code needs a motion library, a private tokens module and CSS modules, none of which fit a single-file Tailwind registry component as written.
- **Planned originals:** `password-strength` (inputs: segmented meter, rules that tick off, strength word, show/hide toggle, error with a settle), `user-menu` (navigation: identity header, account links, inline theme and status switches, sign out, bottom sheet on narrow screens), `expanding-button-group` (actions: icon buttons where one shows its label, confirm in place, first-tap reveal on touch).
- **Pointer vs keyboard:** a highlight that glides between rows for pointer moves but lands instantly for keyboard moves; focus follows the mouse; an inline switch is one stop in a menu, with left and right choosing inside it; typeahead.
- **State changes that show direction:** a word rises when strength improves and drops when it falls; a counter rolls; a tick draws itself; an error row opens and settles.
- **Measured sizes:** use a ResizeObserver with a sub-pixel tolerance so widths never wobble; make the slot as wide as the longer of two swapped words.
- **Touch and async:** on touch the first tap reveals a label and the second runs the action; an async action stays busy until it settles; a bottom sheet drags down to dismiss.
- **Messages and a11y:** every user-facing string overridable through a `messages` prop (Swahili-ready); a polite live region reports changes; reduced motion must not change the first client render.

## Phase 7 — Mobile and extras
Expo / React Native versions of the most-used payment and form components · MCP server so AI tools can search/install Zuri components · Figma kit · Swahili (`sw`) docs · Vue/Svelte ports (only if demand).

## Site roadmap
1. Landing + docs shell + components browser (Phase 0–1)
2. Install counting + admin dashboard (Phase 0–1)
3. Pro purchase flow, licence keys, authenticated registry (before Phase 2 blocks ship)
4. Public "request a component" + changelog + sponsors
5. Template gallery and "copy prompt" for AI tools

## Release strategy
- Ship Phase 1 + 10 best Phase 2 components first (free) → get users and feedback.
- Launch on X, Product Hunt, Hacker News (Show HN), Reddit r/reactjs, and shadcn registry directories.
- Add Pro once there are real installs and requests.
- Review analytics monthly; double down on what's installed.
