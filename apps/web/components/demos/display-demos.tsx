import { Badge } from "@registry/display/badge/badge";
import { Kbd } from "@registry/display/kbd/kbd";
import { Progress } from "@registry/display/progress/progress";
import { Separator } from "@registry/display/separator/separator";
import { Skeleton } from "@registry/display/skeleton/skeleton";
import { Spinner } from "@registry/display/spinner/spinner";
import { GlassBackdrop } from "./glass-backdrop";

export function BadgeVariants() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
      {/* Glass needs something behind it to blur. */}
      <GlassBackdrop className="w-auto p-3">
        <Badge variant="glass">Glass</Badge>
      </GlassBackdrop>
    </>
  );
}

export function SeparatorDefault() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-sm font-medium">Zuri</p>
      <p className="text-sm text-muted-foreground">Components you own.</p>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Registry</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  );
}

export function SpinnerSizes() {
  return (
    <>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" label="Loading balance" />
    </>
  );
}

export function SkeletonCard() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading transaction"
      className="flex w-full max-w-sm items-center gap-3"
    >
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </section>
  );
}

export function KbdDefault() {
  return (
    <p className="flex flex-wrap items-center gap-1 text-sm">
      Press <Kbd>Ctrl</Kbd>
      <span aria-hidden="true">+</span>
      <Kbd>K</Kbd> to search, or <Kbd>Esc</Kbd> to close.
    </p>
  );
}

export function ProgressDefault() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress aria-label="Upload" value={0} />
      <Progress aria-label="Upload" value={35} />
      <Progress aria-label="Upload" value={100} />
      <Progress aria-label="Waiting for confirmation" />
    </div>
  );
}
