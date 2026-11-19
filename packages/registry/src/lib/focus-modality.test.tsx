import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { lastInputWasPointer, useQuietFocusRestore } from "./focus-modality";

function Probe({ onReady }: { onReady: (h: ReturnType<typeof useQuietFocusRestore>) => void }) {
  onReady(useQuietFocusRestore());
  return (
    <button type="button" data-testid="trigger">
      open
    </button>
  );
}

let captured!: ReturnType<typeof useQuietFocusRestore>;
function WithHandler({ onClose }: { onClose: (e: Event) => void }) {
  captured = useQuietFocusRestore(onClose);
  return null;
}

function setup() {
  let handlers!: ReturnType<typeof useQuietFocusRestore>;
  const utils = render(<Probe onReady={(h) => (handlers = h)} />);
  const trigger = utils.getByTestId("trigger");
  trigger.focus();
  return { handlers: () => handlers, trigger };
}

const closeEvent = () => new Event("focusScope.autoFocusOnUnmount", { cancelable: true });

describe("focus modality", () => {
  it("tracks whether the last input was a pointer or a key", () => {
    setup();
    act(() => void window.dispatchEvent(new Event("pointerdown")));
    expect(lastInputWasPointer()).toBe(true);
    act(() => void window.dispatchEvent(new Event("keydown")));
    expect(lastInputWasPointer()).toBe(false);
  });

  it("after a pointer interaction, returns focus to the trigger without a ring", () => {
    const { handlers, trigger } = setup();
    handlers().probe(document.createElement("span"));
    const focus = vi.spyOn(trigger, "focus");
    act(() => void window.dispatchEvent(new Event("pointerdown")));
    const event = closeEvent();
    handlers().onCloseAutoFocus(event);
    expect(event.defaultPrevented).toBe(true);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true, focusVisible: false });
  });

  it("after a key press, leaves the default focus return alone", () => {
    const { handlers, trigger } = setup();
    handlers().probe(document.createElement("span"));
    const focus = vi.spyOn(trigger, "focus");
    act(() => void window.dispatchEvent(new Event("keydown")));
    const event = closeEvent();
    handlers().onCloseAutoFocus(event);
    expect(event.defaultPrevented).toBe(false);
    expect(focus).not.toHaveBeenCalled();
  });

  it("finds a trigger that never got focus through aria-controls", () => {
    const { handlers, trigger } = setup();
    trigger.blur();
    trigger.setAttribute("aria-controls", "menu-1");
    const content = document.createElement("div");
    content.id = "menu-1";
    const probe = document.createElement("span");
    content.append(probe);
    handlers().probe(probe);
    const focus = vi.spyOn(trigger, "focus");
    act(() => void window.dispatchEvent(new Event("pointerdown")));
    const event = closeEvent();
    handlers().onCloseAutoFocus(event);
    expect(event.defaultPrevented).toBe(true);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true, focusVisible: false });
  });

  it("does nothing when nothing had focus to return to", () => {
    const { handlers, trigger } = setup();
    trigger.blur();
    handlers().probe(document.createElement("span"));
    act(() => void window.dispatchEvent(new Event("pointerdown")));
    const event = closeEvent();
    handlers().onCloseAutoFocus(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("calls the handler the app passed in first, and lets it veto", () => {
    const onClose = vi.fn((e: Event) => e.preventDefault());
    render(<WithHandler onClose={onClose} />);
    act(() => void window.dispatchEvent(new Event("pointerdown")));
    const event = closeEvent();
    captured.onCloseAutoFocus(event);
    expect(onClose).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });
});
