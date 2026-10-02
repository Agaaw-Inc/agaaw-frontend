import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Eyebrow from "@/components/ui/Eyebrow";

/**
 * Agaaw's type scale, as one component. Pick a size instead of writing font
 * classes by hand, so every page's headings match.
 *
 * - display: page hero        (h1)
 * - section: a page section   (h2)
 * - card:    inside a card    (h2/h3)
 */
const SIZES = {
  display: "text-[2.6rem] leading-[0.98] tracking-[-0.035em] sm:text-6xl",
  section: "text-4xl leading-[1.02] tracking-[-0.03em] md:text-5xl",
  card: "text-xl leading-tight tracking-[-0.02em] sm:text-2xl",
};

interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Rendered on the right (or below on phones): a link, a button, tabs. */
  action?: ReactNode;
  size?: keyof typeof SIZES;
  as?: "h1" | "h2" | "h3";
  /** "light" for dark backgrounds. */
  tone?: "dark" | "light";
  /** Centre the heading (no action column). */
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  size = "section",
  as,
  tone = "dark",
  align = "left",
  className,
}: SectionHeadingProps) {
  const Tag = as ?? (size === "display" ? "h1" : "h2");
  const light = tone === "light";

  if (align === "center") {
    return (
      <div className={cn("mx-auto max-w-3xl text-center", className)}>
        {eyebrow && (
          <Eyebrow tone={light ? "light" : "brand"} className="mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        <Tag className={cn("font-extrabold", SIZES[size], light ? "text-white" : "text-ink")}>{title}</Tag>
        {description && (
          <p className={cn("mx-auto mt-4 max-w-2xl text-lg leading-relaxed", light ? "text-white/75" : "text-ink-soft")}>{description}</p>
        )}
      </div>
    );
  }

  return (
    // Only bottom-align when there's an action to line up with; on its own
    // the heading sits at the top of its space.
    <div className={cn("flex flex-col justify-between gap-4 sm:flex-row", action ? "sm:items-end" : "self-start", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <Eyebrow tone={light ? "light" : "brand"} className="mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        <Tag className={cn("font-extrabold", SIZES[size], light ? "text-white" : "text-ink")}>{title}</Tag>
        {description && (
          <p className={cn("mt-3 max-w-2xl leading-relaxed", size === "card" ? "text-sm" : "text-lg", light ? "text-white/75" : "text-ink-soft")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
