import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

// Largura de conteudo padrao (1200px) com respiro lateral; ver @utility container-x.
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn("container-x", className)} {...props} />;
}
