// A pasta do projeto fica no OneDrive, onde o boot do worker do Vitest passa facil de 60 s
// (limite fixo no codigo do Vitest). Este patch eleva os dois limites para 10 minutos.
// Roda no postinstall; e idempotente e ignora silenciosamente versoes sem os padroes.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "node_modules", "vitest", "dist", "chunks");
let patched = 0;
try {
  for (const file of readdirSync(dir)) {
    if (!file.startsWith("cli-api.") || !file.endsWith(".js")) continue;
    const path = join(dir, file);
    const src = readFileSync(path, "utf8");
    const out = src
      .replace("const START_TIMEOUT = 6e4;", "const START_TIMEOUT = 6e5;")
      .replace("const STOP_TIMEOUT = 6e4;", "const STOP_TIMEOUT = 6e5;")
      .replace("const WORKER_START_TIMEOUT = 9e4;", "const WORKER_START_TIMEOUT = 6e5;");
    if (out !== src) {
      writeFileSync(path, out);
      patched++;
    }
  }
  console.log(`[patch-vitest-timeout] arquivos alterados: ${patched}`);
} catch (error) {
  console.warn("[patch-vitest-timeout] ignorado:", error instanceof Error ? error.message : error);
}
