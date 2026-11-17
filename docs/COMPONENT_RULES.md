# COMPONENT_RULES.md — How every Zuri component must be built

Use this as a checklist. A component is **not done** until every applicable box is true.

## 1. Anatomy
```
packages/registry/src/<category>/<name>/
├─ <name>.tsx          # the component (single file the user copies)
├─ <name>.test.tsx     # behaviour + a11y tests
├─ <name>.mdx          # docs: description, examples, props, a11y notes
└─ <name>.registry.json  # registry item metadata (deps, files, categories)
```

## 2. API design
- [ ] Small, predictable API. Props are typed, JSDoc'd, and have sensible defaults.
- [ ] Extends native element props (`React.ComponentProps<"button">` etc.) and spreads `...props` on the root.
- [ ] `ref` forwarded to the root element (React 19 ref-as-prop or `forwardRef`).
- [ ] `className` merged with `cn()` so consumers can override.
- [ ] Variants/sizes via `cva`; names consistent across the library (`size: "sm" | "md" | "lg"`, `variant: "default" | "outline" | "ghost" | "glass"`).
- [ ] Controlled **and** uncontrolled modes for stateful inputs (`value`/`defaultValue`/`onValueChange`).
- [ ] Composition over configuration (sub-components like `Card.Header`) for complex pieces.
- [ ] No hidden global state; no required context unless documented.

## 3. Visual
- [ ] Uses tokens only (no raw hex, px shadows, magic durations).
- [ ] Looks right in light **and** dark.
- [ ] Looks right at 320px and at wide screens; no overflow; long text truncates/wraps gracefully.
- [ ] All states designed: default, hover, focus-visible, active/pressed, disabled, loading, error, empty (where relevant).
- [ ] Glass variant (if provided) meets `RULES.md` §Glass contrast + fallback rules.
- [ ] RTL-safe (logical properties; mirrored icons where needed).

## 4. Motion
- [ ] Uses `motion` sparingly; transform/opacity only.
- [ ] Honours `prefers-reduced-motion` (via `useReducedMotion` or CSS media query).
- [ ] No animation on first paint that delays content for more than ~300 ms.
- [ ] Interruptible; never traps the user.

## 5. Accessibility
- [ ] Correct semantic element/role, accessible name, state attributes.
- [ ] Full keyboard operation, visible focus, focus management for overlays.
- [ ] Screen-reader tested for non-trivial widgets (dialogs, menus, comboboxes, OTP, sliders).
- [ ] Status changes announced (`aria-live`) where relevant.
- [ ] Contrast AA; target sizes OK; not colour-only.
- [ ] axe test passes.

## 6. Technical
- [ ] SSR/RSC-safe; `"use client"` only if required; no `window` access during render; no hydration mismatches (e.g. random IDs → `useId`).
- [ ] No runtime errors in React StrictMode.
- [ ] Minimal dependencies; each declared in the registry item.
- [ ] ≤ 6 kB gzipped own code (justify exceptions).
- [ ] Works with Next.js App Router, Vite, and Remix (state any limitation in docs).
- [ ] Tree-shake friendly; no side effects at import.
- [ ] Images/icons: inline SVG or `lucide-react`; no external requests at runtime.

## 7. Docs (every component page)
- [ ] One-paragraph purpose; when to use / not to use.
- [ ] Live preview + light/dark + responsive toggle.
- [ ] Install tabs: pnpm / npm / yarn / bun, and manual copy.
- [ ] Usage example(s) and every variant.
- [ ] Props table generated from types.
- [ ] Accessibility notes (keyboard map, ARIA).
- [ ] Customisation (tokens used) and known limitations.
- [ ] Changelog entry when changed.

## 8. Testing
- [ ] Renders without crashing; snapshot only for pure presentational parts.
- [ ] Interaction + keyboard tests.
- [ ] axe test.
- [ ] Included in the e2e "install into fresh app and build" matrix.
- [ ] Visual screenshot (light/dark).

## 9. Registry item
- [ ] `name` (kebab-case), `type` (`registry:ui` | `registry:block` | `registry:hook` | `registry:lib`), `title`, `description`, `categories`, `dependencies`, `registryDependencies`, `files`.
- [ ] `version` and `tier: "free" | "pro"` set in `meta`.
- [ ] CSS variables the component needs are declared via the item's `cssVars`.
- [ ] Installs cleanly into a fresh Next.js + Tailwind v4 + shadcn project with zero manual edits.

## 10. Category-specific rules

### Payments / fintech components
- **Presentation only.** Never store, log, or send card numbers, CVC, PINs or mobile-money credentials. Components emit values via callbacks; the consumer's backend/PSP-hosted fields do the secure handling. State this on every payment component's docs page.
- Card input: Luhn validation, brand detection from BIN ranges, auto-formatting, `autocomplete` tokens (`cc-number`, `cc-exp`, `cc-csc`, `cc-name`), `inputmode="numeric"`, never log values.
- Money: use integer minor units + `Intl.NumberFormat` with explicit currency (support TZS, KES, UGX, USD, EUR…); no floating-point maths for amounts.
- Phone: E.164 output, country picker with `+255` default, paste-friendly.
- Mobile-money provider pickers use **neutral placeholder marks**; consumers supply licensed logos. Do not ship third-party trademarks.
- Status components (pending / success / failed / timeout) announce changes to screen readers and never rely on colour alone.
- Always show clear error and retry states; handle slow networks (skeletons, timeouts).
- Idempotency and double-submit protection hints in docs (disable button while pending).

### Overlays (dialog, sheet, popover, toast)
- Focus trap + restore, scroll lock, `Esc`, outside-click rules, `aria-modal`, portal rendering, z-index from tokens.

### Forms
- Label always associated; helper and error text linked with `aria-describedby`; `aria-invalid`; works with `react-hook-form` and native forms (`name`, `form`, `required`).

### Data display (tables, charts)
- Keyboard navigable, sortable with `aria-sort`, empty/loading/error states, responsive strategy, large-data note (virtualisation optional).

### AI / chat
- Streaming text with `aria-live="polite"` throttled; stop/regenerate controls; safe markdown rendering (sanitised); handle long outputs without layout jump.

### Motion / decorative
- Purely decorative elements `aria-hidden`; must degrade to static under reduced motion.
