import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ClosingCta } from "./closing-cta";

describe("ClosingCta", () => {
  it("is a region named by its heading", () => {
    render(<ClosingCta title="Ready to start?" />);
    expect(screen.getByRole("region", { name: "Ready to start?" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
  it("renders the description and actions", () => {
    render(
      <ClosingCta title="T" description="Join today" actions={<a href="/join">Join now</a>} />,
    );
    expect(screen.getByText("Join today")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Join now" })).toBeTruthy();
  });
  it("uses the accent fill with its own foreground colour", () => {
    render(<ClosingCta title="T" tone="accent" />);
    const panel = screen.getByRole("heading").parentElement as HTMLElement;
    expect(panel.className).toContain("bg-accent");
    expect(panel.className).toContain("text-accent-foreground");
  });
  it("forwards the ref", () => {
    const ref = createRef<HTMLElement>();
    render(<ClosingCta ref={ref} title="T" className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations in either tone", async () => {
    for (const tone of ["default", "accent"] as const) {
      const { container, unmount } = render(
        <ClosingCta title="T" description="D" tone={tone} actions={<a href="/x">Go</a>} />,
      );
      expect((await axe(container)).violations).toEqual([]);
      unmount();
    }
  });
});
