import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Avatar, AvatarGroup } from "./avatar";

describe("Avatar", () => {
  it("is an image named by the person", () => {
    render(<Avatar name="Asha Juma" />);
    expect(screen.getByRole("img", { name: "Asha Juma" })).toBeTruthy();
  });

  it("shows first and last initials as the fallback", () => {
    render(<Avatar name="Asha Juma Msingi" />);
    expect(screen.getByText("AM")).toBeTruthy();
  });

  it("handles a single name, extra spaces and non-Latin characters", () => {
    const { rerender } = render(<Avatar name="  Neema " />);
    expect(screen.getByText("N")).toBeTruthy();
    rerender(<Avatar name="Ángel  Ñandú" />);
    expect(screen.getByText("ÁÑ")).toBeTruthy();
    rerender(<Avatar name="" />);
    expect(screen.getByRole("img").textContent).toBe("");
  });

  it("shows the image when src is given, hidden from the accessibility tree", () => {
    const { container } = render(<Avatar name="Asha Juma" src="/a.png" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("/a.png");
    expect(img?.getAttribute("alt")).toBe("");
    expect(screen.queryByText("AJ")).toBeNull();
  });

  it("falls back to initials when the image fails to load", () => {
    const { container } = render(<Avatar name="Asha Juma" src="/missing.png" />);
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("AJ")).toBeTruthy();
  });

  it("forwards ref, spreads props and lets className win", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="A B" size="lg" className="size-20" data-x="1" />);
    expect(ref.current?.className).toContain("size-20");
    expect(ref.current?.className).not.toContain("size-14");
    expect(ref.current?.getAttribute("data-x")).toBe("1");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Avatar name="Asha Juma" />
        <Avatar name="Asha Juma" src="/a.png" />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});

describe("AvatarGroup", () => {
  const people = [
    "Asha Juma",
    "Baraka Mushi",
    "Neema Ali",
    "Juma Hassan",
    "Zawadi Omar",
    "Rehema K",
  ].map((name) => ({ name }));

  it("is a group naming how many people", () => {
    render(<AvatarGroup people={people} />);
    expect(screen.getByRole("group", { name: "6 people" })).toBeTruthy();
  });

  it("shows up to max avatars and a +N count for the rest", () => {
    render(<AvatarGroup people={people} max={3} />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByRole("img", { name: "3 more" }).textContent).toBe("+3");
  });

  it("shows no count when everyone fits", () => {
    render(<AvatarGroup people={people.slice(0, 2)} max={4} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.queryByText(/\+/)).toBeNull();
  });

  it("treats a max below 1 as 1 and accepts a custom label", () => {
    render(<AvatarGroup people={people} max={0} aria-label="Team" />);
    expect(screen.getByRole("group", { name: "Team" })).toBeTruthy();
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("copes with an empty list", () => {
    render(<AvatarGroup people={[]} />);
    expect(screen.getByRole("group", { name: "0 people" })).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(<AvatarGroup people={people} max={3} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
