import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * "Flow" hover: a large circle is parked off the bottom-right corner and slides
 * up to fill the button on hover. Two variants matched to this site's palette:
 *  - "light": a grey/glass surface that fills white (text darkens to ink)
 *  - "dark":  a white surface that fills deep navy blue (text lightens)
 */
export type FlowVariant = "light" | "dark";

const base =
  "relative z-0 inline-flex cursor-pointer select-none items-center justify-center gap-2 " +
  "overflow-hidden rounded-xl font-medium transition-all duration-[400ms] hover:scale-105 active:scale-95 " +
  "before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] " +
  "before:scale-[2.5] before:rounded-[100%] before:transition-transform before:duration-[560ms] " +
  "before:content-[''] hover:before:translate-x-0 hover:before:translate-y-0";

const variants: Record<FlowVariant, string> = {
  light: "glass-soft text-white before:bg-white hover:text-ink",
  dark: "bg-white text-ink before:bg-[#6989BC] hover:text-white",
};

/** Build the flow-hover class string for any element (button or anchor). */
export function flowHover(variant: FlowVariant = "dark", className?: string) {
  return cn(base, variants[variant], className);
}

export const Button: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: FlowVariant;
    icon?: ReactNode;
  }
> = ({ variant = "dark", icon, children, className, ...props }) => (
  <button className={flowHover(variant, className)} {...props}>
    {icon}
    <span>{children}</span>
  </button>
);
