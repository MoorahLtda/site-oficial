"use client";

import { useEffect } from "react";

/*
  Ancora de entrada (moorah.com.br/#planos, /#duvidas, sumario das paginas legais).

  Por que existe: quando a pagina abre direto com hash, o navegador rola uma unica vez, cedo.
  Depois disso duas coisas movem o destino: as secoes abaixo da dobra entram por next/dynamic e o
  App Router reposiciona a rolagem ao terminar a hidratacao. Sem isso o visitante que recebe um
  link com ancora cai no meio do nada (medido: caia em scrollY 0 com o alvo a 10.000 px).

  Como funciona: reafirma o destino a cada quadro durante RETRY_MS, porque so reagir a uma mudanca
  de altura nao basta (a reposicao do router acontece depois de o layout estabilizar). Chamar
  scrollIntoView com o alvo ja no lugar nao produz movimento, entao nao ha tremor. Para na primeira
  interacao do usuario, para nunca disputar a rolagem com ele. scrollIntoView respeita o
  scroll-margin-top das secoes, que compensa o header fixo.
*/

const RETRY_MS = 2000;

// Qualquer sinal de que o usuario assumiu a rolagem encerra o reposicionamento.
const USER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

export function HashScroll() {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;

    let id: string;
    try {
      id = decodeURIComponent(raw);
    } catch {
      id = raw;
    }
    if (!id) return;

    let raf = 0;
    let cancelled = false;
    const started = performance.now();

    const stop = () => {
      if (cancelled) return;
      cancelled = true;
      cancelAnimationFrame(raf);
      for (const event of USER_EVENTS) window.removeEventListener(event, stop);
    };

    const tick = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "auto" });
      if (performance.now() - started > RETRY_MS) {
        stop();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    for (const event of USER_EVENTS) window.addEventListener(event, stop, { passive: true });
    raf = requestAnimationFrame(tick);
    return stop;
  }, []);

  return null;
}
