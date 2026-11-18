import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Tooltip } from "./tooltip";

function Example({ delay = 0 }: { delay?: number }) {
  return (
    <Tooltip content="Copy link" delayDuration={delay}>
      <button type="button" aria-label="Copy">
        icon
      </button>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("is hidden until hover or focus", () => {
    render(<Example />);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows on hover and describes the trigger without renaming it", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Copy" });
    await userEvent.hover(trigger);
    const tip = await screen.findByRole("tooltip");
    expect(tip.textContent).toBe("Copy link");
    expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
    // The accessible name is still the button's own label.
    expect(screen.getByRole("button", { name: "Copy", description: "Copy link" })).toBeTruthy();
  });

  it("shows on keyboard focus", async () => {
    render(<Example />);
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toBeTruthy();
  });

  // Closing when the pointer leaves depends on real layout (Radix's pointer-grace area), which
  // jsdom does not have, so that part is checked in a real browser instead.
  it("closes on Escape", async () => {
    render(<Example />);
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });

  it("waits for the delay before showing", async () => {
    render(<Example delay={400} />);
    await userEvent.hover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(await screen.findByRole("tooltip", {}, { timeout: 1500 })).toBeTruthy();
  });

  it("does not take over the trigger: it stays one button", () => {
    render(<Example />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("has no axe violations while shown", async () => {
    render(<Example />);
    await userEvent.tab();
    await screen.findByRole("tooltip");
    // `region` ("content must be in a landmark") is a page-level rule. A tooltip is transient
    // content in a portal, reached through aria-describedby, so it is not applicable here.
    // Every other rule stays on.
    const result = await axe(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
