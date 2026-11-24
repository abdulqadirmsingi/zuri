import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SwellNav, type SwellNavItem } from "./swell-nav";

const icon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
  </svg>
);
const items: SwellNavItem[] = [
  { id: "home", label: "Home", icon },
  { id: "search", label: "Search", icon },
  { id: "saved", label: "Saved", icon },
];
const linkItems = items.map((i) => ({ ...i, href: `/${i.id}` }));

describe("SwellNav", () => {
  it("is a named navigation with one button per item", () => {
    render(<SwellNav items={items} />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
  it("starts on the first item, or on defaultValue", () => {
    const first = render(<SwellNav items={items} />);
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBe("true");
    first.unmount();
    render(<SwellNav items={items} defaultValue="saved" />);
    expect(screen.getByRole("button", { name: "Saved" }).getAttribute("aria-current")).toBe("true");
  });
  it("moves the dome to the chosen item", async () => {
    const { container } = render(<SwellNav items={items} />);
    const nav = container.querySelector("nav") as HTMLElement;
    expect(nav.style.getPropertyValue("--zuri-swell-i")).toBe("0");
    await userEvent.click(screen.getByRole("button", { name: "Saved" }));
    expect(nav.style.getPropertyValue("--zuri-swell-i")).toBe("2");
    expect(screen.getByRole("button", { name: "Saved" }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBeNull();
  });
  it("calls onValueChange, and stays put when controlled", async () => {
    const onValueChange = vi.fn();
    render(<SwellNav items={items} value="home" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(onValueChange).toHaveBeenCalledWith("search");
    expect(screen.getByRole("button", { name: "Home" }).getAttribute("aria-current")).toBe("true");
  });
  it("renders links with aria-current=page when items have an href", () => {
    render(<SwellNav items={linkItems} defaultValue="search" />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Search" }).getAttribute("aria-current")).toBe("page");
  });
  it("works from the keyboard", async () => {
    render(<SwellNav items={items} />);
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Search" }));
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Search" }).getAttribute("aria-current")).toBe(
      "true",
    );
  });
  it("does not animate on the first render, only after a change", async () => {
    const { container } = render(<SwellNav items={items} />);
    expect(container.innerHTML).not.toContain("zuri-swell-stretch");
    await userEvent.click(screen.getByRole("button", { name: "Saved" }));
    expect(container.innerHTML).toContain("zuri-swell-stretch");
    expect(container.innerHTML).toContain("zuri-swell-pop");
  });
  it("hides the dome from assistive technology", () => {
    const { container } = render(<SwellNav items={items} />);
    expect(container.querySelector("[aria-hidden='true'].absolute")).not.toBeNull();
  });
  it("lets taps through the free space above the bar", () => {
    const { container } = render(<SwellNav items={items} />);
    expect((container.querySelector("nav") as HTMLElement).className).toContain(
      "pointer-events-none",
    );
  });
  it("forwards ref, className and a custom label", () => {
    const ref = createRef<HTMLElement>();
    render(<SwellNav ref={ref} items={items} className="extra" aria-label="Main tabs" />);
    expect(ref.current?.className).toContain("extra");
    expect(screen.getByRole("navigation", { name: "Main tabs" })).toBeTruthy();
  });
  it("has no axe violations", async () => {
    const { container } = render(<SwellNav items={linkItems} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
