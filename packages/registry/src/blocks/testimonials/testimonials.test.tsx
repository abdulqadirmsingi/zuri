import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Testimonials } from "./testimonials";

const items = [
  {
    id: "1",
    quote: "It saved us a week.",
    name: "Sample Person",
    role: "Example Ltd",
    avatar: <i>S</i>,
  },
  { id: "2", quote: "Calm and clear.", name: "Another Person" },
];

describe("Testimonials", () => {
  it("renders each quote as a figure with its attribution", () => {
    render(<Testimonials items={items} />);
    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(screen.getByText("It saved us a week.").tagName).toBe("BLOCKQUOTE");
    expect(screen.getByText("Example Ltd")).toBeTruthy();
  });
  it("hides the avatar from assistive tech but keeps the name as text", () => {
    render(<Testimonials items={items} />);
    expect(screen.getByText("S").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("Sample Person")).toBeTruthy();
  });
  it("forwards the ref and className", () => {
    const ref = createRef<HTMLUListElement>();
    render(<Testimonials ref={ref} items={items} className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations", async () => {
    const { container } = render(<Testimonials items={items} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
