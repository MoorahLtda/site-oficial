import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { legalNotes, nav, site, ui } from "@/content/site";
import { cn, whatsappUrl } from "@/lib/utils";

/*
  Rodape (server component). Superficie clara com hairline gray-200 no topo, quatro colunas no
  desktop (marca 4 / navegacao 3 / legal 2 / contato 3) e empilhado no mobile na mesma ordem.
  Um unico Reveal fade no bloco inteiro; hover dos links por CSS. O ano e calculado no servidor.
*/

// Rotulos de coluna: microcopy de interface (nao existem em site.ts).
const columnLabels = {
  nav: "Navegação",
  legal: "Legal",
  // Titulo da pagina /lgpd (nao existe em ui.footer).
  lgpd: "LGPD e seus direitos",
  contact: "Contato",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  newTab: "(abre em nova aba)",
} as const;

// Credito das fotografias (brief v2, item 1), na area de notas legais junto das tres notas.
const photoCredit = ui.footer.photoCredit;

// Link de texto do rodape: alvo de 44 px no mobile, sublinhado suave no hover.
const footerLink =
  "inline-flex min-h-11 items-center gap-2 text-sm text-gray-700 underline-offset-4 decoration-berry-300 decoration-[1.5px] transition-colors duration-200 ease-out-expo hover:text-gray-900 hover:underline lg:min-h-0 lg:py-1";

interface ColumnProps {
  label: string;
  className?: string;
  children: ReactNode;
}

// Titulo de coluna (h2, para navegacao por leitor de tela) em mono caixa alta com traco curto de amora.
function Column({ label, className, children }: ColumnProps) {
  return (
    <div className={className}>
      <h2 className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-gray-600">
        <span aria-hidden="true" className="h-px w-4 bg-berry-300" />
        {label}
      </h2>
      {children}
    </div>
  );
}

interface ExternalLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}

function ExternalLink({ href, icon, children }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={footerLink}>
      {icon}
      {children}
      <span className="sr-only"> {columnLabels.newTab}</span>
    </a>
  );
}

const iconClass = "size-4 shrink-0 text-berry-600";

// Glifos de rede social (lucide nao distribui mais icones de marca). Decorativos, em currentColor.
function InstagramGlyph() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinGlyph() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v6" />
      <path d="M8 7.5v.01" />
      <path d="M12 17v-6" />
      <path d="M12 13.5a2.5 2.5 0 0 1 5 0V17" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { email, whatsapp, cnpj } = site.contact;
  const { instagram, linkedin } = site.social;

  return (
    <footer className="relative isolate overflow-hidden border-t border-gray-200 bg-white py-16 lg:py-20">
      {/*
        Marca d'agua do simbolo (brief v2, item 2): plum em 4% sobre superficie lisa, decorativa.
        `overflow-hidden` + `isolate` no footer evitam barra de rolagem horizontal, e `-z-10`
        a mantem acima do fundo branco e atras do conteudo.
      */}
      <Image
        src="/brand/moorah-mark.png"
        alt=""
        aria-hidden="true"
        width={194}
        height={265}
        data-testid="footer-watermark"
        // 265 px e a altura nativa de moorah-mark.png: acima disso o navegador ampliaria o PNG.
        className="pointer-events-none absolute -right-16 top-1/2 -z-10 h-[265px] w-auto -translate-y-1/2 select-none opacity-[0.04]"
      />
      <Reveal variant="fade" duration={500} amount={0.2}>
        <Container className="relative grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Marca */}
          <div className="lg:col-span-4">
            {/* Lockup vertical grande (brief v2, item 2): simbolo acima, palavra abaixo, a esquerda. */}
            <div data-testid="footer-lockup" className="flex flex-col items-start gap-3">
              <Image
                src="/brand/moorah-mark.png"
                alt=""
                width={194}
                height={265}
                className="h-16 w-auto"
              />
              <Image
                src="/brand/moorah-wordmark.png"
                alt={site.name}
                width={518}
                height={82}
                className="h-5 w-auto"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              {site.description}
            </p>
          </div>

          {/* Navegacao */}
          <nav aria-label={ui.footer.navLabel} className="lg:col-span-3">
            <Column label={columnLabels.nav}>
              <ul className="mt-4 space-y-1 lg:space-y-2">
                {nav.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className={footerLink}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Column>
          </nav>

          {/* Legal */}
          <Column label={columnLabels.legal} className="lg:col-span-2">
            <ul className="mt-4 space-y-1 lg:space-y-2">
              <li>
                <a href="/termos" className={footerLink}>
                  {ui.footer.terms}
                </a>
              </li>
              <li>
                <a href="/privacidade" className={footerLink}>
                  {ui.footer.privacy}
                </a>
              </li>
              <li>
                <a href="/lgpd" className={footerLink}>
                  {columnLabels.lgpd}
                </a>
              </li>
            </ul>
          </Column>

          {/* Contato */}
          <Column label={columnLabels.contact} className="lg:col-span-3">
            <ul className="mt-4 space-y-1 lg:space-y-2">
              <li>
                <a href={`mailto:${email}`} className={cn(footerLink, "break-all")}>
                  <Mail aria-hidden="true" focusable="false" className={iconClass} />
                  {email}
                </a>
              </li>
              {whatsapp ? (
                <li>
                  <ExternalLink
                    href={whatsappUrl(whatsapp, ui.leadForm.whatsappMessage)}
                    icon={
                      <MessageCircle aria-hidden="true" focusable="false" className={iconClass} />
                    }
                  >
                    {columnLabels.whatsapp}
                  </ExternalLink>
                </li>
              ) : null}
              {instagram ? (
                <li>
                  <ExternalLink href={instagram} icon={<InstagramGlyph />}>
                    {columnLabels.instagram}
                  </ExternalLink>
                </li>
              ) : null}
              {linkedin ? (
                <li>
                  <ExternalLink href={linkedin} icon={<LinkedinGlyph />}>
                    {columnLabels.linkedin}
                  </ExternalLink>
                </li>
              ) : null}
            </ul>
          </Column>

          {/* Linha inferior */}
          <div className="mt-2 flex flex-col gap-3 border-t border-gray-200 pt-6 text-[13px] leading-relaxed text-gray-600 lg:col-span-12 lg:mt-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {[...legalNotes, photoCredit].map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] size-1 shrink-0 rounded-full bg-berry-300"
                  />
                  {note}
                </li>
              ))}
            </ul>
            <p className="shrink-0 tabular-nums">
              &copy; {year} {site.legalName}
              {cnpj ? ` · CNPJ ${cnpj}` : null}
            </p>
          </div>
        </Container>
      </Reveal>
    </footer>
  );
}
