import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Select } from "./select";

const options = (
  <>
    <option value="">Choose…</option>
    <option value="tz">Tanzania</option>
    <option value="ke">Kenya</option>
  </>
);

describe("Select", () => {
  it("is a native select named by its label", () => {
    render(
      <>
        <label htmlFor="c">Country</label>
        <Select id="c">{options}</Select>
      </>,
    );
    expect(screen.getByRole("combobox", { name: "Country" }).tagName).toBe("SELECT");
  });

  it("changes value and reports it", async () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Country" onChange={onChange}>
        {options}
      </Select>,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "ke");
    expect(screen.getByRole("combobox")).toHaveProperty("value", "ke");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("supports defaultValue and disabled", async () => {
    const { rerender } = render(
      <Select aria-label="Country" defaultValue="tz">
        {options}
      </Select>,
    );
    expect(screen.getByRole("combobox")).toHaveProperty("value", "tz");
    rerender(
      <Select aria-label="Country" disabled>
        {options}
      </Select>,
    );
    expect(screen.getByRole("combobox")).toHaveProperty("disabled", true);
  });

  it("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Select aria-label="C">{options}</Select>);
    expect(screen.getByRole("combobox").hasAttribute("aria-invalid")).toBe(false);
    rerender(
      <Select aria-label="C" invalid>
        {options}
      </Select>,
    );
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} aria-label="C" name="country" size="lg" className="min-h-20">
        {options}
      </Select>,
    );
    expect(ref.current).toBe(screen.getByRole("combobox"));
    expect(ref.current?.name).toBe("country");
    expect(ref.current?.className).toContain("min-h-20");
    expect(ref.current?.className).not.toContain("min-h-12");
  });

  it("has no axe violations (default, glass, invalid)", async () => {
    for (const props of [{}, { variant: "glass" as const }, { invalid: true }]) {
      const { container, unmount } = render(
        <>
          <label htmlFor="c">Country</label>
          <Select id="c" {...props}>
            {options}
          </Select>
        </>,
      );
      expect((await axe(container)).violations).toEqual([]);
      unmount();
    }
  });
});
