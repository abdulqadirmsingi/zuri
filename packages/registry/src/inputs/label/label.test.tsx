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
