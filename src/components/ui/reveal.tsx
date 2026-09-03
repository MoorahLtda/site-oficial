"use client";

import { m, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Variant = "fade-up" | "fade" | "line";

function makeVariants(variant: Variant, y: number, duration: number, delay: number): Variants {
  if (variant === "line") {
    return {
      hidden: { scaleX: 0 },
      show: {
        scaleX: 1,
        transition: { duration: duration / 1000, ease: [0.65, 0, 0.35, 1], delay },
      },
    };
  }
  if (variant === "fade") {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: duration / 1000, ease: EASE, delay } },
    };
  }
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: duration / 1000, ease: EASE, delay } },
  };
}

interface RevealProps {
  as?: "div" | "section" | "li" | "span" | "p";
  variant?: Variant;
  delay?: number; // segundos
  duration?: number; // ms, padrao 550
  y?: number; // px, padrao 20
  once?: boolean; // padrao true
  amount?: number; // padrao 0.25
  className?: string;
  children?: ReactNode;
}

export function Reveal({
  as = "div",
  variant = "fade-up",
  delay = 0,
  duration = 550,
  y = 20,
  once = true,
  amount = 0.25,
  className,
  children,
}: RevealProps) {
  const Tag = m[as] as ElementType;
  return (
    <Tag
      className={className}
      variants={makeVariants(variant, y, duration, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </Tag>
  );
}

interface RevealGroupProps {
  as?: "div" | "ul" | "ol" | "section";
  stagger?: number; // segundos, padrao 0.08
  once?: boolean;
  amount?: number;
  className?: string;
  children?: ReactNode;
}

// Pai que dispara os filhos RevealItem em cascata.
export function RevealGroup({
  as = "div",
  stagger = 0.08,
  once = true,
  amount = 0.25,
  className,
  children,
}: RevealGroupProps) {
  const Tag = m[as] as ElementType;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

interface RevealItemProps {
  as?: "div" | "li" | "span" | "article";
  variant?: Variant;
  y?: number;
  duration?: number;
  className?: string;
  children?: ReactNode;
}

// Filho de RevealGroup: herda o gatilho do pai, so declara as variants.
export function RevealItem({
  as = "div",
  variant = "fade-up",
  y = 20,
  duration = 550,
  className,
  children,
}: RevealItemProps) {
  const Tag = m[as] as ElementType;
  return (
    <Tag className={className} variants={makeVariants(variant, y, duration, 0)}>
      {children}
    </Tag>
  );
}
