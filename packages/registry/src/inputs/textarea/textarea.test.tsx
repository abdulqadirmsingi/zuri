import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a native textarea named by its label", () => {
    render(
      <>
        <label htmlFor="m">Message</label>
        <Textarea id="m" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Message" }).tagName).toBe("TEXTAREA");
  });

  it("accepts multi-line typing", async () => {
    render(<Textarea aria-label="Message" />);
    await userEvent.type(screen.getByRole("textbox"), "a{Enter}b");
    expect(screen.getByRole("textbox")).toHaveProperty("value", "a\nb");
  });

  it("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox").hasAttribute("aria-invalid")).toBe(false);
    rerender(<Textarea aria-label="Message" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" rows={6} className="min-h-40" />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
    expect(ref.current?.rows).toBe(6);
    expect(ref.current?.className).toContain("min-h-40");
    expect(ref.current?.className).not.toContain("min-h-20");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <label htmlFor="m">Message</label>
        <Textarea id="m" invalid />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("marks focus with a single border and halo, not an offset black outline", () => {
    render(<Textarea aria-label="x" />);
    const cls = screen.getByRole("textbox").className;
    expect(cls).toContain("focus-visible:border-ring");
    expect(cls).toContain("focus-visible:outline-none");
    expect(cls).not.toContain("outline-offset");
    expect(cls).not.toContain("focus-visible:outline-2");
  });
});
