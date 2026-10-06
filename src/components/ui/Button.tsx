import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The one button style for Agaaw. Use `Button` for actions and `ButtonLink`
 * for navigation — they look identical.
 *
 * - primary: black pill, the main action on a page
 * - brand:   teal pill, for the brand moment (hero, sign-up)
 * - outline: quiet secondary action
 * - light:   white pill, for dark backgrounds
 * - ghost:   text-only
 */
type Variant = "primary" | "brand" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-forest",
  brand: "bg-elm text-white hover:bg-elm-dark",
  outline: "border-2 border-ink/15 text-ink hover:border-ink bg-transparent",
  light: "bg-white text-ink hover:bg-seagreen-soft",
  ghost: "text-ink hover:bg-paper-deep",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-base",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className
  );
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export default function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} {...props} className={buttonClasses({ variant, size, className })} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClasses({ variant, size, className })} />;
}
