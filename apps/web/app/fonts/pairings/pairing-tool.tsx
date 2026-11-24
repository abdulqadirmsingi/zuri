"use client";

import { Button } from "@registry/actions/button/button";
import { Input } from "@registry/inputs/input/input";
import { Select } from "@registry/inputs/select/select";
import { Textarea } from "@registry/inputs/textarea/textarea";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { pairingHref, pairingSnippet, parsePairing } from "@/lib/fonts-pairing";
import { clampWeight } from "@/lib/fonts-preview";
import { CodeBlock } from "../code-block";
import type { FontWithFace } from "../fonts-faces";

const SAMPLE_HEADING = "Send money in seconds";
const SAMPLE_BODY =
  "A phone is now a wallet. People pay school fees, shop and send money home without visiting a bank, and good type makes every one of those screens easier to trust.";

/**
 * Pick a heading font and a body font and see them together. The two choices live in the URL, so
 * a pairing can be shared, and nothing from the URL is used except as a lookup key.
 */
export function PairingTool({ fonts }: { fonts: FontWithFace[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const ids = useId();
  const [headingText, setHeadingText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const { heading: headingId, body: bodyId } = parsePairing(params, fonts);
  const heading = fonts.find((f) => f.id === headingId) ?? (fonts[0] as FontWithFace);
  const body = fonts.find((f) => f.id === bodyId) ?? (fonts[0] as FontWithFace);

  const go = (h: string, b: string) => router.replace(pairingHref(h, b), { scroll: false });
  const options = fonts.map((f) => (
    <option key={f.id} value={f.id}>
      {f.family}
    </option>
  ));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${ids}-h`} className="text-sm font-medium">
            Heading font
          </label>
          <Select id={`${ids}-h`} value={headingId} onChange={(e) => go(e.target.value, bodyId)}>
            {options}
          </Select>
        </div>
        <Button
          variant="outline"
          shape="pill"
          aria-label="Swap the heading and body fonts"
          onClick={() => go(bodyId, headingId)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 5.5h9.5M10 3l2.5 2.5L10 8M13 10.5H3.5M6 8l-2.5 2.5L6 13" />
          </svg>
          Swap
        </Button>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${ids}-b`} className="text-sm font-medium">
            Body font
          </label>
          <Select id={`${ids}-b`} value={bodyId} onChange={(e) => go(headingId, e.target.value)}>
            {options}
          </Select>
        </div>
      </div>

      {/* The preview is decoration for the eye; the choices above and the code below say it in text. */}
      <div
        aria-hidden="true"
        className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-6 sm:p-10"
      >
        <p
          className="m-0 break-words text-4xl leading-[1.1] tracking-tight sm:text-6xl"
          style={{ fontFamily: heading.cssFamily, fontWeight: clampWeight(heading, 700) }}
        >
          {headingText.trim() || SAMPLE_HEADING}
        </p>
        <p
          className="m-0 max-w-prose whitespace-pre-line break-words text-lg leading-relaxed sm:text-xl"
          style={{ fontFamily: body.cssFamily, fontWeight: clampWeight(body, 400) }}
        >
          {bodyText.trim() || SAMPLE_BODY}
        </p>
        <p
          className="m-0 text-sm text-muted-foreground"
          style={{ fontFamily: body.cssFamily, fontWeight: clampWeight(body, 500) }}
        >
          Heading in {heading.family}, text in {body.family}
        </p>
      </div>
      <p className="sr-only" role="status">
        Preview: headings in {heading.family}, body text in {body.family}.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${ids}-ht`} className="text-sm font-medium">
            Your heading
          </label>
          <Input
            id={`${ids}-ht`}
            placeholder={SAMPLE_HEADING}
            maxLength={80}
            autoComplete="off"
            spellCheck={false}
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${ids}-bt`} className="text-sm font-medium">
            Your text
          </label>
          <Textarea
            id={`${ids}-bt`}
            rows={3}
            maxLength={400}
            placeholder="Type a paragraph to see it set in the body font"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="m-0 text-2xl font-semibold tracking-tight">Use this pairing</h2>
        <CodeBlock label="Code for both fonts" code={pairingSnippet(heading, body)} />
        <p className="m-0 text-sm text-muted-foreground">
          Both fonts are open source and free to use. See each font's page for its licence:{" "}
          <a className="underline underline-offset-4" href={`/fonts/${heading.id}`}>
            {heading.family}
          </a>
          {heading.id === body.id ? null : (
            <>
              {" "}
              and{" "}
              <a className="underline underline-offset-4" href={`/fonts/${body.id}`}>
                {body.family}
              </a>
            </>
          )}
          .
        </p>
      </div>
    </div>
  );
}
