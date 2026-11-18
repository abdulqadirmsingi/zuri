import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CopyButton } from "./copy-button";

function mockClipboard(impl: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn(impl) },
    configurable: true,
  });
  return navigator.clipboard.writeText as ReturnType<typeof vi.fn>;
}

describe("CopyButton", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the value and shows Copied", async () => {
    const write = mockClipboard(async () => {});
    const onCopied = vi.fn();
    render(
      <CopyButton value="https://zuri.dev/r/button.json" label="Copy link" onCopied={onCopied} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(write).toHaveBeenCalledWith("https://zuri.dev/r/button.json");
    expect(onCopied).toHaveBeenCalledWith("https://zuri.dev/r/button.json");
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
  });

  it("announces the result in a live region", async () => {
    mockClipboard(async () => {});
    render(<CopyButton value="x" />);
    expect(screen.getByRole("status").textContent).toBe("");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("status").textContent).toBe("Copied");
  });

  it("reports failure honestly when the clipboard rejects", async () => {
    mockClipboard(async () => {
      throw new Error("denied");
    });
    const onCopied = vi.fn();
    render(<CopyButton value="x" onCopied={onCopied} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Copy failed");
    expect(onCopied).not.toHaveBeenCalled();
  });

  it("reports failure when the clipboard API is missing", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    render(<CopyButton value="x" />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeTruthy();
  });

  it("returns to the idle label after resetAfter", async () => {
    mockClipboard(async () => {});
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<CopyButton value="x" resetAfter={500} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("icon-only mode keeps a stable accessible name and a square size", async () => {
    mockClipboard(async () => {});
    render(<CopyButton value="x" iconOnly label="Copy link" />);
    const el = screen.getByRole("button", { name: "Copy link" });
    expect(el.className).toContain("size-10");
    await userEvent.click(el);
    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Copied");
  });

  it("is a type=button that never submits a form", async () => {
    mockClipboard(async () => {});
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <CopyButton value="x" />
      </form>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not update state after unmount", async () => {
    mockClipboard(async () => {});
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<CopyButton value="x" resetAfter={100} />);
    await userEvent.click(screen.getByRole("button"));
    unmount();
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("has no axe violations (labelled and icon-only)", async () => {
    const { container } = render(
      <>
        <CopyButton value="x" label="Copy link" />
        <CopyButton value="x" iconOnly label="Copy link" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
