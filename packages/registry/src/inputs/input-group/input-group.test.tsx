import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "@/components/ui/input";
import { InputGroup } from "./input-group";

describe("InputGroup", () => {
  it("keeps the input named by its own label, with both ends shown", () => {
    render(
      <InputGroup start={<span>+255</span>} end={<span>TZS</span>}>
        <Input aria-label="Amount" />
      </InputGroup>,
    );
    expect(screen.getByRole("textbox", { name: "Amount" })).toBeTruthy();
    expect(screen.getByText("+255")).toBeTruthy();
    expect(screen.getByText("TZS")).toBeTruthy();
  });

  it("draws the surface on the group and strips it from the input", () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Amount" />
      </InputGroup>,
    );
    const group = container.firstElementChild as HTMLElement;
    expect(group.className).toContain("border");
    expect(group.className).toContain("[&_input]:border-0");
    // The input inside must not draw its own focus halo, or there would be two borders.
    expect(group.className).toContain("[&_input]:focus-visible:ring-0");
    expect(group.className).toContain(
      "has-[input:focus-visible:not([aria-invalid=true])]:border-ring",
    );
    expect(group.className).not.toContain("outline-2");
  });

  it("shows the danger border when the input inside is invalid", () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Amount" invalid />
      </InputGroup>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "has-[[aria-invalid=true]]:border-danger",
    );
  });

  it("applies variant and size, and merges className and the ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <InputGroup ref={ref} variant="soft" size="lg" className="extra" data-x="1">
        <Input aria-label="Amount" />
      </InputGroup>,
    );
    expect(ref.current?.className).toContain("bg-muted");
    expect(ref.current?.className).toContain("min-h-12");
    expect(ref.current?.className).toContain("extra");
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });

  it("lets a button at the end be reached and used", async () => {
    let pressed = 0;
    render(
      <InputGroup
        end={
          <button type="button" aria-label="Clear" onClick={() => pressed++}>
            x
          </button>
        }
      >
        <Input aria-label="Search" />
      </InputGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(pressed).toBe(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <InputGroup start={<svg aria-hidden="true" viewBox="0 0 16 16" />} end={<span>TZS</span>}>
        <Input aria-label="Amount" />
      </InputGroup>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("dims the whole group when its input is disabled", () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Amount" disabled />
      </InputGroup>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "has-[input:disabled]:opacity-50",
    );
  });
});
