"use client";

import { Input } from "@registry/inputs/input/input";
import { useState } from "react";
import { clampWeight, DEFAULT_PREVIEW, MAX_PREVIEW_LENGTH, previewText } from "@/lib/fonts-preview";
import type { FontWithFace } from "../fonts-faces";
import { RangeField } from "../range-field";

/** A big specimen you can type in: your own text, at a size you choose. */
export function FontTester({ font }: { font: FontWithFace }) {
  const [typed, setTyped] = useState("");
  const [size, setSize] = useState(64);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end">
        <Input
          aria-label="Preview text"
          placeholder={DEFAULT_PREVIEW}
          maxLength={MAX_PREVIEW_LENGTH}
          autoComplete="off"
          spellCheck={false}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
        />
        <RangeField label="Size" unit="px" value={size} min={16} max={120} onChange={setSize} />
      </div>
      <p
        aria-hidden="true"
        className="m-0 break-words leading-[1.1]"
        style={{ fontFamily: font.cssFamily, fontSize: size, fontWeight: clampWeight(font, 500) }}
      >
        {previewText(typed)}
      </p>
    </div>
  );
}
