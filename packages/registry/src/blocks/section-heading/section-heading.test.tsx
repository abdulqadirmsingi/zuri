import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders an h2 by default and the chosen level otherwise", () => {
    const { rerender } = render(<SectionHeading title="Courses" />);
    expect(screen.getByRole("heading", { level: 2, name: "Courses" })).toBeTruthy();
    rerender(<SectionHeading title="Courses" headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });
  it("shows the eyebrow and description only when given", () => {
    const { container, rerender } = render(<SectionHeading title="T" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
    rerender(<SectionHeading title="T" eyebrow="Learn" description="Details" />);
    expect(screen.getByText("Learn")).toBeTruthy();
    expect(screen.getByText("Details")).toBeTruthy();
  });
  it("puts titleId on the heading so a section can be named by it", () => {
    render(<SectionHeading title="Courses" titleId="courses-title" />);
    expect(screen.getByRole("heading").id).toBe("courses-title");
  });
  it("centres its text when asked", () => {
    const { container } = render(<SectionHeading title="T" align="center" />);
    expect((container.firstChild as HTMLElement).className).toContain("text-center");
  });
  it("forwards the ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SectionHeading ref={ref} title="T" className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations", async () => {
    const { container } = render(<SectionHeading eyebrow="E" title="T" description="D" />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
