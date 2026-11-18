# Zuri

> _zuri_ — Swahili for "beautiful".

An open-source library of small, beautiful, accessible React components — with a strong focus on **payments and fintech UI for East Africa**, plus forms, dashboards, AI chat, marketing and motion. Install any component with one command and own the code.

```bash
npx shadcn@latest add https://zuri.dev/r/button.json
```

> Domain and npm scope are placeholders. Check availability of the domain and the `@zuri` npm scope before launch (the unscoped `zuri` name was free on npm when this was written).

## Status

Planning stage. This folder contains the project brief and rules for building it.

| File                      | Purpose                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| `docs/PROMPT.md`          | Master prompt to give an AI coding agent                                       |
| `docs/RULES.md`           | Project-wide engineering, design, security rules                               |
| `docs/COMPONENT_RULES.md` | Checklist every component must pass                                            |
| `docs/PLAN.md`            | Component catalogue and phased roadmap                                         |
| `docs/ANALYTICS.md`       | Install counting and usage analytics design                                    |
| `docs/AI_PROMPTS.md`      | Spec for "copy a prompt for my AI agent", llms.txt, agent skill                |
| `docs/SOURCES.md`         | Reference code/skills on the owner's machine and safe-reuse rules              |
| `docs/RUNNING.md`         | How to run the site, database, admin and registry locally                      |
| `AGENTS.md` / `CLAUDE.md` | Entry points that AI tools read automatically                                  |
| `.claude/skills/`         | Design and animation skills used while building (see `THIRD_PARTY_NOTICES.md`) |

## How to start

1. Open this folder in Claude Code (or Cursor).
2. Paste: _"Read docs/PROMPT.md and follow it. Start with Phase 0."_
3. Review each step before moving on.

## Licence

Free components: MIT (see `LICENSE`). Pro components will use a separate commercial licence.
