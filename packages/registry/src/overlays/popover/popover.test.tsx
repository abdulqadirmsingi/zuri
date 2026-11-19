import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

function Example({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger>Filters</PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <input aria-label="Min amount" />
        <PopoverClose>Apply</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("is closed until the trigger is activated, and the trigger reports its state", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Filters" })).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens with the keyboard and moves focus inside", async () => {
    render(<Example />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    const panel = await screen.findByRole("dialog");
    expect(panel.contains(document.activeElement)).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Filters" });
    await userEvent.click(trigger);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on an outside click and from a PopoverClose", async () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    await screen.findByRole("dialog");
    await userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    await userEvent.click(await screen.findByRole("button", { name: "Apply" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("applies variant classes and lets className win", async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>t</PopoverTrigger>
        <PopoverContent variant="glass" className="w-96" aria-label="x">
          c
        </PopoverContent>
      </Popover>,
    );
    const panel = await screen.findByRole("dialog");
    expect(panel.className).toContain("zuri-glass");
    expect(panel.className).toContain("w-96");
    expect(panel.className).not.toContain("w-72");
  });

  it("limits its height to the space available, so tall content scrolls inside it", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    const panel = await screen.findByRole("dialog");
    expect(panel.className).toContain("max-h-[var(--radix-popover-content-available-height)]");
    expect(panel.className).toContain("overflow-y-auto");
  });

  it("has no axe violations while open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    await screen.findByRole("dialog");
    expect((await axe(document.body)).violations).toEqual([]);
  });
});
