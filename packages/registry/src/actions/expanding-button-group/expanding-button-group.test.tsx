import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { type ExpandingAction, ExpandingButtonGroup } from "./expanding-button-group";

const icon = <svg viewBox="0 0 16 16" />;
const make = (extra: Partial<ExpandingAction> = {}): ExpandingAction[] => [
  { id: "reply", label: "Reply", icon, ...extra },
  { id: "archive", label: "Archive", icon, successLabel: "Archived" },
  { id: "delete", label: "Delete", icon, variant: "danger" },
];

const open = (name: string) => screen.getByRole("button", { name }).hasAttribute("data-expanded");
const mouseMove = (el: Element, x: number, y = 5) =>
  fireEvent.pointerMove(el, { pointerType: "mouse", clientX: x, clientY: y });

describe("ExpandingButtonGroup", () => {
  afterEach(() => vi.useRealTimers());

  it("is a toolbar of buttons named by their labels", () => {
    render(<ExpandingButtonGroup aria-label="Message actions" actions={make()} />);
    expect(screen.getByRole("toolbar", { name: "Message actions" })).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Reply" })).toBeTruthy();
  });

  it("shows the first enabled action's label at rest", () => {
    const { rerender } = render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    expect(open("Reply")).toBe(true);
    expect(open("Archive")).toBe(false);
    rerender(<ExpandingButtonGroup aria-label="x" actions={make({ disabled: true })} />);
    expect(open("Archive")).toBe(true);
  });

  it("honours restingId, and falls back when it does not exist", () => {
    const { rerender } = render(
      <ExpandingButtonGroup aria-label="x" actions={make()} restingId="delete" />,
    );
    expect(open("Delete")).toBe(true);
    rerender(<ExpandingButtonGroup aria-label="x" actions={make()} restingId="nope" />);
    expect(open("Reply")).toBe(true);
  });

  it("is one Tab stop (roving tabindex) on the resting action", async () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    const tabs = screen.getAllByRole("button").map((b) => b.tabIndex);
    expect(tabs).toEqual([0, -1, -1]);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reply" }));
  });

  it("moves with the arrow keys, Home and End, wrapping around, and expands the focused one", async () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Archive" }));
    expect(open("Archive")).toBe(true);
    expect(open("Reply")).toBe(false);
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Delete" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reply" }));
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Delete" }));
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Reply" }));
  });

  it("returns to rest when focus leaves the group", async () => {
    render(
      <>
        <ExpandingButtonGroup aria-label="x" actions={make()} />
        <button type="button">after</button>
      </>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(open("Archive")).toBe(true);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "after" }));
    expect(open("Reply")).toBe(true);
    expect(open("Archive")).toBe(false);
  });

  it("moves the label to the button the pointer actually moves onto, and back on leave", () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    const archive = screen.getByRole("button", { name: "Archive" });
    mouseMove(archive, 10);
    expect(open("Archive")).toBe(true);
    expect(open("Reply")).toBe(false);
    fireEvent.pointerLeave(screen.getByRole("toolbar"), { pointerType: "mouse" });
    expect(open("Reply")).toBe(true);
  });

  it("ignores a pointer that has not moved, so sliding buttons cannot trade places", () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    const archive = screen.getByRole("button", { name: "Archive" });
    const del = screen.getByRole("button", { name: "Delete" });
    mouseMove(archive, 10, 5);
    expect(open("Archive")).toBe(true);
    // The layout shifts and a different button ends up under the same, unmoved pointer.
    mouseMove(del, 10, 5);
    expect(open("Archive")).toBe(true);
    expect(open("Delete")).toBe(false);
    // A real movement is honoured.
    mouseMove(del, 14, 5);
    expect(open("Delete")).toBe(true);
  });

  it("does not expand on touch or pen hover", () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    fireEvent.pointerMove(screen.getByRole("button", { name: "Archive" }), {
      pointerType: "touch",
      clientX: 20,
    });
    expect(open("Archive")).toBe(false);
  });

  it("runs onAction and then onPress when clicked", async () => {
    const order: string[] = [];
    render(
      <ExpandingButtonGroup
        aria-label="x"
        onAction={(id) => order.push(`action:${id}`)}
        actions={make({ onPress: () => void order.push("press") })}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(order).toEqual(["action:reply", "press"]);
  });

  it("confirms in place: the name becomes the past-tense word, then reverts", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<ExpandingButtonGroup aria-label="x" successDuration={500} actions={make()} />);
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(await screen.findByRole("button", { name: "Archived" })).toBeTruthy();
    expect(open("Archived")).toBe(true);
    expect(screen.getByRole("status").textContent).toBe("Archived");
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByRole("button", { name: "Archive" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("shows no success message when onPress returns false or throws", async () => {
    const actions: ExpandingAction[] = [
      { id: "a", label: "Alpha", icon, successLabel: "Done A", onPress: () => false },
      {
        id: "b",
        label: "Beta",
        icon,
        successLabel: "Done B",
        onPress: () => {
          throw new Error("nope");
        },
      },
      {
        id: "c",
        label: "Gamma",
        icon,
        successLabel: "Done C",
        onPress: () => Promise.reject(new Error("x")),
      },
    ];
    render(<ExpandingButtonGroup aria-label="x" actions={actions} />);
    for (const name of ["Alpha", "Beta", "Gamma"]) {
      await userEvent.click(screen.getByRole("button", { name }));
    }
    await waitFor(() => expect(screen.queryByRole("button", { name: /Done/ })).toBeNull());
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("is busy while a promise is pending, ignores repeat presses, then confirms", async () => {
    let finish: () => void = () => {};
    const onPress = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    render(
      <ExpandingButtonGroup
        aria-label="x"
        actions={[{ id: "share", label: "Share", icon, successLabel: "Shared", onPress }]}
      />,
    );
    const button = screen.getByRole("button", { name: "Share" });
    await userEvent.click(button);
    expect(button.getAttribute("aria-busy")).toBe("true");
    await userEvent.click(button);
    expect(onPress).toHaveBeenCalledOnce();
    await act(async () => finish());
    expect(await screen.findByRole("button", { name: "Shared" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Shared" }).hasAttribute("aria-busy")).toBe(false);
  });

  it("keeps a disabled action focusable, inert, and still able to reveal its label", async () => {
    const onPress = vi.fn();
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    const actions = make({ disabled: true, onPress });
    render(<ExpandingButtonGroup aria-label="y" actions={actions} restingId="archive" />);
    const reply = screen.getAllByRole("button", { name: "Reply" })[1] as HTMLElement;
    expect(reply.getAttribute("aria-disabled")).toBe("true");
    reply.focus();
    await userEvent.click(reply);
    expect(onPress).not.toHaveBeenCalled();
    fireEvent.pointerMove(reply, { pointerType: "mouse", clientX: 30, clientY: 8 });
    expect(reply.hasAttribute("data-expanded")).toBe(true);
  });

  it("on touch, the first tap reveals the label and the second runs the action", () => {
    const onPress = vi.fn();
    render(
      <ExpandingButtonGroup
        aria-label="x"
        actions={[...make(), { id: "more", label: "More", icon, onPress }]}
      />,
    );
    const more = screen.getByRole("button", { name: "More" });
    fireEvent.pointerDown(more, { pointerType: "touch" });
    fireEvent.click(more);
    expect(onPress).not.toHaveBeenCalled();
    expect(open("More")).toBe(true);
    fireEvent.pointerDown(more, { pointerType: "touch" });
    fireEvent.click(more);
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("on touch, an action already showing its label runs on the first tap", () => {
    const onPress = vi.fn();
    render(<ExpandingButtonGroup aria-label="x" actions={make({ onPress })} />);
    const reply = screen.getByRole("button", { name: "Reply" });
    fireEvent.pointerDown(reply, { pointerType: "touch" });
    fireEvent.click(reply);
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("on touch, a tap outside closes a label opened by a first tap", () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    const archive = screen.getByRole("button", { name: "Archive" });
    fireEvent.pointerDown(archive, { pointerType: "touch" });
    fireEvent.click(archive);
    expect(open("Archive")).toBe(true);
    fireEvent.pointerDown(document.body, { pointerType: "touch" });
    expect(open("Archive")).toBe(false);
    expect(open("Reply")).toBe(true);
  });

  it("hides decorative icons from assistive technology and ignores a missing list", () => {
    const { container, rerender } = render(
      <ExpandingButtonGroup aria-label="x" actions={make()} />,
    );
    for (const wrapper of container.querySelectorAll("button > span:first-child")) {
      expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    }
    rerender(<ExpandingButtonGroup aria-label="x" actions={[]} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("never submits a form (buttons are type=button)", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ExpandingButtonGroup aria-label="x" actions={make()} />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("lets className win and spreads props onto the toolbar", () => {
    render(<ExpandingButtonGroup aria-label="x" actions={make()} className="p-3" data-x="1" />);
    const bar = screen.getByRole("toolbar");
    expect(bar.className.split(" ")).toContain("p-3");
    expect(bar.className.split(" ")).not.toContain("p-1");
    expect(bar.getAttribute("data-x")).toBe("1");
  });

  it("offers soft and accent looks and a large size", () => {
    const { rerender } = render(<ExpandingButtonGroup aria-label="x" actions={make()} />);
    const bar = () => screen.getByRole("toolbar");
    expect(bar().className).toContain("border-border");
    rerender(<ExpandingButtonGroup aria-label="x" variant="soft" actions={make()} />);
    expect(bar().className).toContain("bg-muted");
    expect(bar().className).not.toContain("border-border");
    rerender(<ExpandingButtonGroup aria-label="x" variant="accent" size="lg" actions={make()} />);
    const reply = screen.getByRole("button", { name: "Reply" });
    expect(reply.getAttribute("data-tone")).toBe("accent");
    expect(reply.className).toContain(
      "data-[tone=accent]:data-[variant=default]:data-[expanded]:bg-accent",
    );
    expect(reply.className).toContain("h-12");
    // A danger action keeps its own colour even in the accent look.
    expect(screen.getByRole("button", { name: "Delete" }).getAttribute("data-variant")).toBe(
      "danger",
    );
  });

  it("has no axe violations (rest, success, danger, disabled)", async () => {
    const { container } = render(
      <ExpandingButtonGroup
        aria-label="Message actions"
        actions={[
          { id: "a", label: "Reply", icon },
          { id: "b", label: "Archive", icon, successLabel: "Archived" },
          { id: "c", label: "Delete", icon, variant: "danger" },
          { id: "d", label: "Pin", icon, disabled: true },
        ]}
      />,
    );
    expect((await axe(container)).violations).toEqual([]);
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await screen.findByRole("button", { name: "Archived" });
    expect((await axe(container)).violations).toEqual([]);
  });
});
