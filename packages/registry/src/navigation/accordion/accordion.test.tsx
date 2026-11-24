import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const items = (
  <>
    <AccordionItem value="fees">
      <AccordionTrigger>What are the fees?</AccordionTrigger>
      <AccordionContent>No fees on transfers.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="limits">
      <AccordionTrigger>What are the limits?</AccordionTrigger>
      <AccordionContent>Up to TZS 5,000,000 a day.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="support" disabled>
      <AccordionTrigger>Contact support</AccordionTrigger>
      <AccordionContent>Hidden.</AccordionContent>
    </AccordionItem>
  </>
);

describe("Accordion", () => {
  it("renders each trigger as a button inside a heading, collapsed by default", () => {
    render(
      <Accordion type="single" collapsible>
        {items}
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "What are the fees?" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("heading", { name: "What are the fees?", level: 3 })).toBeTruthy();
    expect(screen.queryByText("No fees on transfers.")).toBeNull();
  });

  it("expands on click and links the trigger to its region", async () => {
    render(
      <Accordion type="single" collapsible>
        {items}
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "What are the fees?" });
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const region = await screen.findByRole("region", { name: "What are the fees?" });
    expect(region.textContent).toContain("No fees on transfers.");
  });

  it("opens with Enter and Space", async () => {
    render(
      <Accordion type="single" collapsible>
        {items}
      </Accordion>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(await screen.findByText("No fees on transfers.")).toBeTruthy();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(screen.queryByText("No fees on transfers.")).toBeNull());
  });

  it("single mode: opening one closes the other", async () => {
    render(
      <Accordion type="single" defaultValue="fees">
        {items}
      </Accordion>,
    );
    expect(screen.getByText("No fees on transfers.")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "What are the limits?" }));
    expect(await screen.findByText("Up to TZS 5,000,000 a day.")).toBeTruthy();
    await waitFor(() => expect(screen.queryByText("No fees on transfers.")).toBeNull());
  });

  it("single mode without collapsible keeps one section open", async () => {
    render(
      <Accordion type="single" defaultValue="fees">
        {items}
      </Accordion>,
    );
    await userEvent.click(screen.getByRole("button", { name: "What are the fees?" }));
    expect(screen.getByText("No fees on transfers.")).toBeTruthy();
  });

  it("multiple mode: several can be open", async () => {
    render(<Accordion type="multiple">{items}</Accordion>);
    await userEvent.click(screen.getByRole("button", { name: "What are the fees?" }));
    await userEvent.click(screen.getByRole("button", { name: "What are the limits?" }));
    expect(await screen.findByText("No fees on transfers.")).toBeTruthy();
    expect(await screen.findByText("Up to TZS 5,000,000 a day.")).toBeTruthy();
  });

  it("moves between triggers with the arrow keys, Home and End, skipping disabled", async () => {
    render(
      <Accordion type="single" collapsible>
        {items}
      </Accordion>,
    );
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "What are the fees?" }));
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "What are the limits?" }),
    );
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "What are the fees?" }));
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "What are the limits?" }),
    );
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "What are the fees?" }));
  });

  it("never opens a disabled item", async () => {
    render(
      <Accordion type="single" collapsible>
        {items}
      </Accordion>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Contact support" }));
    expect(screen.queryByText("Hidden.")).toBeNull();
  });

  it("works controlled and reports changes", async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" collapsible value="" onValueChange={onValueChange}>
        {items}
      </Accordion>,
    );
    await userEvent.click(screen.getByRole("button", { name: "What are the limits?" }));
    expect(onValueChange).toHaveBeenCalledWith("limits");
    expect(screen.queryByText("Up to TZS 5,000,000 a day.")).toBeNull();
  });

  it("supports another heading level and hides the chevron from screen readers", () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger headingLevel={4}>Q</AccordionTrigger>
          <AccordionContent>A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("heading", { level: 4 })).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses the zuri accordion keyframes with token durations", async () => {
    render(
      <Accordion type="single" defaultValue="fees">
        {items}
      </Accordion>,
    );
    const region = await screen.findByRole("region");
    expect(region.className).toContain("zuri-accordion-down");
    expect(region.className).toContain("var(--duration-base)");
  });

  it("has no axe violations (closed and open)", async () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        {items}
      </Accordion>,
    );
    expect((await axe(container)).violations).toEqual([]);
    await userEvent.click(screen.getByRole("button", { name: "What are the fees?" }));
    await screen.findByRole("region");
    expect((await axe(container)).violations).toEqual([]);
  });
});
