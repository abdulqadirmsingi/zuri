import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Picker, type PickerOption } from "./picker";

const fruit: PickerOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", disabled: true },
  { value: "date", label: "Date" },
];
const many: PickerOption[] = Array.from({ length: 12 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i}`,
  group: i < 6 ? "First" : "Second",
  keywords: i === 3 ? ["special"] : undefined,
}));

const open = async () => {
  await userEvent.click(screen.getByRole("combobox"));
  return screen.findByRole("listbox");
};

function Controlled() {
  const [v, setV] = useState("apple");
  return <Picker options={fruit} value={v} onValueChange={setV} />;
}

describe("Picker", () => {
  it("is a button with the combobox role that shows the placeholder", () => {
    render(<Picker options={fruit} placeholder="Pick a fruit" />);
    const t = screen.getByRole("combobox");
    expect(t.tagName).toBe("BUTTON");
    expect(t.textContent).toContain("Pick a fruit");
    expect(t.getAttribute("aria-expanded")).toBe("false");
    expect(t.getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("opens a listbox of options and marks the chosen one", async () => {
    render(<Picker options={fruit} defaultValue="banana" />);
    const list = await open();
    expect(within(list).getAllByRole("option")).toHaveLength(4);
    expect(within(list).getByRole("option", { name: "Banana" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
  });

  it("chooses with a click, closes, and shows the choice", async () => {
    const onValueChange = vi.fn();
    render(<Picker options={fruit} onValueChange={onValueChange} />);
    await open();
    await userEvent.click(screen.getByRole("option", { name: "Date" }));
    expect(onValueChange).toHaveBeenCalledWith("date");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(screen.getByRole("combobox").textContent).toContain("Date");
  });

  it("does not let a disabled option be chosen", async () => {
    const onValueChange = vi.fn();
    render(<Picker options={fruit} onValueChange={onValueChange} />);
    await open();
    expect(screen.getByRole("option", { name: "Cherry" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
    await userEvent.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("moves with the arrow keys, skipping disabled options, and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    render(<Picker options={fruit} defaultValue="apple" onValueChange={onValueChange} />);
    await open();
    await userEvent.keyboard("{ArrowDown}"); // banana
    await userEvent.keyboard("{ArrowDown}"); // skips cherry, lands on date
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("date");
  });

  it("jumps to a match by typing, when there is no search box", async () => {
    const onValueChange = vi.fn();
    render(<Picker options={fruit} onValueChange={onValueChange} />);
    await open();
    await userEvent.keyboard("d{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("date");
  });

  it("closes on Escape and returns focus to the button", async () => {
    render(<Picker options={fruit} />);
    const t = screen.getByRole("combobox");
    await userEvent.click(t);
    await screen.findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(document.activeElement).toBe(t);
  });

  it("is controlled when given a value", async () => {
    render(<Controlled />);
    await open();
    await userEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(screen.getByRole("combobox").textContent).toContain("Banana");
  });

  it("shows a search box from 8 options, filters by label and keyword, and says when nothing matches", async () => {
    render(<Picker options={many} />);
    await open();
    const search = screen.getByRole("combobox", { name: "Search", expanded: true });
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(12);
    await userEvent.type(search, "Item 1");
    expect(within(screen.getByRole("listbox")).getAllByRole("option").length).toBe(3); // Item 1, 10 and 11
  });

  it("matches keywords", async () => {
    render(<Picker options={many} />);
    await open();
    await userEvent.type(
      screen.getByRole("combobox", { name: "Search", expanded: true }),
      "special",
    );
    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]?.textContent).toBe("Item 3");
  });

  it("reports an empty search", async () => {
    render(<Picker options={many} emptyText="Nothing here" />);
    await open();
    await userEvent.type(screen.getByRole("combobox", { name: "Search", expanded: true }), "zzz");
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });

  it("can force the search box on or off", async () => {
    const { unmount } = render(<Picker options={fruit} searchable />);
    await open();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    unmount();
    render(<Picker options={many} searchable={false} />);
    await open();
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
  });

  it("lists options under group headings", async () => {
    render(<Picker options={many} />);
    await open();
    expect(screen.getByText("First")).toBeTruthy();
    expect(screen.getByText("Second")).toBeTruthy();
  });

  it("submits its value with a form", async () => {
    const { container } = render(
      <form>
        <Picker options={fruit} name="fruit" defaultValue="apple" />
      </form>,
    );
    const input = container.querySelector<HTMLInputElement>("input[type=hidden][name=fruit]");
    expect(input?.value).toBe("apple");
  });

  it("is named by a label and can be disabled or invalid", () => {
    render(
      <>
        <label htmlFor="f">Fruit</label>
        <Picker id="f" options={fruit} invalid disabled />
      </>,
    );
    const t = screen.getByRole("combobox", { name: /Fruit/ });
    expect(t.getAttribute("aria-invalid")).toBe("true");
    expect((t as HTMLButtonElement).disabled).toBe(true);
  });

  it("forwards ref and className to the button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Picker ref={ref} options={fruit} className="extra" />);
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations, closed or open", async () => {
    const { container } = render(
      <>
        <label htmlFor="g">Fruit</label>
        <Picker id="g" options={fruit} />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
    await userEvent.click(screen.getByRole("combobox"));
    const list = await screen.findByRole("listbox");
    expect((await axe(list.parentElement as HTMLElement)).violations).toEqual([]);
  });
});
