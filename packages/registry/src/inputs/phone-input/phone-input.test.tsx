import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PhoneInput } from "./phone-input";

const number = () => screen.getByRole("textbox") as HTMLInputElement;
const countryButton = () => screen.getByRole("combobox", { name: /^Country/ });

function Controlled() {
  const [v, setV] = useState("+255712345678");
  return (
    <>
      <PhoneInput aria-label="Phone" value={v} onValueChange={setV} />
      <button type="button" onClick={() => setV("+254799000111")}>
        Reset
      </button>
      <output>{v}</output>
    </>
  );
}

function ControlledEmpty() {
  const [v, setV] = useState("");
  return <PhoneInput aria-label="Phone" value={v} onValueChange={setV} />;
}

describe("PhoneInput", () => {
  it("starts on Tanzania with the +255 code on the country button", () => {
    render(<PhoneInput aria-label="Phone number" />);
    expect(countryButton().textContent).toContain("+255");
    expect(countryButton().getAttribute("aria-label")).toBe("Country: +255, Tanzania");
    expect(screen.getByRole("textbox", { name: "Phone number" })).toBeTruthy();
  });

  it("is a phone field for browsers and phones", () => {
    render(<PhoneInput aria-label="Phone number" />);
    expect(number().type).toBe("tel");
    expect(number().getAttribute("inputmode")).toBe("tel");
    expect(number().getAttribute("autocomplete")).toBe("tel-national");
  });

  it("shows digits grouped and reports E.164 with details", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput aria-label="Phone" onValueChange={onValueChange} />);
    await userEvent.type(number(), "712345678");
    expect(number().value).toBe("712 345 678");
    expect(onValueChange).toHaveBeenLastCalledWith("+255712345678", {
      country: "TZ",
      national: "712345678",
      valid: true,
    });
  });

  it("ignores letters, and drops a leading zero from the E.164 value but not the screen", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput aria-label="Phone" onValueChange={onValueChange} />);
    await userEvent.type(number(), "0a712");
    expect(number().value).toBe("071 2");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+255712",
      expect.objectContaining({ valid: false }),
    );
  });

  it("stops at 15 digits in total", async () => {
    render(<PhoneInput aria-label="Phone" />);
    await userEvent.type(number(), "1234567890123456789");
    // 3 for the country code, so 12 national digits plus an allowed leading zero is the most.
    expect(number().value.replace(/\D/g, "").length).toBeLessThanOrEqual(13);
  });

  it("switches country from the list, searchable by name or code", async () => {
    const onValueChange = vi.fn();
    render(
      <PhoneInput aria-label="Phone" defaultValue="+255712345678" onValueChange={onValueChange} />,
    );
    await userEvent.click(countryButton());
    await userEvent.type(screen.getByRole("combobox", { name: "Search countries" }), "254");
    await userEvent.click(await screen.findByRole("option", { name: /Kenya/ }));
    expect(countryButton().textContent).toContain("+254");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+254712345678",
      expect.objectContaining({ country: "KE" }),
    );
    expect(number().value).toBe("712 345 678");
  });

  it("lists each country once, with the common ones first", async () => {
    render(<PhoneInput aria-label="Phone" />);
    await userEvent.click(countryButton());
    const names = screen.getAllByRole("option").map((o) => o.textContent ?? "");
    expect(names.length).toBe(new Set(names).size);
    expect(names[0]).toContain("Tanzania");
    expect(names[1]).toContain("Kenya");
  });

  it("reads a pasted international number and switches the country", () => {
    const onValueChange = vi.fn();
    render(<PhoneInput aria-label="Phone" onValueChange={onValueChange} />);
    fireEvent.paste(number(), { clipboardData: { getData: () => "+254 712 345 678" } });
    expect(countryButton().textContent).toContain("+254");
    expect(number().value).toBe("712 345 678");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+254712345678",
      expect.objectContaining({ country: "KE" }),
    );
    fireEvent.paste(number(), { clipboardData: { getData: () => "00255 755 123 456" } });
    expect(countryButton().textContent).toContain("+255");
    expect(number().value).toBe("755 123 456");
  });

  it("leaves an ordinary pasted number to the normal path", async () => {
    render(<PhoneInput aria-label="Phone" />);
    number().focus();
    await userEvent.paste("0712 345 678");
    expect(number().value).toBe("071 234 567 8");
  });

  it("works controlled, and follows an outside change", async () => {
    render(<Controlled />);
    expect(number().value).toBe("712 345 678");
    await userEvent.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => expect(number().value).toBe("799 000 111"));
    expect(countryButton().textContent).toContain("+254");
  });

  it("keeps a typed leading zero on screen when controlled", async () => {
    render(<ControlledEmpty />);
    await userEvent.type(number(), "0");
    expect(number().value).toBe("0");
  });

  it("submits the E.164 number under name, and not the visible text", () => {
    const { container } = render(
      <form>
        <PhoneInput aria-label="Phone" name="phone" defaultValue="+255712345678" />
      </form>,
    );
    const hidden = container.querySelector(
      'input[type="hidden"][name="phone"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe("+255712345678");
    expect(number().getAttribute("name")).toBeNull();
  });

  it("offers joined, split and chip layouts", () => {
    const { container, rerender } = render(<PhoneInput aria-label="Phone" />);
    expect(container.querySelector("[class*='has-[input:focus-visible']")).toBeTruthy();
    rerender(<PhoneInput aria-label="Phone" layout="split" />);
    expect(container.firstElementChild?.className).toContain("flex");
    expect(container.querySelector("[class*='has-[input:focus-visible']")).toBeNull();
    rerender(<PhoneInput aria-label="Phone" layout="chip" />);
    expect(countryButton().textContent?.trim()).toBe("+255");
    expect(countryButton().className).toContain("bg-accent");
  });

  it("fixed has no dropdown: the code is plain text and the country cannot change", () => {
    const onValueChange = vi.fn();
    render(
      <PhoneInput
        aria-label="Phone"
        layout="fixed"
        defaultCountry="KE"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.getByText("+254")).toBeTruthy();
    fireEvent.change(number(), { target: { value: "712345678" } });
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+254712345678",
      expect.objectContaining({ country: "KE" }),
    );
  });

  it("fixed reads a pasted number for its own country, and leaves another country's alone", () => {
    render(<PhoneInput aria-label="Phone" layout="fixed" />);
    fireEvent.paste(number(), { clipboardData: { getData: () => "+255 712 345 678" } });
    expect(number().value).toBe("712 345 678");
    const other = fireEvent.paste(number(), {
      clipboardData: { getData: () => "+254 799 000 111" },
    });
    // Not handled here, so the browser's own paste would run.
    expect(other).toBe(true);
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  it("plain is only the number field, and still reports E.164 for the default country", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <PhoneInput
        aria-label="Phone"
        layout="plain"
        className="extra"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(container.querySelectorAll("input")).toHaveLength(1);
    expect(number().className).toContain("extra");
    await userEvent.type(number(), "712345678");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+255712345678",
      expect.objectContaining({ valid: true }),
    );
  });

  it("draws the flag as an emoji by default, hidden from assistive technology", async () => {
    render(<PhoneInput aria-label="Phone" />);
    const flag = countryButton().querySelector("[aria-hidden='true']") as HTMLElement;
    expect(flag.textContent).toBe("\u{1F1F9}\u{1F1FF}");
    await userEvent.click(countryButton());
    expect(screen.getByRole("option", { name: /Kenya/ }).textContent).toContain(
      "\u{1F1F0}\u{1F1EA}",
    );
  });

  it("can show the two-letter code tile instead, and says so in the name", () => {
    render(<PhoneInput aria-label="Phone" flags="code" />);
    expect(countryButton().textContent).toContain("TZ");
    expect(countryButton().getAttribute("aria-label")).toBe("Country: TZ +255, Tanzania");
  });

  it("draws a supplied flag instead of the letters", () => {
    render(<PhoneInput aria-label="Phone" renderFlag={(iso) => <i data-testid="flag">{iso}</i>} />);
    expect(screen.getByTestId("flag").textContent).toBe("TZ");
  });

  it("shows the country name when asked", () => {
    render(<PhoneInput aria-label="Phone" showName />);
    expect(countryButton().textContent).toContain("Tanzania");
  });

  it("marks invalid and disables both parts", () => {
    render(<PhoneInput aria-label="Phone" invalid disabled />);
    expect(number().getAttribute("aria-invalid")).toBe("true");
    expect(number().disabled).toBe(true);
    expect((countryButton() as HTMLButtonElement).disabled).toBe(true);
  });

  it("forwards the ref to the number field and merges className", () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<PhoneInput aria-label="Phone" ref={ref} className="extra" />);
    expect(ref.current).toBe(number());
    expect((container.firstElementChild as HTMLElement).className).toContain("extra");
  });

  it("works with a custom list and falls back to its first country", () => {
    render(
      <PhoneInput
        aria-label="Phone"
        defaultCountry="XX"
        countries={[{ iso: "RW", name: "Rwanda", dial: "250" }]}
        preferred={[]}
      />,
    );
    expect(countryButton().textContent).toContain("+250");
  });

  it("has no axe violations in any layout", async () => {
    for (const layout of ["joined", "split", "chip"] as const) {
      const { container, unmount } = render(
        <label>
          Phone
          <PhoneInput layout={layout} />
        </label>,
      );
      expect((await axe(container)).violations, layout).toEqual([]);
      unmount();
    }
  });

  it("passes halo={false} to every layout", () => {
    const { container, rerender } = render(<PhoneInput aria-label="Phone" halo={false} />);
    expect((container.firstElementChild as HTMLElement).className).not.toContain("ring-4");
    rerender(<PhoneInput aria-label="Phone" layout="split" halo={false} />);
    expect(number().className).not.toContain("ring-4");
    rerender(<PhoneInput aria-label="Phone" layout="plain" halo={false} />);
    expect(number().className).not.toContain("ring-4");
  });
});
