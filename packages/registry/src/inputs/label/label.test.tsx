import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Label } from "./label";

describe("Label", () => {
  it("renders a native label that names its control", () => {
    render(
      <>
        <Label htmlFor="x">Phone</Label>
        <input id="x" />
      </>,
    );
    expect(screen.getByLabelText("Phone").tagName).toBe("INPUT");
  });

  it("focuses the control when clicked", async () => {
    render(
      <>
        <Label htmlFor="x">Phone</Label>
        <input id="x" />
      </>,
    );
    await userEvent.click(screen.getByText("Phone"));
    expect(document.activeElement).toBe(screen.getByLabelText("Phone"));
  });

  it("marks a required field with a decorative asterisk", () => {
    render(
      <>
        <Label htmlFor="x" required>
          Phone
        </Label>
        <input id="x" required />
      </>,
    );
    const star = screen.getByText("*");
    expect(star.getAttribute("aria-hidden")).toBe("true");
    // The asterisk is hidden from assistive technology, so the name stays plain.
    expect(screen.getByRole("textbox", { name: "Phone" })).toBeTruthy();
  });

  it("adds a spoken (optional) hint, and required wins over optional", () => {
    const { rerender } = render(
      <>
        <Label htmlFor="x" optional>
          Nickname
        </Label>
        <input id="x" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Nickname (optional)" })).toBeTruthy();
    rerender(
      <>
        <Label htmlFor="x" optional required>
          Nickname
        </Label>
        <input id="x" />
      </>,
    );
    expect(screen.queryByText("(optional)")).toBeNull();
    expect(screen.getByText("*")).toBeTruthy();
  });

  it("offers caps and muted looks and three sizes", () => {
    const { rerender } = render(<Label variant="caps">A</Label>);
    expect(screen.getByText("A").className).toContain("uppercase");
    // The look changes the case and spacing only; it never swaps the font.
    expect(screen.getByText("A").className).not.toContain("font-mono");
    rerender(<Label variant="muted">A</Label>);
    expect(screen.getByText("A").className).toContain("text-muted-foreground");
    rerender(<Label size="lg">A</Label>);
    expect(screen.getByText("A").className).toContain("text-base");
    rerender(<Label size="sm">A</Label>);
    expect(screen.getByText("A").className).toContain("text-xs");
  });

  it("merges className and spreads props", () => {
    render(
      <Label className="text-lg" data-x="1">
        Hi
      </Label>,
    );
    const el = screen.getByText("Hi");
    expect(el.className).toContain("text-lg");
    expect(el.className).not.toContain("text-sm");
    expect(el.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Label htmlFor="x">Phone</Label>
        <input id="x" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
