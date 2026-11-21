import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button, type ButtonProps } from "./button";

describe("Button", () => {
  it("renders a native button with its text as the accessible name", () => {
    render(<Button>Pay now</Button>);
    expect(screen.getByRole("button", { name: "Pay now" }).tagName).toBe("BUTTON");
  });

  it("defaults to type=button so it never submits a form by accident", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Cancel</Button>
      </form>,
    );
    expect(screen.getByRole("button")).toHaveProperty("type", "button");
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a form when type=submit is explicit", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Send</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("calls onClick, and not when disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is reachable by Tab and activates with Enter and Space", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is skipped by Tab when disabled", async () => {
    render(<Button disabled>Go</Button>);
    await userEvent.tab();
    expect(document.activeElement).not.toBe(screen.getByRole("button"));
  });

  it("applies variant and size classes", () => {
    const { rerender } = render(<Button variant="outline">x</Button>);
    expect(screen.getByRole("button").className).toContain("border-border");
    rerender(<Button variant="glass">x</Button>);
    expect(screen.getByRole("button").className).toContain("zuri-glass");
    rerender(<Button size="lg">x</Button>);
    expect(screen.getByRole("button").className).toContain("min-h-12");
  });

  it("supports a destructive style, icon sizes and a pill shape", () => {
    const { rerender } = render(<Button variant="destructive">x</Button>);
    expect(screen.getByRole("button").className).toContain("text-danger");
    rerender(
      <Button size="icon" aria-label="More">
        …
      </Button>,
    );
    expect(screen.getByRole("button").className).toContain("size-10");
    expect(screen.getByRole("button").className).not.toContain("rounded-lg");
    rerender(<Button shape="pill">x</Button>);
    expect(screen.getByRole("button").className).toContain("rounded-full");
    expect(screen.getByRole("button").className).not.toContain("rounded-md");
  });

  it("sizes icons placed inside it", () => {
    render(<Button>x</Button>);
    expect(screen.getByRole("button").className).toContain("[&_svg]:size-4");
  });

  describe("loading", () => {
    it("disables the button, marks it busy and shows a hidden spinner", () => {
      const { container } = render(<Button loading>Pay</Button>);
      const el = screen.getByRole("button", { name: "Pay" });
      expect(el).toHaveProperty("disabled", true);
      expect(el.getAttribute("aria-busy")).toBe("true");
      expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    });

    it("blocks clicks so a form cannot be submitted twice", async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Pay
        </Button>,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("is not busy and has no spinner by default", () => {
      const { container } = render(<Button>Pay</Button>);
      expect(screen.getByRole("button").hasAttribute("aria-busy")).toBe(false);
      expect(container.querySelector("svg")).toBeNull();
    });
  });

  it("lets className override built-in classes", () => {
    render(<Button className="px-8">x</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("px-8");
    expect(className).not.toContain("px-4");
  });

  it("spreads native props and forwards the ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} aria-label="Close" data-testid="b">
        ×
      </Button>,
    );
    expect(ref.current).toBe(screen.getByTestId("b"));
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
  });

  it("turns motion off for reduced-motion users", () => {
    render(<Button>x</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("motion-reduce:transition-none");
    expect(className).toContain("motion-reduce:active:scale-100");
  });

  it("offers the alternative styles, each with its own look", () => {
    const { rerender } = render(<Button variant="accent">x</Button>);
    const cls = () => screen.getByRole("button").className;
    expect(cls()).toContain("bg-accent");
    expect(cls()).toContain("text-accent-foreground");
    rerender(<Button variant="soft">x</Button>);
    expect(cls()).toContain("bg-muted");
    rerender(<Button variant="link">x</Button>);
    expect(cls()).toContain("underline");
    rerender(<Button variant="brutal">x</Button>);
    expect(cls()).toContain("shadow-[3px_3px_0_0_var(--foreground)]");
    expect(cls()).toContain("motion-reduce:hover:translate-x-0");
    rerender(<Button variant="wipe">x</Button>);
    expect(cls()).toContain("hover:before:scale-x-100");
    expect(cls()).toContain("motion-reduce:before:transition-none");
  });

  describe("axe", () => {
    it.each([
      "default",
      "outline",
      "ghost",
      "glass",
      "destructive",
      "accent",
      "soft",
      "link",
      "brutal",
      "wipe",
    ] as const)("has no violations (%s)", async (variant: NonNullable<ButtonProps["variant"]>) => {
      const { container } = render(<Button variant={variant}>Label</Button>);
      expect((await axe(container)).violations).toEqual([]);
    });
    it("has no violations when loading or icon-only", async () => {
      const { container } = render(
        <>
          <Button loading>Pay</Button>
          <Button size="icon" aria-label="More">
            <svg aria-hidden="true" viewBox="0 0 16 16" />
          </Button>
        </>,
      );
      expect((await axe(container)).violations).toEqual([]);
    });
    it("has no violations when disabled", async () => {
      const { container } = render(<Button disabled>Label</Button>);
      expect((await axe(container)).violations).toEqual([]);
    });
  });
});
