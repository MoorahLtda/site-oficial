import { cn } from "@/lib/utils";

export interface SectionSkeletonProps {
  // Classe de altura minima (ex.: "min-h-[640px]") para reservar o espaco da secao real e evitar CLS.
  minHeight?: string;
  className?: string;
}

// Placeholder para next/dynamic e loading.tsx. Decorativo: aria-hidden.
export function SectionSkeleton({ minHeight, className }: SectionSkeletonProps) {
  return (
    <div aria-hidden="true" className={cn("container-x py-20", minHeight, className)}>
      <div className="skeleton h-8 w-40" />
      <div className="skeleton mt-4 h-12 w-3/4 max-w-xl" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="skeleton h-56" />
        <div className="skeleton h-56" />
        <div className="skeleton h-56" />
      </div>
    </div>
  );
}
