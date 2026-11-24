import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Radio, RadioGroup } from "./radio-group";

function Example(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup legend="Plan" {...props}>
      <label>
        <Radio name="plan" value="free" /> Free
      </label>
      <label>
        <Radio name="plan" value="pro" /> Pro
      </label>
      <label>
        <Radio name="plan" value="team" /> Team
      </label>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("is a group named by its legend, with native radios", () => {
    render(<Example />);
    expect(screen.getByRole("group", { name: "Plan" }).tagName).toBe("FIELDSET");
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Pro" })).toBeTruthy();
  });

  it("selects one at a time", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("radio", { name: "Free" }));
    await userEvent.click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Free" })).toHaveProperty("checked", false);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", true);
  });

  it("moves selection with arrow keys and enters the group with one Tab stop", async () => {
    render(<Example />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Free" }));
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", true);
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Pro" }));
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Team" })).toHaveProperty("checked", true);
  });

  it("reports changes and supports defaultChecked", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup legend="Plan">
        <label>
          <Radio name="p" value="a" defaultChecked onChange={onChange} /> A
        </label>
        <label>
          <Radio name="p" value="b" onChange={onChange} /> B
        </label>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveProperty("checked", true);
    await userEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("disables every option through the fieldset", async () => {
    render(<Example disabled />);
    await userEvent.click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", false);
  });

  it("describes the group by its hint and error, and announces the error", () => {
    render(<Example hint="Billed monthly" error="Choose a plan" />);
    expect(screen.getByRole("alert").textContent).toBe("Choose a plan");
    const group = screen.getByRole("group", { name: "Plan" });
    expect(group.getAttribute("aria-describedby")?.split(" ")).toHaveLength(2);
    expect(screen.getByRole("group", { description: /Billed monthly/ })).toBeTruthy();
  });

  it("has no describedby without hint or error", () => {
    render(<Example />);
    expect(screen.getByRole("group").hasAttribute("aria-describedby")).toBe(false);
  });

  it("has no axe violations (with and without error)", async () => {
    const { container, unmount } = render(<Example />);
    expect((await axe(container)).violations).toEqual([]);
    unmount();
    const second = render(<Example hint="Hint" error="Error" orientation="horizontal" />);
    expect((await axe(second.container)).violations).toEqual([]);
  });
});
