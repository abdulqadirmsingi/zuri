import Image from "next/image";
import Link from "next/link";
import nightSky from "@/public/home/night-sky.jpg";

const pill =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * The closing section: a full-width photograph under the page's last call to action. It is always
 * dark (the `dark` class), so the white text stays readable whatever the page theme is.
 */
export function NightCta() {
  return (
    <section
      aria-labelledby="night-title"
      className="dark relative isolate flex min-h-[34rem] items-end overflow-hidden bg-background text-foreground lg:min-h-[44rem]"
    >
      <Image
        src={nightSky}
        alt="A person standing on a ridge at night, shining a headlamp up into a sky full of stars."
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[20%_62%]"
      />
      {/* Darkens the lower part so the headline has contrast over the dim ground. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/40 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-10 px-4 pb-14 pt-40 sm:px-8 lg:items-end lg:text-end">
        <div className="flex max-w-3xl flex-col gap-5 lg:items-end">
          <h2
            id="night-title"
            className="m-0 text-balance font-display text-6xl font-semibold leading-[0.92] tracking-tight sm:text-8xl"
          >
            You have the idea. Start with one component.
          </h2>
          <p className="m-0 text-lg text-foreground/80">Take it, change it, make it yours.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href="/docs/components" className={`${pill} bg-white text-black`}>
            Browse components ↗
          </Link>
          <Link href="/docs/installation" className={`${pill} border border-foreground/40`}>
            Read the install guide
          </Link>
        </div>
      </div>
      <p className="absolute end-4 top-4 m-0 text-xs text-foreground/70 sm:end-8">
        Photo by{" "}
        <a
          href="https://unsplash.com/photos/1nFhIykAw-I"
          className="underline underline-offset-2"
          rel="noreferrer"
        >
          Jonah Brown
        </a>{" "}
        on Unsplash
      </p>
    </section>
  );
}
