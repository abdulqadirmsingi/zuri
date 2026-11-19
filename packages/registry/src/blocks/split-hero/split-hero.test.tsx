import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SplitHero } from "./split-hero";

const media = <img src="/x.png" alt="A classroom" />;

describe("SplitHero", () => {
  it("names the section by its headline, which is an h1 by default", () => {
    render(<SplitHero title="Learn faster" media={media} />);
    expect(screen.getByRole("heading", { level: 1, name: "Learn faster" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Learn faster" })).toBeTruthy();
  });
  it("can be an h2 when the page already has an h1", () => {
    render(<SplitHero title="Learn faster" media={media} headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
  it("renders the optional parts only when given", () => {
    const { container } = render(<SplitHero title="T" media={media} />);
    expect(container.querySelector("dl")).toBeNull();
    expect(screen.getByAltText("A classroom")).toBeTruthy();
  });
  it("lists highlights as term and value pairs", () => {
    render(
      <SplitHero title="T" media={media} highlights={[{ label: "Students", value: "1,200" }]} />,
    );
    expect(screen.getByText("Students").tagName).toBe("DT");
    expect(screen.getByText("1,200").tagName).toBe("DD");
  });
  it("puts the media first on large screens when mediaPosition is start", () => {
    render(<SplitHero title="T" media={media} mediaPosition="start" />);
    expect(screen.getByAltText("A classroom").parentElement?.className).toContain("lg:order-first");
  });
  it("forwards the ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(<SplitHero ref={ref} title="T" media={media} className="extra" data-x="1" />);
    expect(ref.current?.className).toContain("extra");
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });
  it("has no axe violations", async () => {
    const { container } = render(
      <SplitHero
        eyebrow="Intake"
        title="Learn faster"
        description="Text"
        actions={<a href="/go">Apply</a>}
        highlights={[{ label: "Students", value: "1,200" }]}
        media={media}
      />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
