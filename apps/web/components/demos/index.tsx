import type { ReactNode } from "react";
import { ButtonDefault, ButtonSizes, ButtonStates, ButtonVariants } from "./button-demos";

const demos: Record<string, () => ReactNode> = {
  "button-default": ButtonDefault,
  "button-variants": ButtonVariants,
  "button-sizes": ButtonSizes,
  "button-states": ButtonStates,
};

/** Looks a demo up by name, so MDX can say <Demo name="button-variants" />. */
export function Demo({ name }: { name: string }) {
  const render = Object.hasOwn(demos, name) ? demos[name] : undefined;
  if (!render) throw new Error(`Unknown demo: ${name}`);
  return <>{render()}</>;
}
