import type { Metadata, Viewport } from "next";
import { HashScroll } from "@/components/providers/hash-scroll";
import { MotionProvider } from "@/components/providers/motion-provider";
import { site } from "@/content/site";
// Fontes auto-hospedadas (Fontsource): sem dependencia de rede no build.
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const title = `${site.product} | Consultas médicas online ilimitadas`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.product}`,
  },
  description: site.description,
  applicationName: site.product,
  keywords: [
    "telemedicina",
    "consulta médica online",
    "plano familiar",
    "médico por vídeo",
    "assinatura de saúde",
    "cartão de benefícios",
    "desconto em farmácias",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.product,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4B244D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <HashScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
