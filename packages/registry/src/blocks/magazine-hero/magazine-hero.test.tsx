import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { MagazineHero } from "./magazine-hero";

const media = <img src="/x.png" alt="A student reading" />;

describe("MagazineHero", () => {
  it("names the section by its headline", () => {
    render(<MagazineHero title="Read more" media={media} />);
    expect(screen.getByRole("heading", { level: 1, name: "Read more" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Read more" })).toBeTruthy();
  });
  it("supports an h2 headline", () => {
    render(<MagazineHero title="Read more" media={media} headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
  it("shows tags as a list, a badge and a caption", () => {
    render(
      <MagazineHero
        title="T"
        media={media}
        tags={["Art", "Maths"]}
        badge="New"
        caption="Photo credit"
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("New")).toBeTruthy();
    expect(screen.getByText("Photo credit").tagName).toBe("FIGCAPTION");
  });
  it("hides the decorative block from assistive tech", () => {
    const { container } = render(<MagazineHero title="T" media={media} />);
    expect(container.querySelector("span[aria-hidden='true']")).not.toBeNull();
  });
  it("omits optional parts when not given", () => {
    const { container } = render(<MagazineHero title="T" media={media} />);
    expect(container.querySelector("ul")).toBeNull();
    expect(container.querySelector("figcaption")).toBeNull();
  });
  it("forwards the ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(<MagazineHero ref={ref} title="T" media={media} className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations", async () => {
    const { container } = render(
      <MagazineHero
        eyebrow="Issue 4"
        title="Read more"
        description="Text"
        actions={<a href="/go">Start</a>}
        tags={["Art"]}
        media={media}
        badge="New"
        caption="Credit"
      />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
