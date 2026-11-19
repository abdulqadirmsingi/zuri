import type { ComponentProps } from "react";

/**
 * The Zuri mark. The bars follow the text colour so it works in light and dark; the diagonal is
 * always the saffron accent. Decorative by default because it sits next to the word "Zuri".
 */
export function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <g strokeLinejoin="round" strokeWidth="4">
        <path d="M10 10H54V18H10Z" fill="currentColor" stroke="currentColor" />
        <path d="M10 46H54V54H10Z" fill="currentColor" stroke="currentColor" />
        <path d="M36 20H54L28 44H10Z" fill="#F99532" stroke="#F99532" />
      </g>
    </svg>
  );
}
