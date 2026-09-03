import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Button } from "@/components/ui/button";
import { ui } from "@/content/site";

/*
  Pagina 404 (docs/design-brief.md, secao 8). Server Component: marca decorativa, eyebrow "404",
  h1 unico e botao de volta ao inicio. Header e Footer reutilizados.
*/
export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="conteudo"
        className="container-x flex min-h-[70svh] flex-1 flex-col items-center justify-center pt-24 pb-16 text-center"
      >
        <Image
          src="/brand/moorah-mark.png"
          alt=""
          width={194}
          height={265}
          className="h-24 w-auto"
        />
        <p className="eyebrow mt-8">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {ui.pages.notFoundTitle}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{ui.pages.notFoundText}</p>
        <Button className="mt-8" asChild>
          <Link href="/">{ui.pages.backHome}</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
