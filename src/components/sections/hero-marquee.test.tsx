import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { heroDynamic, specialties } from "@/content/site";
import { HeroMarquee } from "./hero-marquee";

describe("HeroMarquee", () => {
  it("e um grupo rotulado com os 12 nomes de especialidade, uma vez para leitores de tela", () => {
    render(<HeroMarquee />);
    const strip = screen.getByRole("group", { name: heroDynamic.stripLabel });
    expect(specialties).toHaveLength(12);
    for (const specialty of specialties) {
      // O Marquee duplica a faixa; a copia e aria-hidden.
      expect(screen.getAllByText(specialty.name)).toHaveLength(2);
      expect(strip).toHaveTextContent(specialty.name);
    }
    const clone = strip.querySelector('div[aria-hidden="true"]');
    expect(clone).toHaveTextContent(specialties[0].name);
  });

  it("chips neutros com icone decorativo e pausa no hover, estatico sob reduced motion", () => {
    render(<HeroMarquee className="mt-4" />);
    const chip = screen.getAllByText(specialties[0].name)[0];
    expect(chip).toHaveClass("bg-gray-100", "text-gray-700", "rounded-full");
    const icon = chip.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");

    // Estrutura do Marquee: faixa animada > copia > chip.
    const track = chip.parentElement?.parentElement;
    expect(track).toHaveClass("animate-marquee", "motion-reduce:animate-none");
    expect(track).toHaveClass("group-hover:[animation-play-state:paused]");
    expect(screen.getByRole("group", { name: heroDynamic.stripLabel })).toHaveClass("mt-4");
  });

  it("tone plum e speed: chips translucidos, icone berry-300 e ciclo de 64 s", () => {
    render(<HeroMarquee tone="plum" speed={64} />);
    const chip = screen.getAllByText(specialties[0].name)[0];
    expect(chip).toHaveClass("bg-white/10", "text-berry-100");
    expect(chip).not.toHaveClass("bg-gray-100");
    const icon = chip.querySelector("svg");
    expect(icon).toHaveClass("text-berry-300");
    const track = chip.parentElement?.parentElement as HTMLElement | null;
    expect(track).toHaveClass("animate-marquee");
    expect(track?.style.animationDuration).toBe("64s");
    expect(screen.getByRole("group", { name: heroDynamic.stripLabel })).toBeInTheDocument();
  });
});
