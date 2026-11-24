import Link from "next/link";
import { HeroStage } from "./hero-stage";

/** The hero: a rounded colour field with the pitch on one side and live components on the other. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="px-3 pt-3 sm:px-5">
      <div className="relative isolate overflow-hidden rounded-[2.25rem] bg-background">
        {/* Colour field. Pre-blurred blobs that only translate, which keeps it cheap to animate. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="zuri-drift absolute -end-[10%] -top-[30%] size-[46rem] rounded-full bg-[var(--glow-3)] opacity-70 blur-3xl" />
          <div className="zuri-drift absolute end-[18%] top-[30%] size-[34rem] rounded-full bg-[var(--glow-1)] opacity-80 blur-3xl [animation-delay:-6s]" />
          <div className="zuri-drift absolute -bottom-[30%] end-[-6%] size-[36rem] rounded-full bg-[var(--glow-4)] opacity-70 blur-3xl [animation-delay:-12s]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        </div>

        <div className="mx-auto grid max-w-[84rem] items-center gap-12 px-6 pt-16 pb-12 sm:px-12 lg:min-h-[40rem] lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="flex flex-col items-start gap-7">
            <h1
              id="hero-title"
              className="m-0 text-balance font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
            >
              Interfaces worth owning.
            </h1>
            <p className="m-0 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Accessible React components with real polish. Copy one into your project and it is
              yours: one readable file, no package to keep updated, nothing hidden.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/components"
                className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
              >
                Browse components
              </Link>
              <a
                href="#how"
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-background/70 px-7 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                How it works
              </a>
            </div>
          </div>
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
