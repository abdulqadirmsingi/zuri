<p align="center">
  <img src="docs/assets/hero.svg" alt="zuri: beautiful React components you own" width="860">
</p>

_Zuri_ is Swahili for "beautiful". It's a library of React components I wanted to exist: small, accessible, a bit glassy, and built with East African products in mind (phone numbers with `+255` first, money in TZS and KES, one-time-code fields that behave).

You don't install Zuri as a dependency. You copy a component into your project and it's yours to edit. Same idea as shadcn/ui, and it works with the shadcn CLI because the registry is shadcn-compatible.

```bash
npx @abdulqadirmsingi/zuri add otp-input
```

That fetches the component, installs the few packages it needs, and drops one readable file into your `components/` folder.

## Try it

Browse everything, with live previews and copy-paste code, at **[components.abdulqadirmsingi.com](https://components.abdulqadirmsingi.com)**.

|                |                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| **Inputs**     | OTP input that fuses into a "Verified" capsule (or shakes and clears), phone input, fields, checkbox, textarea |
| **Actions**    | Button, copy button, expanding button group, theme switch                                                      |
| **Navigation** | Bottom nav, swell nav, tabs, accordion, breadcrumbs, user menu                                                 |
| **Overlays**   | Dialog, alert dialog, popover, tooltip, dropdown menu                                                          |
| **Display**    | Card, avatar, badge, progress, skeleton, spinner, kbd                                                          |
| **Blocks**     | Split, magazine and card-fan heroes, pricing, testimonials, footer, closing CTA                                |
| **Motion**     | Marquee, reveal                                                                                                |

## Install

With the Zuri CLI (a thin wrapper that calls the shadcn CLI for you):

```bash
npx @abdulqadirmsingi/zuri add button card
npx @abdulqadirmsingi/zuri list
```

Or straight through shadcn, no Zuri package involved:

```bash
npx shadcn@latest add https://components.abdulqadirmsingi.com/r/button.json
```

Or open a component page and copy the source by hand. It's one file.

Your project needs React 19, Tailwind v4 and a shadcn-style `components.json`. If you don't have one yet, run `npx shadcn@latest init` first.

## What I care about

- **Accessible by default.** Real elements first, keyboard support, visible focus, `prefers-reduced-motion` honoured, and axe tests.
- **Light and dark**, and RTL-safe (logical properties).
- **Glass that stays readable.** Text contrast is checked against the worst-case backdrop, with solid fallbacks where `backdrop-filter` isn't available.
- **Small.** Few dependencies, each declared in the registry item so the CLI installs it.
- **Payments are presentation only.** Components hand values to your code through callbacks. They never store or send card or mobile-money details.

## Run it locally

```bash
pnpm install
pnpm dev              # the site, on http://localhost:3000
pnpm registry:build   # regenerate the registry JSON
pnpm lint && pnpm typecheck && pnpm test
```

Install counting and the admin page need Postgres; see [docs/RUNNING.md](docs/RUNNING.md). The site works without it.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first, then [docs/RULES.md](docs/RULES.md) and [docs/COMPONENT_RULES.md](docs/COMPONENT_RULES.md) for what a finished component looks like. Found a security problem? See [SECURITY.md](SECURITY.md).

## Licence

Free components are [MIT](LICENSE). Pro components, when they exist, will sit under a separate commercial licence. The sticker artwork in the header above comes from [stick-it-up](https://github.com/Sam721166/stick-it-up) by Samiran De (MIT); see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
