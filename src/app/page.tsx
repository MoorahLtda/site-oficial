import dynamic from "next/dynamic";
import { ComoFunciona } from "@/components/sections/como-funciona";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Especialidades } from "@/components/sections/especialidades";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { MobileCtaBar } from "@/components/sections/mobile-cta-bar";
import { PorQue } from "@/components/sections/por-que";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { plans, site } from "@/content/site";

/*
  Composicao da landing (docs/design-brief.md, secao 6). As quatro primeiras secoes saem no HTML
  inicial; as demais entram por next/dynamic (sem ssr:false: o servidor continua renderizando o
  HTML, so o chunk cliente e adiado) com SectionSkeleton reservando a altura para evitar CLS.
*/

const Cartao = dynamic(() => import("@/components/sections/cartao").then((mod) => mod.Cartao), {
  loading: () => <SectionSkeleton minHeight="min-h-[640px]" />,
});
const Beneficios = dynamic(
  () => import("@/components/sections/beneficios").then((mod) => mod.Beneficios),
  { loading: () => <SectionSkeleton minHeight="min-h-[900px]" /> },
);
const Planos = dynamic(() => import("@/components/sections/planos").then((mod) => mod.Planos), {
  loading: () => <SectionSkeleton minHeight="min-h-[960px]" />,
});
const Duvidas = dynamic(() => import("@/components/sections/duvidas").then((mod) => mod.Duvidas), {
  loading: () => <SectionSkeleton minHeight="min-h-[720px]" />,
});
const Contato = dynamic(() => import("@/components/sections/contato").then((mod) => mod.Contato), {
  loading: () => <SectionSkeleton minHeight="min-h-[640px]" />,
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
        <Cartao />
        <Beneficios />
        <Planos />
        <Diferenciais />
        <Duvidas />
        <Contato />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
