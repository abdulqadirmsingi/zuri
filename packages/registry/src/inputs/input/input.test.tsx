import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "./input";

describe("Input", () => {
  it("renders a native text input named by its label", () => {
    render(
      <>
        <label htmlFor="n">Name</label>
        <Input id="n" />
      </>,
    );
    const el = screen.getByRole("textbox", { name: "Name" });
    expect(el.tagName).toBe("INPUT");
    expect(el).toHaveProperty("type", "text");
  });

  it("accepts typing and reports changes", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "Asha");
    expect(screen.getByRole("textbox")).toHaveProperty("value", "Asha");
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox").hasAttribute("aria-invalid")).toBe(false);
    rerender(<Input aria-label="Name" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("can be disabled and is skipped by typing", async () => {
    render(<Input aria-label="Name" disabled />);
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(screen.getByRole("textbox")).toHaveProperty("value", "");
  });

  it("supports other types, size and className override, ref and spread props", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Input
        ref={ref}
        aria-label="Email"
        type="email"
        size="lg"
        name="email"
        className="min-h-20"
        data-x="1"
      />,
    );
    const el = screen.getByLabelText("Email");
    expect(ref.current).toBe(el);
    expect(el).toHaveProperty("type", "email");
    expect(el.getAttribute("name")).toBe("email");
    expect(el.getAttribute("data-x")).toBe("1");
    expect(el.className).toContain("min-h-20");
    expect(el.className).not.toContain("min-h-12");
  });

  it("has no axe violations (default, glass, invalid)", async () => {
    for (const props of [{}, { variant: "glass" as const }, { invalid: true }]) {
      const { container, unmount } = render(
        <>
          <label htmlFor="a">Label</label>
          <Input id="a" {...props} />
        </>,
      );
      expect((await axe(container)).violations).toEqual([]);
      unmount();
    }
  });

  it("offers soft and underline looks", () => {
    const { rerender } = render(<Input aria-label="x" variant="soft" />);
    const cls = () => screen.getByRole("textbox").className;
    expect(cls()).toContain("bg-muted");
    expect(cls()).toContain("border-transparent");
    rerender(<Input aria-label="x" variant="underline" />);
    expect(cls()).toContain("border-b");
    expect(cls()).toContain("rounded-none");
    expect(cls()).toContain("px-0");
    expect(cls()).not.toContain("rounded-md");
  });

  it("marks focus with a single border and halo, not an offset black outline", () => {
    render(<Input aria-label="x" />);
    const cls = screen.getByRole("textbox").className;
    expect(cls).toContain("focus-visible:border-ring");
    expect(cls).toContain("focus-visible:outline-none");
    expect(cls).not.toContain("outline-offset");
    expect(cls).not.toContain("focus-visible:outline-2");
  });
});
