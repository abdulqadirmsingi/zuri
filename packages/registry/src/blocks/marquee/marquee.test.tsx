import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Marquee } from "./marquee";

const items = (
  <ul className="m-0 flex list-none flex-wrap gap-8 p-0">
    <li>Alpha</li>
    <li>Beta</li>
  </ul>
);

describe("Marquee", () => {
  it("renders the content twice, with the second copy hidden from assistive tech", () => {
    const { container } = render(<Marquee>{items}</Marquee>);
    expect(screen.getAllByText("Alpha")).toHaveLength(2);
    expect(container.querySelectorAll("[aria-hidden='true'] li")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
  it("repeats the children inside each half", () => {
    render(<Marquee repeat={3}>{items}</Marquee>);
    expect(screen.getAllByText("Alpha")).toHaveLength(6);
  });
  it("sets the loop duration and can run in reverse", () => {
    const { container } = render(
      <Marquee duration={12} reverse>
        {items}
      </Marquee>,
    );
    const track = container.querySelector<HTMLElement>("[data-paused]");
    expect(track?.style.getPropertyValue("--zuri-marquee-duration")).toBe("12s");
    expect(track?.className).toContain("[animation-direction:reverse]");
  });
  it("pauses and resumes from the button", async () => {
    const { container } = render(<Marquee>{items}</Marquee>);
    const track = container.querySelector("[data-paused]");
    const button = screen.getByRole("button", { name: "Pause scrolling" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(button);
    expect(track?.getAttribute("data-paused")).toBe("true");
    expect(
      screen.getByRole("button", { name: "Resume scrolling" }).getAttribute("aria-pressed"),
    ).toBe("true");
    await userEvent.click(screen.getByRole("button", { name: "Resume scrolling" }));
    expect(track?.getAttribute("data-paused")).toBe("false");
  });
  it("can hide the button and translate its labels", () => {
    const { rerender } = render(<Marquee pausable={false}>{items}</Marquee>);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<Marquee labels={{ pause: "Simamisha", play: "Endelea" }}>{items}</Marquee>);
    expect(screen.getByRole("button", { name: "Simamisha" })).toBeTruthy();
  });
  it("stops animating and wraps under reduced motion", () => {
    const { container } = render(<Marquee>{items}</Marquee>);
    const cls = container.querySelector("[data-paused]")?.className ?? "";
    expect(cls).toContain("motion-reduce:animate-none");
    expect(cls).toContain("motion-reduce:flex-wrap");
  });
  it("merges className and spreads props", () => {
    const { container } = render(
      <Marquee className="extra" data-x="1">
        {items}
      </Marquee>,
    );
    expect((container.firstChild as HTMLElement).className).toContain("extra");
    expect((container.firstChild as HTMLElement).getAttribute("data-x")).toBe("1");
  });
  it("has no axe violations", async () => {
    const { container } = render(<Marquee>{items}</Marquee>);
    expect((await axe(container)).violations).toEqual([]);
  });
});
