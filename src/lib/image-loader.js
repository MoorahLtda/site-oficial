/*
  Carregador de imagens do build estatico (GitHub Pages).

  Sem servidor nao ha otimizador, entao cada imagem e servida como esta. O detalhe que quebra:
  em pagina de projeto o site vive em um subcaminho (/site-oficial) e o next/image nao prefixa
  o basePath sozinho quando nao otimiza, entao "/brand/moorah-mark.png" viraria 404. Aqui o
  prefixo entra uma vez, para todas as imagens locais, sem mexer nos componentes.

  Fotos remotas (Pexels) passam intactas. `width` e `quality` sao ignorados de proposito: nao ha
  quem redimensione.
*/
export default function staticImageLoader({ src }) {
  if (/^https?:\/\//.test(src)) return src;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${src}`;
}
