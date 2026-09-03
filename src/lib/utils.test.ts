import { describe, expect, it } from "vitest";
import { cn, whatsappUrl } from "./utils";

describe("cn", () => {
  it("mescla classes e resolve conflitos do Tailwind", () => {
    expect(cn("px-2", "px-4", false && "hidden", "text-white")).toBe("px-4 text-white");
  });
});

describe("whatsappUrl", () => {
  it("usa so os digitos do numero e codifica o texto", () => {
    expect(whatsappUrl("+55 (11) 99999-1234", "Olá, quero saber mais")).toBe(
      "https://wa.me/5511999991234?text=Ol%C3%A1%2C%20quero%20saber%20mais",
    );
  });
});
