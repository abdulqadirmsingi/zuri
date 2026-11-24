"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-foreground",
  {
    variants: {
      size: { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base" },
    },
    defaultVariants: { size: "md" },
  },
);

/** First letter of the first and last words, so "Asha Juma Msingi" becomes "AM". */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = Array.from(words[0] ?? "")[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1] ?? "")[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export interface AvatarProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof avatarVariants> {
  /** The person's name: used for the initials fallback and as the accessible name. */
  name: string;
  /** Image URL. If it is missing or fails to load, the initials are shown instead. */
  src?: string;
}

/**
 * A person's picture with an initials fallback. It is a client component only because it
 * must notice when the image fails to load.
 */
export function Avatar({ name, src, size, className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image can fail before React attaches onError during hydration; check it once mounted.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-check only when the source changes.
  useEffect(() => {
    setFailed(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  const showImage = Boolean(src) && !failed;
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        <img
          ref={imgRef}
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
    </span>
  );
}

export interface AvatarGroupProps extends Omit<ComponentProps<"div">, "children"> {
  people: { name: string; src?: string }[];
  /** How many avatars to show before collapsing the rest into a "+N" count. Defaults to 4. */
  max?: number;
  size?: AvatarProps["size"];
}

/** Overlapping avatars with a "+N" overflow count. The group is named by its members. */
export function AvatarGroup({ people, max = 4, size, className, ...props }: AvatarGroupProps) {
  const limit = Math.max(1, Math.floor(max));
  const shown = people.slice(0, limit);
  const extra = people.length - shown.length;
  const ring = "ring-2 ring-background";

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset implies form controls; this is a plain labelled group.
    <div
      role="group"
      aria-label={props["aria-label"] ?? `${people.length} people`}
      className={cn("flex items-center -space-x-2 rtl:space-x-reverse", className)}
      {...props}
    >
      {shown.map((p) => (
        <Avatar
          key={`${p.name}-${p.src ?? ""}`}
          name={p.name}
          src={p.src}
          size={size}
          className={ring}
        />
      ))}
      {extra > 0 ? (
        <span
          role="img"
          aria-label={`${extra} more`}
          className={cn(avatarVariants({ size }), ring)}
        >
          <span aria-hidden="true">+{extra}</span>
        </span>
      ) : null}
    </div>
  );
}

export { avatarVariants };
