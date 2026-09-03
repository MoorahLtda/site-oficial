import {
  Activity,
  Apple,
  Baby,
  BellRing,
  Bone,
  Brain,
  CalendarCheck,
  Clock,
  Cpu,
  CreditCard,
  Ear,
  Eye,
  FileCheck,
  FlaskConical,
  Flower2,
  HandHeart,
  HeartPulse,
  LayoutDashboard,
  type LucideIcon,
  type LucideProps,
  Pill,
  ShieldCheck,
  ShoppingBag,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import type { IconKey } from "@/content/site";

export const iconMap: Record<IconKey, LucideIcon> = {
  stethoscope: Stethoscope,
  baby: Baby,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  flower: Flower2,
  bone: Bone,
  activity: Activity,
  ear: Ear,
  eye: Eye,
  "hand-heart": HandHeart,
  apple: Apple,
  brain: Brain,
  "calendar-check": CalendarCheck,
  "bell-ring": BellRing,
  video: Video,
  "file-check": FileCheck,
  "credit-card": CreditCard,
  pill: Pill,
  flask: FlaskConical,
  "shopping-bag": ShoppingBag,
  "layout-dashboard": LayoutDashboard,
  "shield-check": ShieldCheck,
  cpu: Cpu,
  smile: Smile,
  "trending-up": TrendingUp,
  clock: Clock,
  users: Users,
};

interface IconProps extends LucideProps {
  name: IconKey;
}

// Icones sao decorativos por padrao; o texto ao lado carrega o significado.
export function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name];
  return <Component aria-hidden="true" focusable="false" strokeWidth={2} {...props} />;
}
