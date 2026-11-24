import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./switch";

describe("Switch", () => {
  it("exposes role=switch with its label as the name", () => {
    render(
      <label>
        <Switch /> Notifications
      </label>,
    );
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeTruthy();
  });

  it("reports state through aria-checked semantics (checked property)", async () => {
    render(<Switch aria-label="Notifications" />);
    const el = screen.getByRole("switch") as HTMLInputElement;
    expect(el.checked).toBe(false);
    await userEvent.click(el);
    expect(el.checked).toBe(true);
    expect(screen.getByRole("switch", { checked: true })).toBe(el);
  });

  it("toggles with Space after Tab", async () => {
    render(<Switch aria-label="Notifications" />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("switch"));
    await userEvent.keyboard(" ");
    expect(screen.getByRole("switch")).toHaveProperty("checked", true);
  });

  it("calls onChange, and ignores clicks when disabled", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Switch aria-label="N" onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledOnce();
    rerender(<Switch aria-label="N" onChange={onChange} disabled />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} aria-label="N" name="n" className="w-16" />);
    expect(ref.current).toBe(screen.getByRole("switch"));
    expect(ref.current?.name).toBe("n");
    expect(ref.current?.className).toContain("w-16");
    expect(ref.current?.className).not.toContain("w-11");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <label>
        <Switch /> Notifications
      </label>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
