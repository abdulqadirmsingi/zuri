import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

function Example({ onConfirm = () => {} }: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it("is closed until the trigger is activated", () => {
    render(<Example />);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("opens as an alertdialog named by its title and described by its description", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    expect(
      await screen.findByRole("alertdialog", {
        name: "Delete account?",
        description: "This cannot be undone.",
      }),
    ).toBeTruthy();
  });

  it("puts focus on Cancel, the safe choice, when it opens", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
  });

  it("does not close on an outside click (it demands a choice)", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");
    const overlay = document.querySelector("[data-state='open'][class*='inset-0']");
    expect(overlay).toBeTruthy();
    await userEvent.click(overlay as Element);
    expect(screen.getByRole("alertdialog")).toBeTruthy();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Delete account" });
    await userEvent.click(trigger);
    await screen.findByRole("alertdialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("runs the action once and closes when confirmed", async () => {
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("does not run the action when cancelled", async () => {
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("traps focus inside while open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    const dialog = await screen.findByRole("alertdialog");
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("styles the destructive action and lets className win", async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogTitle>T</AlertDialogTitle>
          <AlertDialogDescription>D</AlertDialogDescription>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Yes</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const dialog = await screen.findByRole("alertdialog");
    expect(dialog.className).toContain("max-w-sm");
    expect(dialog.className).not.toContain("max-w-md");
    expect(screen.getByRole("button", { name: "Yes" }).className).toContain("text-danger");
  });

  it("has no axe violations while open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");
    expect((await axe(document.body)).violations).toEqual([]);
  });
});
