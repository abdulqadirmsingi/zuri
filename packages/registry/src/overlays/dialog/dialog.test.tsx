import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Example(props: { variant?: "default" | "glass"; onOpenChange?: (o: boolean) => void }) {
  return (
    <Dialog onOpenChange={props.onOpenChange}>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogContent variant={props.variant}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Change how payments notify you.</DialogDescription>
        </DialogHeader>
        <input aria-label="Name" />
        <DialogFooter>
          <DialogClose>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed until the trigger is activated", () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens as a dialog named by its title and described by its description", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Settings",
      description: "Change how payments notify you.",
    });
    expect(dialog).toBeTruthy();
  });

  it("moves focus into the dialog and returns it to the trigger on close", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("opens with the keyboard (Enter on the trigger)", async () => {
    render(<Example />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("traps focus: Tab cycles within the dialog", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    const dialog = await screen.findByRole("dialog");
    for (let i = 0; i < 8; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("closes from the close button and from a Close control", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    await userEvent.click(await screen.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    await userEvent.click(await screen.findByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("closes on an outside click", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    await screen.findByRole("dialog");
    // While a modal is open the page is inert, so the backdrop is what gets clicked.
    const overlay = document.querySelector("[data-state='open'][class*='inset-0']");
    expect(overlay).toBeTruthy();
    await userEvent.click(overlay as Element);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("hides the rest of the page from assistive technology while open", async () => {
    render(
      <>
        <button type="button">Outside</button>
        <Example />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
    await screen.findByRole("dialog");
    expect(screen.queryByRole("button", { name: "Outside" })).toBeNull();
  });

  it("reports open changes and works controlled", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog
          open={open}
          onOpenChange={(o) => {
            onOpenChange(o);
            setOpen(o);
          }}
        >
          <DialogContent>
            <DialogTitle>Hi</DialogTitle>
            <DialogDescription>There</DialogDescription>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Controlled />);
    expect(await screen.findByRole("dialog")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("uses a custom close label and lets className win", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent closeLabel="Dismiss" className="max-w-sm">
          <DialogTitle>T</DialogTitle>
          <DialogDescription>D</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    const dialog = await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy();
    expect(dialog.className).toContain("max-w-sm");
    expect(dialog.className).not.toContain("max-w-lg");
  });

  it("has no axe violations while open (default and glass)", async () => {
    for (const variant of ["default", "glass"] as const) {
      const { unmount } = render(<Example variant={variant} />);
      await userEvent.click(screen.getByRole("button", { name: "Open settings" }));
      await screen.findByRole("dialog");
      expect((await axe(document.body)).violations).toEqual([]);
      unmount();
    }
  });
});
