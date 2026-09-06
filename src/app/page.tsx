import dynamic from "next/dynamic";
import { ComoFunciona } from "@/components/sections/como-funciona";
import { Especialidades } from "@/components/sections/especialidades";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { MobileCtaBar } from "@/components/sections/mobile-cta-bar";
import { PorQue } from "@/components/sections/por-que";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { plans, site } from "@/content/site";

/*
  Composicao da landing (docs/design-brief-v4-secoes.md, secao 2). As quatro primeiras secoes saem
  no HTML inicial; as demais entram por next/dynamic (sem ssr:false: o servidor continua
  renderizando o HTML, so o chunk cliente e adiado) com SectionSkeleton reservando a altura para
  evitar CLS. Diferenciais saiu da pagina e o Cartao virou o bloco fundido #beneficios.
*/

/*
  Alturas minimas do skeleton = altura real de cada secao, medida no navegador depois do brief
  v4-secoes (integracao final, secao 7). Base = 390 px de viewport; lg = 1024; xl = 1440, usado
  so onde a diferenca entre 1024 e 1440 passa de 20 px (Beneficios muda de 2 para 1 coluna de
  texto, Contato reflui o h2). Remedir sempre que a copy ou o layout de uma secao mudar: skeleton
  curto demais empurra a pagina para baixo na hidratacao, e alto demais puxa para cima; os dois
  contam como CLS.
*/
const Beneficios = dynamic(
  () => import("@/components/sections/beneficios").then((mod) => mod.Beneficios),
  {
    loading: () => (
      <SectionSkeleton minHeight="min-h-[1355px] lg:min-h-[1035px] xl:min-h-[930px]" />
    ),
  },
);
const Planos = dynamic(() => import("@/components/sections/planos").then((mod) => mod.Planos), {
  loading: () => <SectionSkeleton minHeight="min-h-[2390px] lg:min-h-[1430px]" />,
});
const Duvidas = dynamic(() => import("@/components/sections/duvidas").then((mod) => mod.Duvidas), {
  loading: () => <SectionSkeleton minHeight="min-h-[1075px] lg:min-h-[930px]" />,
});
const Contato = dynamic(() => import("@/components/sections/contato").then((mod) => mod.Contato), {
  loading: () => <SectionSkeleton minHeight="min-h-[1170px] lg:min-h-[890px] xl:min-h-[870px]" />,
});

// Dados estruturados (schema.org). Tudo vem de site.ts: nada de avaliacoes, notas ou selos.
const organizationId = `${site.url}/#organization`;
const sameAs = [site.social.instagram, site.social.linkedin].filter((url) => url !== "");

function priceOf(cents: number): string {
  return (cents / 100).toFixed(2);
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.product,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/brand/moorah-mark.png`,
      description: site.description,
      email: site.contact.email,
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
    {
      "@type": "Product",
      "@id": `${site.url}/#product`,
      name: site.product,
      description: site.description,
      url: site.url,
      brand: { "@type": "Brand", name: site.name },
      manufacturer: { "@id": organizationId },
      offers: plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.headline,
        url: `${site.url}/#planos`,
        price: priceOf(plan.priceCents),
        priceCurrency: "BRL",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: priceOf(plan.priceCents),
          priceCurrency: "BRL",
          billingDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
        eligibleQuantity: { "@type": "QuantitativeValue", value: plan.people, unitText: "pessoa" },
        seller: { "@id": organizationId },
      })),
    },
  ],
};

// "<" vira < para o JSON nunca fechar a tag <script> (recomendacao dos docs do Next).
const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON serializado de site.ts, sem input de usuario; "<" escapado acima.
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />
      <Header />
      <main id="conteudo" className="flex-1">
        <Hero />
        <PorQue />
        <ComoFunciona />
        <Especialidades />
        <Beneficios />
        <Planos />
        <Duvidas />
        <Contato />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
