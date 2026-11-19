import type { ComponentProps } from "react";

/**
 * The Zuri mark. The bars follow the text colour so it works in light and dark; the diagonal is
 * always the saffron accent. Decorative by default because it sits next to the word "Zuri".
 */
export function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <path d="M16 8H56V20H10Z" fill="currentColor" />
      <path d="M8 44H54L48 56H8Z" fill="currentColor" />
      <path d="M42 20H56L22 44H8Z" fill="#F99532" />
    </svg>
  );
}
