# AI_PROMPTS.md — "Get a prompt for my AI agent"

Goal: anyone can go from "I like this component" to "my AI agent has installed and used it correctly" in one click.

## 1. Where prompts appear
1. **Component page**: a **Copy prompt** button beside the install command.
   - Target selector: `Claude Code` · `Cursor` · `v0` · `Lovable` · `Bolt` · `Generic`
   - Options: framework (Next.js App Router / Vite / Remix), TypeScript on/off, theme (light/dark/both), variant (default / glass), package manager.
2. **Prompt Builder** (`/prompt`): pick many components, write one sentence about the product, choose target → one combined prompt with install commands in dependency order, usage notes and global constraints.
3. **Block / template pages**: a prompt that explains the whole composition (e.g. "checkout page") and lists every component it needs.
4. **Docs home**: "Use Zuri with AI" page explaining llms.txt, the agent skill and (later) the MCP server.

## 2. Anatomy of a generated prompt
```
ROLE        You are adding the Zuri "<title>" component to an existing <framework> project.
INSTALL     <package-manager command to add the registry item>   (run first)
GOAL        <what the user wants, from Prompt Builder or a placeholder>
USAGE       <minimal, correct example>
PROPS       <only real props, from types>
TOKENS      <CSS variables / Tailwind setup required; how to add if missing>
A11Y        <keyboard + ARIA requirements that must be preserved>
CONSTRAINTS - Use the installed Zuri component; do not rewrite it from scratch.
            - Do not invent props or variants that are not listed.
            - Keep tokens; do not hard-code colours.
            - Respect prefers-reduced-motion. Keep light/dark support.
            - For payment components: UI only; never log or store card, PIN or mobile-money data.
VERIFY      Run typecheck, lint and build; open the page; test keyboard navigation.
DOCS        <canonical URL> and <markdown URL>
```
Target-specific wrappers: Cursor → rules-style bullet list; Claude Code → plain instructions plus "read the docs URL"; v0/Lovable/Bolt → conversational prompt with the component's code inlined (since they may not run the CLI).

## 3. How prompts are produced (single source of truth)
- Each component ships `<name>.prompt.md` (hand-written template with placeholders) + generated parts from registry metadata and TypeScript types (props, dependencies, tokens).
- Build step renders prompts for every target into `public/prompts/<slug>.<target>.txt` and the site reads them (no client-side string-building drift).
- **Tests:** (a) every prop in the prompt exists in the types; (b) install command matches the registry item; (c) prompt contains the required CONSTRAINTS block; (d) length ≤ ~1,500 tokens for single components.
- Prompts include the library **version**; mark them stale in CI when the component changes without regenerating.

## 4. Machine-readable surfaces
- `/llms.txt` — short index: what Zuri is, how to install, links to each component's markdown.
- `/llms-full.txt` — full docs for AI ingestion (generated).
- `/components/<slug>.md` — clean markdown of each component page (usage, props, a11y, install).
- `/r/index.json` — registry index (names, categories, descriptions) for tools.
- Optional later: **MCP server** (`search_components`, `get_component`, `get_install_command`, `get_prompt`) so agents query Zuri directly.

## 5. Zuri agent skill
Ship `skills/zuri-ui/SKILL.md` in the repo (installable with the skills CLI) that teaches agents: how to find components (llms.txt), how to install (registry command), how to compose payments flows safely, how to theme with tokens, how to keep accessibility, and what never to do (invent props, store card data). Keep it short and accurate; version it with the library.

## 6. UX details
- One click copies; a toast confirms; the button shows the target used last (remembered locally, no cookie).
- Show a collapsible **preview of the prompt** before copying (users should be able to read it).
- Keyboard accessible; works on mobile (share sheet where available).
- Count `copy_prompt` and `build_prompt` events (see `ANALYTICS.md`) — which prompts are copied tells you which components people want AI help with.

## 7. Safety and quality
- Prompts never contain secrets, API keys or private URLs.
- Prompts for Pro items are only shown to licensed users and never include Pro source code in public pages.
- Prompt text is plain text; escape/strip anything that could act as an injection when users add their own product description in the Prompt Builder (it only goes into the *user's own* prompt; never store it server-side unless they save it, and then treat as user content).
