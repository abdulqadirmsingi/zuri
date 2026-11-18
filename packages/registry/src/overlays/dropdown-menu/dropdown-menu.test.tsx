import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Example({ onEdit = () => {}, onDelete = () => {} }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Transaction</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onEdit}>
          Edit <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Checks() {
  const [on, setOn] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>View</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={on} onCheckedChange={setOn}>
          Show fees
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Radios() {
  const [v, setV] = useState("name");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Sort</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={v} onValueChange={setV}>
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// `region` ("content must be in a landmark") is a page-level rule; a menu is transient content
// in a portal, so it does not apply. Every other rule stays on.
const axeOptions = { rules: { region: { enabled: false } } };

describe("DropdownMenu", () => {
  it("is closed until the trigger is activated; the trigger reports its state", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(trigger);
    expect(await screen.findByRole("menu")).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens with Enter, Space and ArrowDown on the trigger", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await userEvent.keyboard(" ");
    expect(await screen.findByRole("menu")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await userEvent.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menu")).toBeTruthy();
  });

  it("exposes items as menuitems and skips disabled ones", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    expect(screen.getByRole("menuitem", { name: "Archive" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("moves with the arrow keys, Home and End, and skips the disabled item", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: /Edit/ }));
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: /Edit/ }));
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
  });

  it("jumps to an item by typing its first letter", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    await userEvent.keyboard("d");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
  });

  it("chooses with Enter, calls onSelect once, closes and returns focus to the trigger", async () => {
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("chooses with a click, and never runs a disabled item", async () => {
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("closes on Escape and on an outside click", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(document.activeElement).toBe(trigger);
    await userEvent.click(trigger);
    await screen.findByRole("menu");
    // While a modal menu is open the body is inert, so dispatch the pointerdown Radix listens for.
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  // Regression: in modal mode the rest of the page was aria-hidden while still focusable.
  it("leaves the rest of the page available to assistive technology while open", async () => {
    render(
      <>
        <button type="button">Outside</button>
        <Example />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    expect(screen.getByRole("button", { name: "Outside" })).toBeTruthy();
    expect(document.body.style.pointerEvents).not.toBe("none");
  });

  it("can be made modal with the modal prop", async () => {
    render(
      <>
        <button type="button">Outside</button>
        <DropdownMenu modal>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await screen.findByRole("menu");
    expect(screen.queryByRole("button", { name: "Outside" })).toBeNull();
  });

  it("styles a destructive item", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect((await screen.findByRole("menuitem", { name: "Delete" })).className).toContain(
      "text-danger",
    );
  });

  it("supports checkbox items that toggle and report their state", async () => {
    render(<Checks />);
    await userEvent.click(screen.getByRole("button", { name: "View" }));
    const item = await screen.findByRole("menuitemcheckbox", { name: "Show fees" });
    expect(item.getAttribute("aria-checked")).toBe("false");
    await userEvent.click(item);
    await userEvent.click(screen.getByRole("button", { name: "View" }));
    expect(
      (await screen.findByRole("menuitemcheckbox", { name: "Show fees" })).getAttribute(
        "aria-checked",
      ),
    ).toBe("true");
  });

  it("supports radio items where one is chosen at a time", async () => {
    render(<Radios />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    expect(
      (await screen.findByRole("menuitemradio", { name: "Name" })).getAttribute("aria-checked"),
    ).toBe("true");
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Date" }));
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    expect(
      (await screen.findByRole("menuitemradio", { name: "Date" })).getAttribute("aria-checked"),
    ).toBe("true");
    expect(screen.getByRole("menuitemradio", { name: "Name" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("hides decorative indicators and lets className win on the content", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>t</DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-64">
          <DropdownMenuCheckboxItem checked>Item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const menu = await screen.findByRole("menu");
    expect(menu.className).toContain("min-w-64");
    expect(menu.className).not.toContain("min-w-44");
    expect(menu.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("has no axe violations while open (items, label, shortcut, checkbox, radio)", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Group</DropdownMenuLabel>
          <DropdownMenuItem>
            One <DropdownMenuShortcut>Ctrl 1</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Two</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await screen.findByRole("menu");
    expect((await axe(document.body, axeOptions)).violations).toEqual([]);
  });
});
