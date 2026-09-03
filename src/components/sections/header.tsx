"use client";

import { Menu } from "lucide-react";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { nav, site, ui } from "@/content/site";
import { cn } from "@/lib/utils";

type NavId = (typeof nav)[number]["id"];

// Id do hero (5.3). Quando ele ocupa a faixa de leitura, nenhum link fica ativo.
const HERO_ID = "inicio";
// Faixa estreita no meio da viewport: a secao que a cruza e a que o leitor esta lendo.
const SPY_ROOT_MARGIN = "-45% 0px -50% 0px";
// Metade da largura do indicador (h-1.5 w-1.5 = 6 px).
const DOT_HALF = 3;

const navIds: ReadonlySet<string> = new Set(nav.map((item) => item.id));

function isNavId(id: string): id is NavId {
  return navIds.has(id);
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<NavId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const linkRefs = useRef(new Map<NavId, HTMLAnchorElement>());
  const hadActive = useRef(false);
  const reducedMotion = useReducedMotion();

  // Unico useScroll fora do hero: so decide se a barra ganha fundo.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));
  useEffect(() => {
    // Carregamento com hash (/#planos) ja comeca rolado; o evento "change" nao dispara.
    setScrolled(window.scrollY > 24);
  }, []);

  // Indicador de no: spring fisico entre os centros dos links.
  const x = useSpring(0, { stiffness: 180, damping: 26 });

  const positionIndicator = useCallback(
    (instant: boolean) => {
      if (!activeId) return;
      const link = linkRefs.current.get(activeId);
      if (!link) return;
      const target = link.offsetLeft + link.offsetWidth / 2 - DOT_HALF;
      if (instant || reducedMotion) {
        x.jump(target);
      } else {
        x.set(target);
      }
    },
    [activeId, reducedMotion, x],
  );

  useEffect(() => {
    if (activeId) {
      // Saindo do estado sem link ativo, o no aparece no lugar (fade) em vez de deslizar do zero.
      positionIndicator(!hadActive.current);
      hadActive.current = true;
    } else {
      hadActive.current = false;
    }
  }, [activeId, positionIndicator]);

  useEffect(() => {
    const onResize = () => positionIndicator(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionIndicator]);

  // Scroll spy: o ultimo id a cruzar a faixa vira ativo; ids ausentes sao ignorados.
  useEffect(() => {
    const targets = [...nav.map((item) => item.id), HERO_ID]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActiveId(isNavId(id) ? id : null);
        }
      },
      { rootMargin: SPY_ROOT_MARGIN },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const setLinkRef = (id: NavId) => (element: HTMLAnchorElement | null) => {
    if (element) {
      linkRefs.current.set(id, element);
    } else {
      linkRefs.current.delete(id);
    }
  };

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-250 ease-out-expo",
        scrolled
          ? "border-b border-gray-200 bg-white/95 shadow-card backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-bold focus:text-gray-900 focus:shadow-float"
      >
        {ui.header.skip}
      </a>

      <Container className="flex h-16 items-center justify-between lg:h-[72px]">
        {/*
          Lockup horizontal (brief v2, item 2): simbolo + palavra, ambos plum, dentro do unico
          link para a home. As duas imagens tem alt vazio porque o nome acessivel esta no link.
          Sempre `w-auto` para nao distorcer o simbolo (regra do manual). `priority` nas duas
          (o brief libera priority para o lockup do header): o lockup e uma peca unica, e deixar
          a palavra em lazy faria a marca aparecer em duas etapas na primeira pintura.
        */}
        <Link
          href="/"
          aria-label={`${site.name}, página inicial`}
          className="flex h-11 shrink-0 items-center gap-2.5 rounded-full"
        >
          <Image
            src="/brand/moorah-mark.png"
            alt=""
            width={194}
            height={265}
            priority
            className="h-6 w-auto sm:h-7 lg:h-8"
          />
          <Image
            src="/brand/moorah-wordmark.png"
            alt=""
            width={518}
            height={82}
            priority
            className="h-3.5 w-auto sm:h-4 lg:h-[21px]"
          />
        </Link>

        <nav aria-label="Principal" className="relative hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = item.id === activeId;
            return (
              <a
                key={item.id}
                ref={setLinkRef(item.id)}
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                className="relative py-2 font-sans text-[15px] font-semibold text-gray-700 transition-colors duration-200 ease-out-expo hover:text-gray-900 aria-[current=true]:text-gray-900"
              >
                {item.label}
              </a>
            );
          })}
          <m.span
            aria-hidden="true"
            data-testid="nav-indicator"
            style={{ x }}
            className={cn(
              "pointer-events-none absolute -bottom-1 left-0 h-1.5 w-1.5 rounded-full bg-ink transition-opacity duration-250 ease-out-expo",
              activeId ? "opacity-100" : "opacity-0",
            )}
          />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {site.appUrl ? (
            <Button variant="ghost" size="sm" asChild>
              <a href={site.appUrl}>{ui.header.login}</a>
            </Button>
          ) : null}
          <Button size="sm" asChild>
            <a href="#planos">{ui.header.cta}</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button size="sm" className="h-11" asChild>
            <a href="#planos">{ui.header.ctaShort}</a>
          </Button>
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={ui.header.menuOpen}
                className="grid h-11 w-11 place-items-center rounded-full text-gray-800 transition-colors duration-200 hover:bg-gray-100"
              >
                <Menu size={24} aria-hidden="true" focusable="false" />
              </button>
            </DialogTrigger>
            <DialogContent
              variant="sheet"
              title={ui.header.menuTitle}
              titleSrOnly
              className="pt-20"
            >
              <nav aria-label={ui.header.menuTitle} className="flex-1">
                <ul className="flex flex-col">
                  {nav.map((item, index) => (
                    <li
                      key={item.id}
                      className="animate-fade-in [animation-fill-mode:backwards]"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <DialogClose asChild>
                        <a
                          href={`#${item.id}`}
                          className="block border-b border-gray-100 py-3 font-display text-[28px] font-bold leading-tight tracking-tight text-gray-900 transition-colors duration-200 hover:text-berry-700"
                        >
                          {item.label}
                        </a>
                      </DialogClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div
                className="mt-8 flex flex-col gap-3 animate-fade-in [animation-fill-mode:backwards]"
                style={{ animationDelay: `${nav.length * 40}ms` }}
              >
                <DialogClose asChild>
                  <Button size="lg" fullWidth asChild>
                    <a href="#planos">{ui.header.cta}</a>
                  </Button>
                </DialogClose>
                {site.appUrl ? (
                  <Button variant="secondary" size="lg" fullWidth asChild>
                    <a href={site.appUrl}>{ui.header.login}</a>
                  </Button>
                ) : null}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </header>
  );
}
