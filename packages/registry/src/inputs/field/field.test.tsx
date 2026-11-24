import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "../input/input";
import { Field } from "./field";

describe("Field", () => {
  it("labels the control", () => {
    render(<Field label="Email">{(p) => <Input {...p} />}</Field>);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeTruthy();
  });

  it("describes the control by its hint", () => {
    render(
      <Field label="Email" hint="We never share it">
        {(p) => <Input {...p} />}
      </Field>,
    );
    expect(screen.getByRole("textbox", { description: "We never share it" })).toBeTruthy();
  });

  it("marks the control invalid and announces the error", () => {
    render(
      <Field label="Email" hint="Hint" error="Enter a valid email">
        {(p) => <Input {...p} />}
      </Field>,
    );
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Enter a valid email");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toHaveLength(2);
    expect(screen.getByRole("textbox", { description: /Enter a valid email/ })).toBeTruthy();
  });

  it("has no aria-invalid or describedby when there is no hint or error", () => {
    render(<Field label="Email">{(p) => <Input {...p} />}</Field>);
    const input = screen.getByRole("textbox");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });

  it("passes required to the control and hides the asterisk from screen readers", () => {
    render(
      <Field label="Email" required>
        {(p) => <Input {...p} />}
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveProperty("required", true);
  });

  it("uses a unique id per field", () => {
    render(
      <>
        <Field label="A">{(p) => <Input {...p} />}</Field>
        <Field label="B">{(p) => <Input {...p} />}</Field>
      </>,
    );
    const [a, b] = screen.getAllByRole("textbox");
    expect(a?.id).toBeTruthy();
    expect(a?.id).not.toBe(b?.id);
  });

  it("has no axe violations, including the error state", async () => {
    const { container } = render(
      <Field label="Email" hint="Hint" error="Bad" required>
        {(p) => <Input {...p} />}
      </Field>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
