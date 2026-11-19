import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { UserMenu, type UserMenuItem } from "./user-menu";

const user = { name: "Asha Juma", email: "asha@example.com", plan: "Pro" };
const items: UserMenuItem[] = [
  { id: "profile", label: "Profile", href: "/profile", shortcut: "Ctrl P" },
  { id: "settings", label: "Settings" },
];

/** jsdom has no matchMedia, so a test chooses whether the screen counts as narrow. */
function setNarrow(narrow: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: narrow,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

const openMenu = async () => {
  await userEvent.click(screen.getByRole("button", { name: /Account menu/ }));
  return screen.findByRole("menu");
};

// `region` is a page-level rule; a menu and a sheet are transient portal content.
const axeOptions = { rules: { region: { enabled: false } } };

describe("UserMenu (wide screens: a menu)", () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
    vi.useRealTimers();
  });

  it("names the trigger with the person and, when shown, their status", () => {
    const { rerender } = render(<UserMenu user={user} />);
    expect(screen.getByRole("button", { name: "Account menu, Asha Juma" })).toBeTruthy();
    rerender(<UserMenu user={user} status="busy" />);
    expect(screen.getByRole("button", { name: "Account menu, Asha Juma, Busy" })).toBeTruthy();
  });

  it("opens as a menu from the trigger, by click and by keyboard", async () => {
    render(<UserMenu user={user} items={items} />);
    const trigger = screen.getByRole("button", { name: /Account menu/ });
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    await userEvent.click(trigger);
    expect(await screen.findByRole("menu")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(document.activeElement).toBe(trigger);
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menu")).toBeTruthy();
  });

  it("shows who the person is: name, email and plan", async () => {
    render(<UserMenu user={user} />);
    const menu = await openMenu();
    expect(menu.textContent).toContain("Asha Juma");
    expect(menu.textContent).toContain("asha@example.com");
    expect(menu.textContent).toContain("Pro");
  });

  it("lists destinations as menu items; links keep their href and the shortcut is part of the name", async () => {
    render(<UserMenu user={user} items={items} />);
    await openMenu();
    const profile = screen.getByRole("menuitem", { name: "Profile Ctrl P" });
    expect(profile.tagName).toBe("A");
    expect(profile.getAttribute("href")).toBe("/profile");
    expect(profile.textContent).toContain("Ctrl P");
    expect(screen.getByRole("menuitem", { name: "Settings" }).tagName).toBe("DIV");
  });

  it("runs an item's onSelect once and closes the menu", async () => {
    const onSelect = vi.fn();
    render(<UserMenu user={user} items={[{ id: "settings", label: "Settings", onSelect }]} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("offers Light, Dark and System as radio items, with the choice checked", async () => {
    render(<UserMenu user={user} defaultTheme="dark" />);
    await openMenu();
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(3);
    expect(screen.getByRole("menuitemradio", { name: "Dark" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(screen.getByRole("menuitemradio", { name: "System" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("keeps the menu open when a theme is chosen, reports it, and updates the check", async () => {
    const onThemeChange = vi.fn();
    render(<UserMenu user={user} onThemeChange={onThemeChange} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Light" }));
    expect(onThemeChange).toHaveBeenCalledWith("light");
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getByRole("menuitemradio", { name: "Light" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("works with a controlled theme: it only changes when the parent says so", async () => {
    const onThemeChange = vi.fn();
    render(<UserMenu user={user} theme="system" onThemeChange={onThemeChange} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
    expect(screen.getByRole("menuitemradio", { name: "System" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("can hide the theme choice", async () => {
    render(<UserMenu user={user} showTheme={false} />);
    await openMenu();
    expect(screen.queryByRole("menuitemradio", { name: "Dark" })).toBeNull();
  });

  it("shows a status choice only when asked, and keeps the menu open on choosing", async () => {
    const { unmount } = render(<UserMenu user={user} />);
    await openMenu();
    expect(screen.queryByRole("menuitemradio", { name: "Busy" })).toBeNull();
    unmount();
    const onStatusChange = vi.fn();
    render(<UserMenu user={user} defaultStatus="available" onStatusChange={onStatusChange} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitemradio", { name: "Away" }));
    expect(onStatusChange).toHaveBeenCalledWith("away");
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getByRole("menuitemradio", { name: "Away" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("signs out: runs onSignOut once and closes", async () => {
    const onSignOut = vi.fn();
    render(<UserMenu user={user} onSignOut={onSignOut} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("an async sign out shows progress, ignores a second press, then closes", async () => {
    let finish: () => void = () => {};
    const onSignOut = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<UserMenu user={user} onSignOut={onSignOut} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    const busy = await screen.findByRole("menuitem", { name: "Signing out…" });
    expect(busy.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
    await userEvent.click(busy);
    expect(onSignOut).toHaveBeenCalledOnce();
    await act(async () => finish());
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("closes even if the sign out fails, without an unhandled rejection", async () => {
    const onSignOut = vi.fn(() => Promise.reject(new Error("network")));
    render(<UserMenu user={user} onSignOut={onSignOut} />);
    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("supports a controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<UserMenu user={user} open={false} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Account menu/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("menu")).toBeNull();
    rerender(<UserMenu user={user} open onOpenChange={onOpenChange} />);
    expect(await screen.findByRole("menu")).toBeTruthy();
  });

  // Regression: visible initials inside a button named "Account menu, ..." broke WCAG 2.5.3.
  it("hides the trigger's picture from assistive technology, because its name already says who it is", () => {
    render(<UserMenu user={user} />);
    const trigger = screen.getByRole("button", { name: /Account menu/ });
    const picture = trigger.querySelector('[role="img"]');
    expect(picture?.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it("falls back to initials when there is no picture", () => {
    render(<UserMenu user={user} />);
    expect(screen.getByText("AJ")).toBeTruthy();
  });

  it("lets every message be reworded", async () => {
    render(
      <UserMenu
        user={user}
        defaultStatus="busy"
        onStatusChange={() => {}}
        messages={{
          signOut: "Log out",
          theme: "Appearance",
          themes: { dark: "Night" },
          statuses: { busy: "Do not disturb" },
          triggerLabel: (name) => `Open ${name}'s menu`,
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Open Asha Juma's menu" })).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: /menu/ }));
    expect(await screen.findByRole("menuitem", { name: "Log out" })).toBeTruthy();
    expect(screen.getByRole("menuitemradio", { name: "Night" })).toBeTruthy();
    expect(screen.getByRole("menuitemradio", { name: "Do not disturb" })).toBeTruthy();
    // Anything left out keeps its English default.
    expect(screen.getByRole("menuitemradio", { name: "Light" })).toBeTruthy();
  });

  it("has no axe violations while open (items, theme, status)", async () => {
    render(<UserMenu user={user} items={items} defaultStatus="away" onStatusChange={() => {}} />);
    await openMenu();
    expect((await axe(document.body, axeOptions)).violations).toEqual([]);
  });
});

describe("UserMenu (narrow screens: a bottom sheet)", () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  const openSheet = async () => {
    setNarrow(true);
    const view = render(
      <UserMenu user={user} items={items} defaultStatus="available" onStatusChange={() => {}} />,
    );
    const trigger = screen.getByRole("button", { name: /Account menu/ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    return { view, trigger, dialog };
  };

  it("opens as a dialog named by the person, with the email as its description", async () => {
    const { dialog, trigger } = await openSheet();
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(
      screen.getByRole("dialog", { name: "Asha Juma", description: "asha@example.com" }),
    ).toBeTruthy();
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
  });

  it("shows destinations as plain links and buttons, closing after one is chosen", async () => {
    const { trigger } = await openSheet();
    expect(screen.getByRole("link", { name: "Profile" }).getAttribute("href")).toBe("/profile");
    await userEvent.click(screen.getByRole("button", { name: "Settings" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("offers theme and status as labelled groups of pressed buttons that keep the sheet open", async () => {
    await openSheet();
    expect(screen.getByRole("group", { name: "Theme" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Status" })).toBeTruthy();
    const dark = screen.getByRole("button", { name: "Dark" });
    expect(dark.getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(dark);
    expect(screen.getByRole("button", { name: "Dark" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const { trigger } = await openSheet();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("has a close button and traps focus inside", async () => {
    const { dialog } = await openSheet();
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
    for (let i = 0; i < 12; i++) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("signs out with progress, then closes", async () => {
    setNarrow(true);
    let finish: () => void = () => {};
    const onSignOut = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<UserMenu user={user} onSignOut={onSignOut} />);
    await userEvent.click(screen.getByRole("button", { name: /Account menu/ }));
    await userEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    const busy = await screen.findByRole("button", { name: "Signing out…" });
    expect(busy.getAttribute("aria-busy")).toBe("true");
    await act(async () => finish());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("has no axe violations while open", async () => {
    await openSheet();
    expect((await axe(document.body, axeOptions)).violations).toEqual([]);
  });
});

describe("UserMenu bottom sheet: drag to dismiss", () => {
  // jsdom has no layout, so give every element a height; the sheet is "400px" tall here.
  const heightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get: () => 400,
    });
  });
  afterEach(() => {
    if (heightDescriptor)
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", heightDescriptor);
    delete (window as { matchMedia?: unknown }).matchMedia;
    vi.restoreAllMocks();
  });

  async function openSheet() {
    setNarrow(true);
    render(<UserMenu user={user} items={items} />);
    const trigger = screen.getByRole("button", { name: /Account menu/ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    const grip = dialog.querySelector<HTMLElement>(".touch-none") as HTMLElement;
    return { trigger, dialog, grip };
  }
  const pointer = (clientY: number, extra: Record<string, unknown> = {}) => ({
    pointerId: 1,
    pointerType: "touch",
    button: 0,
    clientY,
    ...extra,
  });

  it("has a grab handle that assistive technology ignores", async () => {
    const { grip } = await openSheet();
    expect(grip).toBeTruthy();
    expect(grip.querySelector('[aria-hidden="true"]')).toBeTruthy();
    expect(grip.className).toContain("touch-none");
  });

  it("follows the pointer straight down", async () => {
    const { dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(100));
    fireEvent.pointerMove(grip, pointer(160));
    expect(dialog.style.transform).toBe("translateY(60px)");
    expect(dialog.style.transition).toBe("none");
  });

  it("resists being pulled up instead of following", async () => {
    const { dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(100));
    fireEvent.pointerMove(grip, pointer(40));
    expect(dialog.style.transform).toBe("translateY(-12px)");
  });

  it("dismisses when dragged past 30% of its height, then returns focus to the trigger", async () => {
    const { trigger, dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(100));
    fireEvent.pointerMove(grip, pointer(300));
    fireEvent.pointerUp(grip, pointer(300));
    expect(dialog.style.transform).toBe("translateY(400px)"); // sliding the rest of the way out
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("springs back when dragged only a little, and slowly", async () => {
    // Events fired back to back in a test would look like an instant flick, so pin the clock:
    // 40px over half a second is a slow, short pull.
    const now = vi.spyOn(performance, "now");
    const { dialog, grip } = await openSheet();
    now.mockReturnValueOnce(0);
    fireEvent.pointerDown(grip, pointer(100));
    now.mockReturnValueOnce(500);
    fireEvent.pointerMove(grip, pointer(140));
    now.mockReturnValue(520);
    fireEvent.pointerUp(grip, pointer(140));
    expect(dialog.style.transform).toBe("");
    expect(dialog.style.transition).toBe("");
    await new Promise((r) => setTimeout(r, 200));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("dismisses on a quick downward flick even over a short distance", async () => {
    const now = vi.spyOn(performance, "now");
    const { grip } = await openSheet();
    now.mockReturnValueOnce(0); // pointer down
    fireEvent.pointerDown(grip, pointer(100));
    now.mockReturnValueOnce(20); // moved 40px in 20ms: 2px/ms
    fireEvent.pointerMove(grip, pointer(140));
    now.mockReturnValue(30); // let go straight away
    fireEvent.pointerUp(grip, pointer(140));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("does not count a flick if the pointer paused before letting go", async () => {
    const now = vi.spyOn(performance, "now");
    const { dialog, grip } = await openSheet();
    now.mockReturnValueOnce(0);
    fireEvent.pointerDown(grip, pointer(100));
    now.mockReturnValueOnce(20);
    fireEvent.pointerMove(grip, pointer(140));
    now.mockReturnValue(700); // a long pause
    fireEvent.pointerUp(grip, pointer(140));
    expect(dialog.style.transform).toBe("");
    await new Promise((r) => setTimeout(r, 200));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("never dismisses from an upward pull", async () => {
    const { dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(300));
    fireEvent.pointerMove(grip, pointer(20));
    fireEvent.pointerUp(grip, pointer(20));
    expect(dialog.style.transform).toBe("");
    await new Promise((r) => setTimeout(r, 200));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("settles back when the browser cancels the gesture", async () => {
    const { dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(100));
    fireEvent.pointerMove(grip, pointer(350)); // far enough to dismiss...
    fireEvent.pointerCancel(grip, pointer(350)); // ...but it was cancelled, e.g. by a system gesture
    expect(dialog.style.transform).toBe("");
    await new Promise((r) => setTimeout(r, 200));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("ignores a second pointer while one is dragging", async () => {
    const { dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(100));
    fireEvent.pointerMove(grip, pointer(150));
    fireEvent.pointerDown(grip, pointer(500, { pointerId: 2 }));
    fireEvent.pointerMove(grip, pointer(600, { pointerId: 2 }));
    expect(dialog.style.transform).toBe("translateY(50px)");
  });

  it("ignores the right mouse button", async () => {
    const { dialog, grip } = await openSheet();
    fireEvent.pointerDown(grip, pointer(100, { pointerType: "mouse", button: 2 }));
    fireEvent.pointerMove(grip, pointer(200, { pointerType: "mouse" }));
    expect(dialog.style.transform).toBe("");
  });

  it("does not start a drag from the list rows, so they stay clickable and scrollable", async () => {
    const { dialog } = await openSheet();
    const row = screen.getByRole("link", { name: "Profile" });
    fireEvent.pointerDown(row, pointer(100));
    fireEvent.pointerMove(row, pointer(300));
    expect(dialog.style.transform).toBe("");
  });

  it("still closes with Escape and with the close button (dragging is never the only way)", async () => {
    const { trigger } = await openSheet();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("has no axe violations with the grab handle", async () => {
    await openSheet();
    expect((await axe(document.body, axeOptions)).violations).toEqual([]);
  });
});
