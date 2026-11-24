# zuri

Install [Zuri](https://components.abdulqadirmsingi.com) components into your project.

```bash
npx zuri add otp-input
npx zuri add button card --overwrite
npx zuri list
```

Zuri is a shadcn-compatible registry, so this is a thin wrapper: it builds the component URL and hands it to `npx shadcn@latest add`. The component is copied into your project and the packages it needs are installed. You own the code.

Your project needs React 19, Tailwind v4 and a `components.json`. If you don't have one, run `npx shadcn@latest init` first.

To point at a different registry (for example a local dev server), set `ZURI_REGISTRY=http://localhost:3000`.

MIT licence. Source: https://github.com/abdulqadirmsingi/zuri/tree/main/packages/cli
