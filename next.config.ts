import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// CSP sem nonce: o Next precisa de scripts inline para hidratar. 'unsafe-eval' so em dev (HMR).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.pexels.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/*
  Previa estatica no GitHub Pages (STATIC_EXPORT=1, usado so por .github/workflows/pages.yml).

  O GitHub Pages serve arquivos estaticos e nada mais, entao a previa perde tres coisas que o
  site de producao precisa ter: a rota /api/leads (o workflow apaga src/app/api antes de gerar o
  export), a otimizacao de imagens do next/image e os cabecalhos de seguranca abaixo, que so
  existem em um servidor. Por isso a previa nasce com robots.txt bloqueando tudo. O site de
  verdade roda em um host com servidor Node (Vercel), como esta no README.

  BASE_PATH: em pagina de projeto a URL e usuario.github.io/<repo>, entao o site vive em um
  subcaminho. O workflow passa /site-oficial; em pagina de usuario ou dominio proprio, vazio.
*/
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Fotos placeholder do Pexels (src/content/site.ts, photos). Trocar por fotos proprias.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" }],
    // Sem servidor nao ha otimizador. Um carregador proprio (em vez de `unoptimized`) mantem
    // o prefixo do subcaminho nas imagens locais: ver src/lib/image-loader.js.
    ...(staticExport ? { loader: "custom" as const, loaderFile: "./src/lib/image-loader.js" } : {}),
  },
  ...(staticExport
    ? {
        output: "export" as const,
        // Pasta de build propria: o export estatico nunca disputa .next com o `next dev`.
        distDir: ".next-export",
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
