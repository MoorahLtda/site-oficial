"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatBRL, plans, site, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

// Enquanto qualquer um destes blocos estiver em vista, a barra fica desmontada:
// o hero ja mostra o preco, planos e contato ja sao o destino, e o footer nao pode ser coberto.
const HIDE_WHEN_VISIBLE = ["#inicio", "#planos", "#contato", "footer"] as const;

interface MobileCtaBarProps {
  // Forca a barra montada, independente do scroll. Apenas para testes.
  forceVisible?: boolean;
}

// Observa as ancoras e devolve true quando nenhuma delas esta em vista.
// Secoes carregadas com next/dynamic podem entrar no DOM depois do mount; um MutationObserver
// completa a lista e se desliga assim que todos os alvos existem.
function useHiddenNearAnchors(enabled: boolean): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const inView = new Map<Element, boolean>();
    const observed = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          inView.set(entry.target, entry.isIntersecting);
        }
        setVisible(!Array.from(inView.values()).some(Boolean));
      },
      { threshold: 0.05 },
    );

    const attach = (): boolean => {
      for (const selector of HIDE_WHEN_VISIBLE) {
        const el = document.querySelector(selector);
        if (el && !observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      }
      return observed.size === HIDE_WHEN_VISIBLE.length;
    };

    let mo: MutationObserver | undefined;
    if (!attach()) {
      mo = new MutationObserver(() => {
        if (attach()) mo?.disconnect();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      io.disconnect();
      mo?.disconnect();
    };
  }, [enabled]);

  return visible;
}

export function MobileCtaBar({ forceVisible = false }: MobileCtaBarProps) {
  const autoVisible = useHiddenNearAnchors(!forceVisible);
  const shown = forceVisible || autoVisible;
  const whatsapp = site.contact.whatsapp;

  return (
    <AnimatePresence>
      {shown ? (
        <m.div
          key="cta-mobile"
          data-testid="cta-mobile"
          role="region"
          aria-label={ui.mobileBar.label}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          <m.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE, delay: 0.1 }}
            className="min-w-0 font-mono text-xs leading-tight text-gray-700"
          >
            <span className="sr-only">Planos: </span>
            {plans.map((plan) => (
              <span key={plan.id} className="block py-px">
                {plan.name}{" "}
                <span className="font-semibold text-gray-900 tabular-nums">
                  {formatBRL(plan.priceCents)}
                </span>
              </span>
            ))}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE, delay: 0.16 }}
            className="flex shrink-0 items-center gap-2"
          >
            <Button size="sm" asChild className="h-11">
              <a href="#planos">{ui.mobileBar.cta}</a>
            </Button>
            {whatsapp ? (
              <Button variant="secondary" size="sm" asChild className="h-11 w-11 px-0">
                <a
                  href={whatsappUrl(whatsapp, ui.leadForm.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ui.leadForm.whatsappCta}
                >
                  <MessageCircle size={18} aria-hidden="true" className="text-leaf-600" />
                </a>
              </Button>
            ) : null}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
