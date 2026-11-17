# SOURCES.md — Reference material on the owner's machine

The owner (Abdulqadir) keeps two relevant folders on this Mac. The agent may **read** them for patterns and take generic pieces, following the rules below. Never modify them, never copy secrets, and never commit anything from them without the checks in §3.

## 1. `~/Documents/intelyflow` — the owner's product (Vite + React + Tailwind + shadcn)
Useful places (verified to exist):
- `src/components/ui/` — large set of primitives: button, card, dialog, drawer, sheet, tabs, table, select, combobox, searchable-select, calendar, date-picker, date-field, date range pickers, command, input-otp, password-input, toast / toast-stack, skeleton, loaders (ai-loader, brain-loader, preloader), sidebar, chart, testimonials-columns, list-empty-state, **NumberInput**, **PhoneNumberField**, ConfirmDialog, DeleteConfirmDialog, TablePagination.
- `src/components/ai/` — chat UI: **ChatComposer, ChatThread, ConversationList, Markdown, VoiceRecorder, InsightCard**, loaders and orb.
- `src/components/pricing/` — **BillingPeriodToggle**, plan card background, calculator.
- `src/components/receipts/` — **ReceiptTemplate, ReceiptPreview, PrintButton** (good base for Zuri `receipt-card`).
- `src/components/pinui/` — **PromptComposer, CalendarCard** (see §3: these look derived from Pin UI — check licence first).
- `src/theme/` — appearance/scheme/palette system (light/dark, tones) — study for Zuri's token and theme-switching design.
- `src/components/common/` — CookieConsent, LanguageSwitcher, SessionTimeoutModal (generic candidates).
- `.cursor/rules/` (`ui-design.mdc`, `tailwind-clean-code.mdc`, `mobile-responsive.mdc`, `CLAUDE.md`) — the owner's existing conventions: **read these and align Zuri's rules with them** where they don't conflict with `RULES.md`.

**Good candidates to generalise into Zuri** (strip business logic, i18n keys, API calls, Intelyflow branding): number-input, phone-input, otp-input, password-input, searchable-select/combobox, date-range-preset-picker, table-pagination, confirm-dialog, list-empty-state, toast-stack, billing-period-toggle, receipt-card, chat-composer, chat-thread, markdown renderer, voice-recorder, loaders.
**Do NOT take:** anything tied to inventory, accounting, payroll, garage, restaurant, logistics, super-admin, Supabase/API services, auth flows, analytics/Sentry wiring, or private business data. `.env*` files must never be read into Zuri.

## 2. `~/Documents/skills` — design and animation skills (by Emil Kowalski, MIT)
A repo of agent skills (`~/Documents/skills/skills/*/SKILL.md`): `animate`, `animation-performance`, `animation-vocabulary`, `apple-design`, `break-ui`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `pick-ui-library`, `prototype`, `review-animations`, `animate-expo`, `ask-sonner`, `write-swift`; plus `performance-cheatsheet.md`.
- Copies of the relevant ones are placed in this repo at `.claude/skills/` so Claude Code loads them automatically. Use them as follows:
  - **Building:** `animate`, `emil-design-eng`, `apple-design`, `animation-vocabulary`, `pick-ui-library`.
  - **Hardening:** `break-ui` — try worst-case data (long names, huge amounts, zero, RTL) on every component, especially payment ones.
  - **Reviewing:** `review-animations`, `animation-performance`, `improve-animations`, `find-animation-opportunities` before a component is marked done.
  - **Exploring variants:** `prototype` to compare design options before choosing.
  - **Mobile (Phase 7):** `mobile-native`, `animate-expo`.
- Licence: MIT, © Emil Kowalski. Keep his licence and attribution (`THIRD_PARTY_NOTICES.md`). The skills are tools for building; do not republish them as Zuri's own.

## 3. Reuse checklist (must pass before any code from these folders enters Zuri)
1. **Provenance:** who wrote it? Owner-written → OK to relicense (MIT or Pro). Derived from a library (e.g. `pinui/*`, shadcn/ui primitives, Radix wrappers) → find the original licence and attribute; if unclear, **rewrite from scratch** instead of copying. *Pin UI's site names no licence — don't copy its components into Zuri until a licence is confirmed.*
2. **Genericise:** remove business logic, API/service calls, i18n keys tied to Intelyflow, brand names/colours, and analytics/Sentry hooks. Replace with props and tokens.
3. **Conform:** rebuild to `COMPONENT_RULES.md` (tokens, a11y, reduced motion, RSC-safe, docs, tests, prompt file).
4. **Fonts/assets/images:** only use assets whose licence allows redistribution.
5. **Record it:** add the source and licence to `THIRD_PARTY_NOTICES.md`; mention the origin in the PR.
6. **Ask the owner** if a component is borderline (e.g. contains Intelyflow IP the owner may want to keep proprietary for the Pro tier).

## 4. How to read them safely
Read-only. Use `find`/`ls`/`cat` on the paths above. Do not run `pnpm install` or scripts inside `intelyflow`. Skip `node_modules`, `.git`, `dist`, `.env*`.
