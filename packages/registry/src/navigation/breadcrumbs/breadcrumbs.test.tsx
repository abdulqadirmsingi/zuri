import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Breadcrumbs } from "./breadcrumbs";

const trail = [
  { label: "Home", href: "/" },
  { label: "Payments", href: "/payments" },
  { label: "Receipt 4821" },
];

describe("Breadcrumbs", () => {
  it("is a navigation landmark named Breadcrumb by default, with an ordered list", () => {
    render(<Breadcrumbs items={trail} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("accepts a translated label", () => {
    render(<Breadcrumbs items={trail} aria-label="Njia ya ukurasa" />);
    expect(screen.getByRole("navigation", { name: "Njia ya ukurasa" })).toBeTruthy();
  });

  it("links the ancestors and marks the last item as the current page", () => {
    render(<Breadcrumbs items={trail} />);
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Payments" }).getAttribute("href")).toBe("/payments");
    expect(screen.queryByRole("link", { name: "Receipt 4821" })).toBeNull();
    const current = screen.getByText("Receipt 4821").closest("[aria-current]");
    expect(current?.getAttribute("aria-current")).toBe("page");
    expect(screen.getAllByRole("link").some((a) => a.hasAttribute("aria-current"))).toBe(false);
  });

  it("keeps aria-current=page on a last item that is a link", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "A", href: "/a" },
          { label: "B", href: "/b" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "B" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "A" }).hasAttribute("aria-current")).toBe(false);
  });

  it("hides the separators from assistive technology and has none after the last item", () => {
    const { container } = render(<Breadcrumbs items={trail} />);
    const seps = container.querySelectorAll("svg");
    expect(seps).toHaveLength(2);
    for (const s of seps) expect(s.getAttribute("aria-hidden")).toBe("true");
  });

  it("truncates long labels but keeps the full text in a title", () => {
    const long = "A very long payment reference that would otherwise break the layout entirely";
    render(<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: long }]} />);
    const el = screen.getByTitle(long);
    expect(el.className).toContain("truncate");
    expect(el.textContent).toBe(long);
  });

  it("copes with a single item and an empty list", () => {
    const { rerender } = render(<Breadcrumbs items={[{ label: "Home" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(document.querySelector("svg")).toBeNull();
    rerender(<Breadcrumbs items={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("forwards ref, spreads props and keeps className on the nav", () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={trail} className="mb-4" data-x="1" />);
    expect(ref.current?.tagName).toBe("NAV");
    expect(ref.current?.className).toContain("mb-4");
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Breadcrumbs items={trail} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
