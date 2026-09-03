import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out-expo disabled:opacity-60 disabled:pointer-events-none active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-berry-600 text-white shadow-card hover:bg-berry-700 hover:shadow-float",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        plum: "bg-white text-ink hover:bg-berry-50",
        "outline-light": "border border-berry-300 text-white hover:bg-white/10",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-[52px] px-7 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "fullWidth"> {
  // Radix Slot: repassa classes e atributos ao filho (use para <a href>).
  asChild?: boolean;
  fullWidth?: boolean;
  // Desabilita, marca aria-busy e mostra o Loader2 girando.
  loading?: boolean;
}

export function Button({
  variant,
  size,
  asChild = false,
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 size={18} aria-hidden="true" className="animate-spin" /> : null}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}
