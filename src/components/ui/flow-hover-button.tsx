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
  "overflow-hidden rounded-xl font-medium transition-all duration-[400ms] hover:scale-105 active:scale-95";

const variants: Record<FlowVariant, string> = {
  // Grey/glass surface fills white: a white disc slides in from the bottom-right.
  light:
    "glass-soft text-white hover:text-ink " +
    "before:absolute before:inset-0 before:-z-10 before:scale-[2.5] before:rounded-[100%] before:bg-white " +
    "before:transition-transform before:duration-[560ms] before:content-[''] " +
    "before:translate-x-[150%] before:translate-y-[150%] hover:before:translate-x-0 hover:before:translate-y-0",
  // White surface fills navy. Navy is the permanent background (so the rounded
  // overflow clip never reveals a white hairline); a static white ::before is
  // the resting white face, and a navy ::after disc slides in from the
  // bottom-right on hover — matching the light variant's fill direction/arc.
  dark:
    "bg-[#1A2730] text-ink hover:text-white " +
    "before:absolute before:inset-[1.5px] before:-z-10 before:rounded-[10px] before:bg-white before:content-[''] " +
    "after:absolute after:inset-0 after:-z-10 after:scale-[2.5] after:rounded-[100%] after:bg-[#1A2730] " +
    "after:transition-transform after:duration-[560ms] after:content-[''] " +
    "after:translate-x-[150%] after:translate-y-[150%] hover:after:translate-x-0 hover:after:translate-y-0",
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
