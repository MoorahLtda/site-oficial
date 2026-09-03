import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mocks, specialties } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { PortalMock } from "./portal-mock";

const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => true,
    useReducedMotion: () => mockReduced(),
  };
});

describe("PortalMock", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mostra o skeleton por 900 ms e depois 3 tabs com a primeira selecionada", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<PortalMock />);
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const tablist = screen.getByRole("tablist", { name: mocks.portalTabsLabel });
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tablist).toContainElement(tabs[0]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText(mocks.reminderChip)).toBeInTheDocument();
  });

  it("com reduced motion pula o skeleton e mostra o historico", () => {
    renderWithMotion(<PortalMock />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("tabindex", "0");
    expect(panel).toHaveTextContent(specialties[0].name);
    expect(panel).toHaveTextContent(specialties[2].name);
    expect(screen.getAllByText(mocks.statusDone)).toHaveLength(2);
    expect(screen.getByText(mocks.statusScheduled)).toBeInTheDocument();
    expect(document.querySelector(".skeleton")).toBeNull();
  });

  it("clicar em Dependentes mostra os 4 titulares com os ultimos digitos", async () => {
    const user = userEvent.setup();
    renderWithMotion(<PortalMock />);
    await user.click(screen.getByRole("tab", { name: mocks.portalTabs[2] }));
    const panel = screen.getByRole("tabpanel");
    for (const holder of mocks.cardHolders) {
      expect(panel).toHaveTextContent(holder.label);
    }
    expect(panel).toHaveTextContent(mocks.cardSamples[0].slice(-4));
    expect(screen.getByRole("tab", { name: mocks.portalTabs[2] })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("ArrowRight e ArrowLeft movem a selecao e o foco (roving tabindex)", () => {
    renderWithMotion(<PortalMock />);
    const [first, second, third] = screen.getAllByRole("tab");
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(second).toHaveAttribute("aria-selected", "true");
    expect(second).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent(mocks.signed);
    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(first).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(first, { key: "End" });
    expect(third).toHaveAttribute("aria-selected", "true");
    expect(third).toHaveAttribute("aria-controls", screen.getByRole("tabpanel").id);
  });

  it("o ponto da consulta realizada mais recente pulsa em pulse-soft", () => {
    renderWithMotion(<PortalMock />);
    const dots = document.querySelectorAll("[data-status-dot]");
    expect(dots).toHaveLength(2);
    expect(dots[0]).toHaveAttribute("data-status-dot", "live");
    expect(dots[0]).toHaveClass("animate-pulse-soft", "bg-leaf-500");
    expect(dots[0]).toHaveAttribute("aria-hidden", "true");
    expect(dots[1]).not.toHaveClass("animate-pulse-soft");
  });
});
