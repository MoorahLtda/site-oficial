import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MotionProvider } from "@/components/providers/motion-provider";

/*
  Renderiza componentes cliente dentro do MotionProvider (LazyMotion strict + MotionConfig),
  como acontece na pagina real. Componentes server puros podem usar `render` direto.

  Para testar o estado "em vista" (o IntersectionObserver de tests/setup.ts nunca dispara):

    vi.mock("motion/react", async (importOriginal) => {
      const actual = await importOriginal<typeof import("motion/react")>();
      return { ...actual, useInView: () => true, useReducedMotion: () => true };
    });

  Com useReducedMotion true os componentes renderizam o estado final sem timers. Para testar
  timers, deixe useReducedMotion false e use vi.useFakeTimers() + act(() => vi.advanceTimersByTime(ms)).
*/
export function renderWithMotion(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult {
  return render(ui, { wrapper: MotionProvider, ...options });
}
