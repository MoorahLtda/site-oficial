import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { differentiators, differentiatorsSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Diferenciais } from "./diferenciais";

describe("Diferenciais", () => {
  it("renderiza um h3 por diferencial, com os titulos de site.ts", () => {
    renderWithMotion(<Diferenciais />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(differentiators.length);
    expect(headings.map((h) => h.textContent)).toEqual(differentiators.map((d) => d.title));
  });

  it("mostra os indices 01 a 04 em mono e o texto de cada item", () => {
    renderWithMotion(<Diferenciais />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(differentiators.length);
    items.forEach((item, i) => {
      const index = within(item).getByText(String(i + 1).padStart(2, "0"));
      expect(index).toHaveClass("font-mono");
      expect(item).toHaveTextContent(differentiators[i].text);
    });
  });

  it("usa Section com id diferenciais rotulada pelo h2 da secao", () => {
    renderWithMotion(<Diferenciais />);
    const section = document.getElementById("diferenciais");
    expect(section?.tagName).toBe("SECTION");
    const title = screen.getByRole("heading", { level: 2, name: differentiatorsSection.title });
    expect(title).toHaveAttribute("id");
    expect(section).toHaveAttribute("aria-labelledby", title.id);
    expect(screen.getByText(differentiatorsSection.eyebrow)).toHaveClass("eyebrow");
  });

  it("cada item tem uma hairline decorativa que nasce em scaleX 0", () => {
    renderWithMotion(<Diferenciais />);
    const items = screen.getAllByRole("listitem");
    for (const item of items) {
      const wrapper = item.querySelector('span[aria-hidden="true"]');
      expect(wrapper).not.toBeNull();
      const line = wrapper?.firstElementChild as HTMLElement | null;
      expect(line).toHaveClass("origin-left", "bg-ink");
      expect(line?.style.transform).toContain("scaleX(0)");
    }
  });
});
