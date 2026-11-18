import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  countCharacters,
  defaultChecks,
  makeChecks,
  PasswordStrength,
  scorePassword,
} from "./password-strength";

describe("scorePassword", () => {
  it("is level 0 with nothing passed for an empty password", () => {
    const s = scorePassword("");
    expect(s.level).toBe(0);
    expect(s.word).toBeNull();
    expect(s.failed).toHaveLength(defaultChecks.length);
  });

  it("counts characters the way people do (an emoji is one)", () => {
    expect(countCharacters("a😀b")).toBe(3);
    expect("a😀b".length).toBe(4);
  });

  it("holds a short password at level 1 and says it is too short", () => {
    const s = scorePassword("Aa1!");
    expect(s.level).toBe(1);
    expect(s.word).toBe("tooShort");
    expect(s.tooShort).toBe(true);
  });

  it("rises with the share of checks that pass", () => {
    expect(scorePassword("abcdefghij").level).toBe(1);
    expect(scorePassword("Abcdefghij").level).toBe(2);
    expect(scorePassword("Abcdefghi1").level).toBe(3);
    expect(scorePassword("Abcdefgh1!").level).toBe(4);
    expect(scorePassword("Abcdefgh1!").word).toBe("strong");
  });

  it("caps a common password at level 1, even with a tail added", () => {
    for (const pw of ["password", "Password123", "QWERTY123", "letmein!"]) {
      const s = scorePassword(pw);
      expect(s.level, pw).toBe(1);
      expect(s.common, pw).toBe(true);
    }
    expect(scorePassword("correct horse battery").common).toBe(false);
  });

  it("does not flag a long passphrase that merely contains a common word", () => {
    expect(scorePassword("my-password-is-mine-123").common).toBe(false);
  });

  it("caps a password made of very few distinct characters at level 2", () => {
    for (const pw of ["Aaaaaaaaaaaa1!", "ababababab1!", "1111111111aA!"]) {
      expect(scorePassword(pw).level, pw).toBeLessThanOrEqual(2);
    }
    // Five distinct characters is enough to be taken at face value; varied passwords are untouched.
    expect(scorePassword("Tz9!kQ2#xr").level).toBe(4);
    expect(scorePassword("Aa1!bAa1!bAa1!b").level).toBe(4);
  });

  it("supports a custom minimum length and custom checks", () => {
    const checks = makeChecks(16);
    expect(scorePassword("Abcdefgh1!", checks).passed).not.toContain("length");
    expect(scorePassword("Abcdefgh1!Abcdefgh", checks).passed).toContain("length");
    const only = [{ id: "x", label: "has x", passes: (p: string) => p.includes("x") }];
    expect(scorePassword("xxxxxxxxxxxx", only).passed).toEqual(["x"]);
    expect(scorePassword("a", [])).toMatchObject({ level: 1 });
  });

  it("honours shortLength", () => {
    expect(scorePassword("Abcdef1!", defaultChecks, { shortLength: 12 }).tooShort).toBe(true);
    expect(scorePassword("Abcdef1!", defaultChecks, { shortLength: 6 }).tooShort).toBe(false);
  });

  it("handles unicode: non-Latin letters and symbols", () => {
    expect(scorePassword("Ñandú-Ωmega9").level).toBe(4);
  });
});

function Controlled() {
  const [v, setV] = useState("Abcdefgh1!");
  return (
    <>
      <PasswordStrength label="New password" value={v} onValueChange={setV} />
      <button type="button" onClick={() => setV("")}>
        reset
      </button>
    </>
  );
}

