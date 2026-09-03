import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionSkeleton } from "./section-skeleton";

describe("SectionSkeleton", () => {
  it("e aria-hidden e desenha blocos skeleton", () => {
    const { container } = render(<SectionSkeleton />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("container-x", "py-20");
    const blocks = root?.querySelectorAll(".skeleton") ?? [];
    expect(blocks.length).toBe(5);
    expect(root?.querySelector(".md\\:grid-cols-3")?.childElementCount).toBe(3);
  });

  it("reserva altura com minHeight e mescla className", () => {
    const { container } = render(
      <SectionSkeleton minHeight="min-h-[640px]" className="bg-gray-50" />,
    );
    expect(container.firstElementChild).toHaveClass("min-h-[640px]", "bg-gray-50");
  });
});
