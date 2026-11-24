import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SiteHeader } from "./site-header";

const links = [
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
];
const ui = (props = {}) => (
  <SiteHeader
    brand={<a href="/">Zuri</a>}
    links={links}
    actions={<button type="button">Sign in</button>}
    {...props}
  />
);

describe("SiteHeader", () => {
  it("is a banner with a named main navigation", () => {
    render(ui());
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(
      within(screen.getByRole("navigation", { name: "Main" })).getAllByRole("link"),
    ).toHaveLength(2);
  });
  it("marks the current page", () => {
    render(ui({ current: "/about" }));
    expect(screen.getByRole("link", { name: "About" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Courses" }).getAttribute("aria-current")).toBeNull();
  });
  it("has a menu button with an accessible name", () => {
    render(ui({ menuLabel: "Open menu" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
  });
  it("opens a modal menu with the links and actions", async () => {
    render(ui());
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = await screen.findByRole("dialog", { name: "Menu" });
    expect(within(dialog).getAllByRole("link")).toHaveLength(2);
    expect(within(dialog).getByRole("button", { name: "Sign in" })).toBeTruthy();
  });
  it("closes on Escape and returns focus to the menu button", async () => {
    render(ui());
    const button = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(button);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(button);
  });
  it("closes when a link in the menu is chosen", async () => {
    render(ui());
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("link", { name: "Courses" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
  it("can stick to the top", () => {
    render(ui({ sticky: true }));
    expect(screen.getByRole("banner").className).toContain("sticky");
  });
  it("forwards the ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(ui({ ref, className: "extra" }));
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations, closed or open", async () => {
    const { container } = render(ui({ current: "/about" }));
    expect((await axe(container)).violations).toEqual([]);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = await screen.findByRole("dialog");
    expect((await axe(dialog)).violations).toEqual([]);
  });
});
