import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Example({
  onValueChange,
  variant,
}: {
  onValueChange?: (v: string) => void;
  variant?: "pill" | "line";
}) {
  return (
    <Tabs defaultValue="overview" onValueChange={onValueChange}>
      <TabsList aria-label="Account" variant={variant}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="limits" disabled>
          Limits
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
      <TabsContent value="limits">Limits panel</TabsContent>
      <TabsContent value="settings">Settings panel</TabsContent>
    </Tabs>
  );
}

function Controlled() {
  const [v, setV] = useState("activity");
  return (
    <Tabs value={v} onValueChange={setV}>
      <TabsList aria-label="Controlled">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">A</TabsContent>
      <TabsContent value="activity">B</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("has a named tablist, tabs and one visible tabpanel", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Account" })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tabpanel", { name: "Overview" }).textContent).toBe("Overview panel");
    expect(screen.queryByText("Activity panel")).toBeNull();
  });

  it("marks the selected tab with aria-selected", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Overview" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByRole("tab", { name: "Activity" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("switches panel on click and reports the change", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Activity" }));
    expect(onValueChange).toHaveBeenCalledWith("activity");
    expect(screen.getByRole("tabpanel", { name: "Activity" }).textContent).toBe("Activity panel");
  });

  it("is one Tab stop: Tab goes to the selected tab, then into its panel", async () => {
    render(<Example />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Overview" }));
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("tabpanel"));
  });

  it("moves and selects with the arrow keys, skipping disabled tabs", async () => {
    render(<Example />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Activity" }));
    expect(screen.getByRole("tabpanel", { name: "Activity" })).toBeTruthy();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Settings" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Overview" }));
  });

  it("supports Home and End", async () => {
    render(<Example />);
    await userEvent.tab();
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Settings" }));
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Overview" }));
  });

  it("never selects a disabled tab", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Limits" }));
    expect(screen.getByRole("tab", { name: "Limits" }).getAttribute("aria-selected")).toBe("false");
    expect(screen.queryByText("Limits panel")).toBeNull();
  });

  it("works controlled", async () => {
    render(<Controlled />);
    expect(screen.getByRole("tabpanel").textContent).toBe("B");
    await userEvent.click(screen.getByRole("tab", { name: "Overview" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("A");
  });

  it("renders a decorative sliding indicator that screen readers ignore", () => {
    const { container } = render(<Example />);
    // jsdom has no layout, so the indicator only appears once measured; either way it is hidden.
    for (const el of container.querySelectorAll('[role="tablist"] > span')) {
      expect(el.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("exposes the variant and lets className win", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="x" variant="line" className="gap-4" data-testid="l">
          <TabsTrigger value="a" className="px-6">
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">p</TabsContent>
      </Tabs>,
    );
    const list = screen.getByTestId("l");
    expect(list.getAttribute("data-variant")).toBe("line");
    expect(list.className.split(" ")).toContain("gap-4");
    expect(list.className.split(" ")).not.toContain("gap-1");
    expect(screen.getByRole("tab").className).toContain("px-6");
  });

  it("has no axe violations (pill and line)", async () => {
    const { container } = render(
      <>
        <Example />
        <Example variant="line" />
      </>,
    );
    // Both examples reuse the same ids' prefixes; each Radix instance generates its own.
    expect((await axe(container)).violations).toEqual([]);
  });

  // Regression: the indicator was sized from getBoundingClientRect, which includes a CSS scale on
  // any ancestor (the home page shows tabs at 1.3x), so the pill came out wider than its tab.
  it("sizes the indicator from layout pixels, ignoring transforms on ancestors", () => {
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockReturnValue(4);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(80);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 999,
      width: 400,
      right: 1399,
      top: 0,
      bottom: 0,
      height: 0,
      x: 999,
      y: 0,
      toJSON: () => ({}),
    });
    const { container } = render(<Example />);
    const indicator = container.querySelector<HTMLElement>("[aria-hidden='true'].absolute");
    expect(indicator?.style.width).toBe("80px");
    expect(indicator?.style.transform).toBe("translateX(4px)");
    vi.restoreAllMocks();
  });
});
