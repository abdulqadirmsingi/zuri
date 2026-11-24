import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { OtpInput } from "./otp-input";

const field = () => screen.getByRole("textbox") as HTMLInputElement;
const flush = () => act(() => vi.advanceTimersByTimeAsync(2000));

describe("OtpInput", () => {
  afterEach(() => vi.useRealTimers());

  it("is one real input named by its length, set up for codes", () => {
    render(<OtpInput length={4} />);
    expect(screen.getByRole("textbox", { name: "4-digit code" })).toBeTruthy();
    expect(field().getAttribute("autocomplete")).toBe("one-time-code");
    expect(field().getAttribute("inputmode")).toBe("numeric");
    expect(field().maxLength).toBe(4);
  });

  it("keeps digits only and stops at its length", async () => {
    render(<OtpInput length={6} />);
    await userEvent.type(field(), "12a3-45678");
    expect(field().value).toBe("123456");
  });

  it("clamps the length between 3 and 8", () => {
    const { rerender } = render(<OtpInput length={20} />);
    expect(field().maxLength).toBe(8);
    rerender(<OtpInput length={1} />);
    expect(field().maxLength).toBe(3);
  });

  it("takes a pasted or autofilled code in one go", () => {
    const onComplete = vi.fn();
    render(<OtpInput length={6} onComplete={onComplete} />);
    fireEvent.change(field(), { target: { value: "482913" } });
    expect(field().value).toBe("482913");
    expect(onComplete).toHaveBeenCalledWith("482913");
  });

  it("calls onComplete once the row is full, and without verify it stays as it is", () => {
    const onComplete = vi.fn();
    const { container } = render(<OtpInput length={4} onComplete={onComplete} />);
    fireEvent.change(field(), { target: { value: "123" } });
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.change(field(), { target: { value: "1234" } });
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(container.firstElementChild?.getAttribute("data-phase")).toBe("type");
  });

  it("checks a full code with verify and fuses into the capsule when it is right", async () => {
    vi.useFakeTimers();
    const verify = vi.fn().mockResolvedValue(true);
    const onVerified = vi.fn();
    const { container } = render(<OtpInput length={4} verify={verify} onVerified={onVerified} />);
    const root = container.firstElementChild as HTMLElement;
    fireEvent.change(field(), { target: { value: "1234" } });
    expect(root.getAttribute("data-phase")).toBe("check");
    expect(screen.getByRole("status").textContent).toBe("Checking the code");
    await flush();
    expect(verify).toHaveBeenCalledWith("1234");
    expect(root.getAttribute("data-phase")).toBe("ok");
    expect(onVerified).toHaveBeenCalledWith("1234");
    expect(screen.getByRole("status").textContent).toBe("Verified");
    expect(field().getAttribute("aria-label")).toBe("Verified. Press to enter a new code");
  });

  it("shakes, announces the failure, then clears and refocuses when the code is wrong", async () => {
    vi.useFakeTimers();
    const onFailed = vi.fn();
    const { container } = render(
      <OtpInput length={4} verify={() => Promise.resolve(false)} onFailed={onFailed} />,
    );
    const root = container.firstElementChild as HTMLElement;
    fireEvent.change(field(), { target: { value: "1234" } });
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect(root.getAttribute("data-phase")).toBe("no");
    expect(field().getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("status").textContent).toContain("not right");
    expect(onFailed).toHaveBeenCalledWith("1234");
    await flush();
    expect(root.getAttribute("data-phase")).toBe("type");
    expect(field().value).toBe("");
    expect(document.activeElement).toBe(field());
  });

  it("treats a rejected verify as a wrong code", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <OtpInput length={4} verify={() => Promise.reject(new Error("x"))} />,
    );
    fireEvent.change(field(), { target: { value: "1234" } });
    await act(() => vi.advanceTimersByTimeAsync(500));
    expect((container.firstElementChild as HTMLElement).getAttribute("data-phase")).toBe("no");
  });

  it("ignores typing while it is checking", async () => {
    vi.useFakeTimers();
    render(<OtpInput length={4} verify={() => new Promise(() => {})} />);
    fireEvent.change(field(), { target: { value: "1234" } });
    fireEvent.change(field(), { target: { value: "9999" } });
    expect(field().value).toBe("1234");
  });

  it("starts over when a verified row is pressed", async () => {
    vi.useFakeTimers();
    const { container } = render(<OtpInput length={4} verify={() => Promise.resolve(true)} />);
    fireEvent.change(field(), { target: { value: "1234" } });
    await flush();
    fireEvent.pointerDown(field());
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-phase")).toBe("type");
    expect(field().value).toBe("");
  });

  it("can keep the cells and show a green outline instead of fusing", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <OtpInput length={4} fuse={false} verify={() => Promise.resolve(true)} />,
    );
    fireEvent.change(field(), { target: { value: "1234" } });
    await flush();
    expect(container.innerHTML).toContain("var(--success)");
    expect(container.innerHTML).not.toContain("opacity-0 delay");
  });

  it("marks itself invalid from outside", () => {
    const { container } = render(<OtpInput invalid />);
    expect(field().getAttribute("aria-invalid")).toBe("true");
    expect(container.querySelector("[data-invalid]")).toBeTruthy();
  });

  it("applies size and tone, and takes a name, ref and className", () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <OtpInput ref={ref} name="code" size="lg" tone="accent" className="extra" id="otp" />,
    );
    expect(ref.current).toBe(field());
    expect(field().getAttribute("name")).toBe("code");
    expect(field().id).toBe("otp");
    expect((container.firstElementChild as HTMLElement).className).toContain("extra");
    expect(container.innerHTML).toContain("h-14");
    expect(container.innerHTML).toContain("bg-accent");
  });

  it("lets a visible label name it, and still says how to start over once verified", async () => {
    vi.useFakeTimers();
    render(
      <OtpInput
        label={null}
        id="otp"
        length={4}
        verify={() => Promise.resolve(true)}
        messages={{ reopen: "Imethibitishwa. Bonyeza kuingiza tena" }}
      />,
    );
    expect(field().getAttribute("aria-label")).toBeNull();
    fireEvent.change(field(), { target: { value: "1234" } });
    await flush();
    expect(field().getAttribute("aria-label")).toBe("Imethibitishwa. Bonyeza kuingiza tena");
  });

  it("turns off its movement for reduced motion", () => {
    const { container } = render(<OtpInput />);
    expect(container.innerHTML).toContain("motion-reduce:data-[invalid]:animate-none");
    expect(container.innerHTML).toContain("motion-reduce:transition-none");
    expect(container.innerHTML).toContain("motion-reduce:[filter:none]");
  });

  it("gives each row its own filter id", () => {
    const { container } = render(
      <>
        <OtpInput />
        <OtpInput />
      </>,
    );
    const ids = [...container.querySelectorAll("filter")].map((f) => f.id);
    expect(new Set(ids).size).toBe(2);
  });

  it("is disabled as a whole", () => {
    render(<OtpInput disabled />);
    expect(field().disabled).toBe(true);
  });

  it("has no axe violations at rest, while checking and when verified", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { container } = render(<OtpInput length={4} verify={() => Promise.resolve(true)} />);
    expect((await axe(container)).violations).toEqual([]);
    fireEvent.change(field(), { target: { value: "1234" } });
    expect((await axe(container)).violations).toEqual([]);
    await flush();
    expect((await axe(container)).violations).toEqual([]);
  });
});
