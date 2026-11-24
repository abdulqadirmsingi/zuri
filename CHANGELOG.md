# Changelog

## Unreleased

- Input, Textarea, Select, Picker, Input group and Phone input shake once when they turn invalid (off for reduced motion).
- Phone input: flags as emoji by default (`flags="code"` for the tile, `renderFlag` for images). Dropdown triggers and items, and Button, now show a pointer cursor.
- Phone input 0.1.0: searchable country picker, grouped digits, paste detection, E.164 output; joined, split and chip layouts. Picker 0.2.0 gains `renderValue` and `renderOption`.
- Text fields (Input, Textarea, Input group, Picker search) no longer draw the heavy black outline on focus: a single border change and a soft halo instead.
- Input 0.2.0: `soft` and `underline` looks. New Input group 0.1.0: an icon, prefix, suffix or button beside an input.
- Label 0.2.0: `required` and `optional` markers, `variant` (default, caps, muted) and `size`.
- Expanding button group 0.2.0: `variant` (default, soft, accent) and a large size.
- Theme switch 0.2.0: `curtain` and `diagonal` page transitions, plus a Light/System/Dark recipe in the docs.
- Button 0.3.0: five new styles (`accent`, `soft`, `link`, `brutal`, `wipe`) and a docs section of copyable alternatives.
- Phase 0: monorepo scaffold, Biome, Turborepo, CI, design tokens (incl. glass), `cn()` utility.
- Registry pipeline: `button` and `zuri-tokens` served from `/r/[name]`.
- Install counting with daily-rotating visitor hash, fail-open recording and de-duplicated counts.
- Docs site (Fumadocs): introduction, installation, theming and a Button page with live previews, props and real source; `llms.txt`, per-page markdown and search.
- Button tests (behaviour, keyboard, axe) and a browser accessibility audit script.
