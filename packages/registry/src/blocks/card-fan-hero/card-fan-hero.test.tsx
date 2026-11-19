import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { CardFanHero } from "./card-fan-hero";

const cards = ["a", "b", "c"].map((id) => ({
  id,
  label: `Card ${id}`,
  media: <img src={`/${id}.png`} alt={`Scene ${id}`} />,
}));

describe("CardFanHero", () => {
  it("names the section by its headline", () => {
    render(<CardFanHero title="Explore" cards={cards} />);
    expect(screen.getByRole("heading", { level: 1, name: "Explore" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Explore" })).toBeTruthy();
  });
  it("renders every card as a list item with its caption", () => {
    render(<CardFanHero title="Explore" cards={cards} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Card b").tagName).toBe("FIGCAPTION");
  });
  it("turns the middle card least and the outer cards in opposite directions", () => {
    render(<CardFanHero title="Explore" cards={cards} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]?.style.transform).toContain("rotate(-5deg)");
    expect(items[1]?.style.transform).toContain("rotate(0deg)");
    expect(items[2]?.style.transform).toContain("rotate(5deg)");
  });
  it("stacks the middle card on top", () => {
    render(<CardFanHero title="Explore" cards={cards} />);
    const z = screen.getAllByRole("listitem").map((li) => Number(li.style.zIndex));
    expect(z[1]).toBeGreaterThan(z[0] as number);
    expect(z[1]).toBeGreaterThan(z[2] as number);
  });
  it("renders no list when there are no cards", () => {
    render(<CardFanHero title="Explore" cards={[]} />);
    expect(screen.queryByRole("list")).toBeNull();
  });
  it("works with a single card", () => {
    render(<CardFanHero title="Explore" cards={cards.slice(0, 1)} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
  it("forwards the ref", () => {
    const ref = createRef<HTMLElement>();
    render(<CardFanHero ref={ref} title="Explore" cards={cards} className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations", async () => {
    const { container } = render(
      <CardFanHero
        title="Explore"
        description="Text"
        actions={<a href="/go">Go</a>}
        cards={cards}
      />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
