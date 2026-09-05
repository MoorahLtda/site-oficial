import Link from "next/link";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Badge } from "@/components/ui/badge";
import { legalNav } from "@/content/legal";
import type { LegalBlock, LegalDocument, LegalSection } from "@/content/legal/types";
import { site, ui } from "@/content/site";

/*
  Pagina de documento legal (server component). Renderiza qualquer LegalDocument de
  src/content/legal: sumario lateral fixo, corpo em coluna de leitura e bloco de contato
  do encarregado. Estrutura de headings: um h1 (titulo do documento), um h2 por secao,
  h3 nos blocos internos. Nada aqui pode conter travessao (U+2014); use hifen.
*/

// Microcopy de interface (nao existe em site.ts, como em footer.tsx).
const labels = {
  summary: "Neste documento",
  summaryNav: "Sumário",
  others: "Outros documentos",
  draftBadge: "Minuta",
  version: "Versão",
  updatedAt: "Atualizado em",
  contactTitle: "Dúvidas sobre este documento",
  contactText:
    "Se alguma parte deste texto não estiver clara, escreva para o encarregado de proteção de dados da Moorah. Respondemos pelo mesmo canal.",
} as const;

const monthNames = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

/*
  Formata uma data ISO (AAAA-MM-DD) em portugues sem consultar o relogio nem o Intl do
  ambiente, para o texto ser igual no servidor, no cliente e no teste. Formato invalido
  volta como veio, para nunca esconder a data do leitor.
*/
export function formatUpdatedAt(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const name = monthNames[month - 1];
  if (!name || day < 1 || day > 31) return iso;
  return `${day} de ${name} de ${year}`;
}

// Id do rotulo "Outros documentos"; ha um LegalPage por pagina, entao pode ser fixo.
const othersLabelId = "legal-outros-documentos";

const listBase = "mt-4 space-y-2 pl-5 text-gray-700 leading-relaxed max-w-prose";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="mt-8 font-display text-lg font-semibold text-gray-900">{block.text}</h3>
      );
    case "ul":
      return (
        <ul className={`${listBase} list-disc marker:text-berry-500`}>
          {block.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className={`${listBase} list-decimal marker:text-berry-500`}>
          {block.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside
          role="note"
          className="mt-6 max-w-prose rounded-r-2xl border-l-2 border-berry-300 bg-berry-50/60 py-4 pr-5 pl-5 text-gray-700 leading-relaxed"
        >
          {block.text}
        </aside>
      );
    default:
      return <p className="mt-4 max-w-prose text-gray-700 leading-relaxed">{block.text}</p>;
  }
}

function Section({ section }: { section: LegalSection }) {
  const headingId = `${section.id}-titulo`;
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className="scroll-mt-28 border-t border-gray-200 pt-10 first:border-t-0 first:pt-0"
    >
      <h2 id={headingId} className="font-display text-2xl font-bold text-gray-900">
        {section.title}
      </h2>
      {section.blocks.map((block, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: conteudo estatico; blocos podem repetir o mesmo texto na mesma secao e nunca sao reordenados.
        <Block key={`${section.id}-${index}`} block={block} />
      ))}
    </section>
  );
}

export interface LegalPageProps {
  doc: LegalDocument;
}

export function LegalPage({ doc }: LegalPageProps) {
  const others = legalNav.filter((item) => item.slug !== doc.slug);

  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1">
        <div className="container-x grid gap-12 pt-32 pb-24 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14">
          {/* Cabecalho do documento */}
          <div className="lg:col-span-8 lg:col-start-4 lg:row-start-1">
            <p className="eyebrow">{site.product}</p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-xs font-semibold tabular-nums text-gray-600">
              <span>
                {labels.version} {doc.version}
              </span>
              <span aria-hidden="true" className="text-berry-300">
                ·
              </span>
              <span>
                {labels.updatedAt}{" "}
                <time dateTime={doc.updatedAt}>{formatUpdatedAt(doc.updatedAt)}</time>
              </span>
            </p>

            {doc.draftNotice ? (
              <div
                role="status"
                className="mt-8 max-w-prose rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <Badge tone="neutral">{labels.draftBadge}</Badge>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{doc.draftNotice}</p>
              </div>
            ) : null}

            <div className="mt-8 space-y-4">
              {doc.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-prose text-lg leading-relaxed text-gray-600 sm:text-xl"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Sumario lateral: primeiro no mobile depois do titulo, fixo no desktop */}
          <aside className="lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600">
                {labels.summary}
              </p>
              <nav aria-label={labels.summaryNav} className="mt-4">
                <ol className="space-y-1 border-l border-gray-200 pl-4">
                  {doc.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="inline-flex min-h-9 items-center text-[13px] leading-snug text-gray-600 underline-offset-4 decoration-berry-300 decoration-[1.5px] transition-colors duration-200 ease-out-expo hover:text-gray-900 hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <p
                id={othersLabelId}
                className="mt-10 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600"
              >
                {labels.others}
              </p>
              {/* O rotulo visivel e o nome do nav, para o leitor de tela nao ouvir o texto duas vezes. */}
              <nav aria-labelledby={othersLabelId} className="mt-4">
                <ul className="space-y-1">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-9 items-center font-display text-sm font-semibold text-berry-700 underline-offset-4 decoration-berry-300 decoration-[1.5px] transition-colors duration-200 ease-out-expo hover:text-berry-800 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Corpo do documento */}
          <div className="lg:col-span-8 lg:col-start-4 lg:row-start-2">
            <article className="space-y-10">
              {doc.sections.map((section) => (
                <Section key={section.id} section={section} />
              ))}
            </article>

            <div className="mt-16 max-w-prose rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="font-display text-lg font-semibold text-gray-900">
                {labels.contactTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{labels.contactText}</p>
              <a
                href={`mailto:${site.contact.dpoEmail}`}
                className="mt-4 inline-flex min-h-11 items-center break-all font-display text-sm font-bold text-berry-700 underline decoration-berry-300 decoration-[1.5px] underline-offset-4 hover:text-berry-800"
              >
                {site.contact.dpoEmail}
              </a>
              <p className="mt-2">
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center font-display text-sm font-bold text-berry-700 underline-offset-4 hover:underline"
                >
                  {ui.pages.backHome}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
