import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SiteFooter } from "./site-footer";

const columns = [
  { title: "Product", links: [{ label: "Pricing", href: "/pricing" }] },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

describe("SiteFooter", () => {
  it("is a contentinfo landmark", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
  it("makes each column a navigation named by its title", () => {
    render(<SiteFooter columns={columns} />);
    const company = screen.getByRole("navigation", { name: "Company" });
    expect(within(company).getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("navigation", { name: "Product" })).toBeTruthy();
  });
  it("renders the brand, description and legal line", () => {
    render(<SiteFooter brand="Zuri" description="Beautiful parts" legal="© 2026 Zuri" />);
    expect(screen.getByText("Zuri")).toBeTruthy();
    expect(screen.getByText("Beautiful parts")).toBeTruthy();
    expect(screen.getByText("© 2026 Zuri")).toBeTruthy();
  });
  it("renders links with a custom component", () => {
    render(
      <SiteFooter
        columns={columns}
        linkAs={(p: { href: string; className?: string; children?: React.ReactNode }) => (
          <a data-custom="1" {...p} />
        )}
      />,
    );
    expect(screen.getByRole("link", { name: "Pricing" }).getAttribute("data-custom")).toBe("1");
  });
  it("forwards the ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(<SiteFooter ref={ref} className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });
  it("has no axe violations", async () => {
    const { container } = render(
      <SiteFooter brand="Zuri" description="D" columns={columns} legal="© 2026" />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
