import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("is a native checkbox named by its wrapping label", () => {
    render(
      <label>
        <Checkbox /> Accept terms
      </label>,
    );
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box.tagName).toBe("INPUT");
  });

  it("toggles on click and on the label text", async () => {
    render(
      <label>
        <Checkbox /> Accept terms
      </label>,
    );
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    await userEvent.click(box);
    expect(box.checked).toBe(true);
    await userEvent.click(screen.getByText("Accept terms"));
    expect(box.checked).toBe(false);
  });

  it("toggles with Space and is reachable with Tab", async () => {
    render(<Checkbox aria-label="Terms" />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("checkbox"));
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).toHaveProperty("checked", true);
  });

  it("works controlled and reports changes", async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="Terms" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(screen.getByRole("checkbox")).toHaveProperty("checked", false);
  });

  it("supports defaultChecked and submits its value in a form", () => {
    render(
      <form data-testid="f">
        <Checkbox aria-label="Terms" defaultChecked name="t" value="yes" />
      </form>,
    );
    expect(screen.getByRole("checkbox")).toHaveProperty("checked", true);
    const data = new FormData(screen.getByTestId("f") as HTMLFormElement);
    expect(data.get("t")).toBe("yes");
  });

  it("ignores clicks when disabled", async () => {
    render(<Checkbox aria-label="Terms" disabled />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toHaveProperty("checked", false);
  });

  it("sets aria-invalid only when invalid, forwards ref and lets className win", () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox ref={ref} aria-label="T" className="rounded-full" />);
    expect(ref.current).toBe(screen.getByRole("checkbox"));
    expect(ref.current?.className).toContain("rounded-full");
    expect(ref.current?.className).not.toContain("rounded-md");
    expect(ref.current?.hasAttribute("aria-invalid")).toBe(false);
    rerender(<Checkbox ref={ref} aria-label="T" invalid />);
    expect(ref.current?.getAttribute("aria-invalid")).toBe("true");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <label>
        <Checkbox invalid /> Accept
      </label>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
