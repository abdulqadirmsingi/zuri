import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { BottomNav, type BottomNavItem } from "./bottom-nav";

const svg = <svg viewBox="0 0 24 24" />;
const items: BottomNavItem[] = [
  { id: "home", label: "Home", icon: svg },
  { id: "saved", label: "Saved", icon: svg },
  { id: "chat", label: "Messages", icon: svg, badge: 2 },
  { id: "me", label: "Profile", icon: svg, href: "/me" },
];

describe("BottomNav", () => {
  it("is a navigation landmark with every item named by its label", () => {
    render(<BottomNav aria-label="Main" items={items} />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Saved" })).toBeTruthy();
  });

  it("renders links for items with an href and buttons for the rest", () => {
    render(<BottomNav aria-label="Main" items={items} />);
    expect(screen.getByRole("link", { name: "Profile" }).getAttribute("href")).toBe("/me");
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("marks the first item current by default, or the defaultValue", () => {
    const { rerender } = render(<BottomNav aria-label="Main" items={items} />);
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    rerender(<BottomNav aria-label="Main" items={items} defaultValue="saved" key="x" />);
    expect(screen.getByRole("button", { name: "Saved" }).getAttribute("aria-current")).toBe("page");
  });

  it("changes the current item on click and reports it", async () => {
    const onValueChange = vi.fn();
    render(<BottomNav aria-label="Main" items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Saved" }));
    expect(onValueChange).toHaveBeenCalledWith("saved");
    expect(screen.getByRole("button", { name: "Saved" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "Home" }).hasAttribute("aria-current")).toBe(false);
  });

  it("works controlled: it only changes when the parent says so", async () => {
    const onValueChange = vi.fn();
    render(
      <BottomNav aria-label="Main" items={items} value="home" onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Saved" }));
    expect(onValueChange).toHaveBeenCalledWith("saved");
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBe("page");
  });

  it("is reachable with Tab and activated with Enter and Space", async () => {
    render(<BottomNav aria-label="Main" items={items} />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Home" }));
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Saved" }).getAttribute("aria-current")).toBe("page");
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("button", { name: /Messages/ }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("announces a badge count with the item name and hides the visual number", () => {
    render(<BottomNav aria-label="Main" items={items} />);
    expect(screen.getByRole("button", { name: "Messages, 2 new" })).toBeTruthy();
  });

  it("caps large counts and hides a zero or missing badge", () => {
    render(
      <BottomNav
        aria-label="Main"
        items={[
          { id: "a", label: "A", icon: svg, badge: 150 },
          { id: "b", label: "B", icon: svg, badge: 0 },
          { id: "c", label: "C", icon: svg },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: /A/ }).textContent).toContain("99+");
    expect(screen.getByRole("button", { name: "B" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "C" })).toBeTruthy();
  });

  it("hides decorative icons from assistive technology", () => {
    const { container } = render(<BottomNav aria-label="Main" items={items.slice(0, 1)} />);
    expect(container.querySelector("svg")?.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it("never submits a form (buttons are type=button)", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <BottomNav aria-label="Main" items={items} />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("uses a safe floating position when fixed, and copes with no items", () => {
    const { rerender } = render(<BottomNav aria-label="Main" items={items} fixed />);
    expect(screen.getByRole("navigation").className).toContain("safe-area-inset-bottom");
    rerender(<BottomNav aria-label="Main" items={[]} />);
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("lets className win and spreads props", () => {
    render(<BottomNav aria-label="Main" items={items} className="p-3" data-x="1" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("p-3");
    expect(nav.className.split(" ")).not.toContain("p-1");
    expect(nav.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations (solid, glass, with badge and link)", async () => {
    const { container } = render(
      <>
        <BottomNav aria-label="Main" items={items} />
        <BottomNav aria-label="Secondary" items={items} variant="glass" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
