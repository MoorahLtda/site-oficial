import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

const options = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
] as const;

function Harness({
  initial = "4",
  onChange,
  tone,
  size,
}: {
  initial?: string;
  onChange?: (v: string) => void;
  tone?: "light" | "plum";
  size?: "md" | "lg";
}) {
  const [value, setValue] = useState(initial);
  return (
    <SegmentedControl
      options={options}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      label="Para quantas pessoas?"
      tone={tone}
      size={size}
    />
  );
}

describe("SegmentedControl", () => {
  it("renderiza um radiogroup rotulado com radios e roving tabindex", () => {
    render(<Harness />);
    const group = screen.getByRole("radiogroup", { name: "Para quantas pessoas?" });
    expect(group).toHaveClass("inline-flex", "rounded-full");
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(4);
    expect(radios[3]).toHaveAttribute("aria-checked", "true");
    expect(radios[3]).toHaveAttribute("tabindex", "0");
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
    expect(radios[0]).toHaveAttribute("tabindex", "-1");
    for (const radio of radios) expect(radio).toHaveAttribute("type", "button");
  });

  it("troca a selecao ao clicar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: "2" }));
    expect(onChange).toHaveBeenCalledWith("2");
    expect(screen.getByRole("radio", { name: "2" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "4" })).toHaveAttribute("aria-checked", "false");
  });

  it("navega com setas, Home e End movendo selecao e foco", async () => {
    const user = userEvent.setup();
    render(<Harness initial="2" />);
    const two = screen.getByRole("radio", { name: "2" });
    two.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "3" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "3" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "1" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "1" })).toHaveFocus();
    // Da volta no inicio.
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "4" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "1" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "1" })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{End}");
    expect(screen.getByRole("radio", { name: "4" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "4" })).toHaveAttribute("aria-checked", "true");
  });

  it("tone plum e size lg aplicam as classes esperadas", () => {
    render(<Harness tone="plum" size="lg" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("border-white/15", "bg-white/10");
    const radio = screen.getByRole("radio", { name: "1" });
    expect(radio).toHaveClass("text-berry-100", "aria-checked:bg-white", "h-[52px]");
  });

  it("tone light usa ink na opcao marcada e alvo de 44 px", () => {
    render(<Harness />);
    const radio = screen.getByRole("radio", { name: "1" });
    expect(radio).toHaveClass("h-11", "min-w-11", "aria-checked:bg-ink", "aria-checked:text-white");
  });
});
