import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Render as another element, e.g. "article" or "section". */
  as?: ElementType;
  padding?: "none" | "sm" | "md" | "lg";
  /** Lifts slightly on hover — for clickable cards. */
  interactive?: boolean;
}

const PADDING = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

/** The card surface as classes — for cards that are links or buttons. */
export function cardClasses({ padding = "md", interactive, className }: { padding?: keyof typeof PADDING; interactive?: boolean; className?: string } = {}) {
  return cn(
    "rounded-2xl bg-card ring-1 ring-ink/10",
    PADDING[padding],
    interactive && "transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(20,24,22,0.25)]",
    className
  );
}

/**
 * The one card surface: white on the paper background, a hairline ring, no
 * coloured shadow. Every card on the site starts from this.
 */
export default function Card({ children, className, as: Tag = "div", padding = "md", interactive }: CardProps) {
  return (
    <Tag className={cardClasses({ padding, interactive, className })}>
      {children}
    </Tag>
  );
}