describe("PasswordStrength", () => {
  afterEach(() => vi.useRealTimers());

  it("labels the input and defaults to a hidden, new-password field", () => {
    render(<PasswordStrength label="New password" />);
    const input = screen.getByLabelText("New password") as HTMLInputElement;
    expect(input.type).toBe("password");
    expect(input.autocomplete).toBe("new-password");
    expect(input.getAttribute("spellcheck")).toBe("false");
  });

  it("shows and hides the text with a pressed toggle whose name does not change", async () => {
    render(<PasswordStrength label="New password" defaultValue="secret" />);
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    await userEvent.click(toggle);
    expect((screen.getByLabelText("New password") as HTMLInputElement).type).toBe("text");
    expect(screen.getByRole("button", { name: "Show password" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    await userEvent.click(toggle);
    expect((screen.getByLabelText("New password") as HTMLInputElement).type).toBe("password");
  });

  it("never submits a form when toggling", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PasswordStrength label="New password" />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("exposes the strength as a meter with a text value", async () => {
    render(<PasswordStrength label="New password" />);
    const meter = screen.getByRole("meter", { name: "Password strength" });
    expect(meter.getAttribute("aria-valuenow")).toBe("0");
    expect(meter.getAttribute("aria-valuetext")).toBe("No password yet");
    await userEvent.type(screen.getByLabelText("New password"), "Abcdefgh1!");
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("4");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("Strong");
  });

  it("lists requirements with their state in words, not only in colour", async () => {
    render(<PasswordStrength label="New password" />);
    const list = screen.getByRole("list", { name: "Password requirements" });
    expect(list.textContent).toContain("At least 10 characters, not met");
    await userEvent.type(screen.getByLabelText("New password"), "abcdefghij");
    expect(screen.getByRole("list").textContent).toContain("At least 10 characters, met");
    expect(screen.getByRole("list").textContent).toContain("A number, not met");
  });

  it("shows how many characters are still missing for the length rule", async () => {
    render(<PasswordStrength label="New password" />);
    await userEvent.type(screen.getByLabelText("New password"), "abcd");
    expect(screen.getByText("6 more")).toBeTruthy();
  });

  it("warns about a very common password", async () => {
    render(<PasswordStrength label="New password" />);
    await userEvent.type(screen.getByLabelText("New password"), "password123");
    expect(screen.getByText("This is a very common password.")).toBeTruthy();
  });

  it("works uncontrolled with defaultValue and reports changes with the score", async () => {
    const onValueChange = vi.fn();
    render(
      <PasswordStrength label="New password" defaultValue="ab" onValueChange={onValueChange} />,
    );
    await userEvent.type(screen.getByLabelText("New password"), "c");
    expect(onValueChange).toHaveBeenLastCalledWith("abc", expect.objectContaining({ level: 1 }));
  });

  it("works controlled", async () => {
    render(<Controlled />);
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("4");
    await userEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("0");
  });

  it("supports a controlled revealed state", async () => {
    const onRevealedChange = vi.fn();
    render(
      <PasswordStrength
        label="New password"
        revealed={false}
        onRevealedChange={onRevealedChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(onRevealedChange).toHaveBeenCalledWith(true);
    expect((screen.getByLabelText("New password") as HTMLInputElement).type).toBe("password");
  });

  it("links the hint, the error and the requirements to the input, and marks it invalid", () => {
    render(
      <PasswordStrength label="New password" hint="Use a phrase." error="Too weak to save." />,
    );
    const input = screen.getByLabelText("New password");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Too weak to save.");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toHaveLength(3);
    expect(screen.getByLabelText("New password", {})).toBe(input);
  });

  it("has no aria-invalid or error text without an error", () => {
    render(<PasswordStrength label="New password" />);
    expect(screen.getByLabelText("New password").hasAttribute("aria-invalid")).toBe(false);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("announces a summary once typing pauses, not on every keystroke", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<PasswordStrength label="New password" />);
    await userEvent.type(screen.getByLabelText("New password"), "Abcdefgh1!");
    expect(screen.getByRole("status").textContent).toBe("");
    await act(async () => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByRole("status").textContent).toBe(
      "Strength: Strong. 4 of 4 requirements met.",
    );
  });

  it("clears the announcement when the field is emptied", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<PasswordStrength label="New password" defaultValue="Abcdefgh1!" />);
    await act(async () => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByRole("status").textContent).not.toBe("");
    await userEvent.clear(screen.getByLabelText("New password"));
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("lets every message be translated or reworded", async () => {
    render(
      <PasswordStrength
        label="Nenosiri jipya"
        defaultValue="Abcdefgh1!"
        messages={{
          showPassword: "Onyesha nenosiri",
          meterLabel: "Nguvu ya nenosiri",
          words: { strong: "Imara" },
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Onyesha nenosiri" })).toBeTruthy();
    expect(
      screen.getByRole("meter", { name: "Nguvu ya nenosiri" }).getAttribute("aria-valuetext"),
    ).toBe("Imara");
    // Words that were not passed keep their English default.
    await userEvent.clear(screen.getByLabelText("Nenosiri jipya"));
    await userEvent.type(screen.getByLabelText("Nenosiri jipya"), "ab");
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("Too short");
  });

  it("accepts custom checks", async () => {
    render(
      <PasswordStrength
        label="PIN phrase"
        checks={[{ id: "x", label: "Contains x", passes: (p) => p.includes("x") }]}
      />,
    );
    expect(screen.getByRole("list").textContent).toContain("Contains x, not met");
    await userEvent.type(screen.getByLabelText("PIN phrase"), "xylophone");
    expect(screen.getByRole("list").textContent).toContain("Contains x, met");
  });

  it("forwards extra props to the input and className to the wrapper", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <PasswordStrength
        label="New password"
        ref={ref}
        name="password"
        required
        maxLength={64}
        className="max-w-md"
        data-x="1"
      />,
    );
    const input = screen.getByLabelText("New password") as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.name).toBe("password");
    expect(input.required).toBe(true);
    expect(input.maxLength).toBe(64);
    expect(input.getAttribute("data-x")).toBe("1");
    expect(input.closest("div.max-w-md")).toBeTruthy();
  });

  it("uses a unique id per field", () => {
    render(
      <>
        <PasswordStrength label="One" />
        <PasswordStrength label="Two" />
      </>,
    );
    expect(screen.getByLabelText("One").id).not.toBe(screen.getByLabelText("Two").id);
  });

  it("has no axe violations (empty, typed, error, revealed)", async () => {
    const { container } = render(
      <>
        <PasswordStrength label="One" />
        <PasswordStrength label="Two" defaultValue="Abcdefgh1!" revealed />
        <PasswordStrength label="Three" defaultValue="abc" error="Too weak." hint="Hint" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
