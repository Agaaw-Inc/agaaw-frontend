import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  body?: ReactNode;
  /** A link button, or any node (e.g. a button with an onClick). */
  action?: { href: string; label: string } | ReactNode;
  className?: string;
}

/** "Nothing here yet" — a dashed box that says what to do next. */
export default function EmptyState({ title, body, action, className }: EmptyStateProps) {
  const isLink = !!action && typeof action === "object" && "href" in (action as object) && "label" in (action as object);
  return (
    <div className={cn("rounded-2xl border-2 border-dashed border-ink/15 px-6 py-12 text-center", className)}>
      <p className="text-lg font-bold text-ink">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{body}</p>}
      {action && (
        <div className="mt-5">
          {isLink ? (
            <ButtonLink href={(action as { href: string }).href} size="sm">
              {(action as { label: string }).label}
            </ButtonLink>
          ) : (
            (action as ReactNode)
          )}
        </div>
      )}
    </div>
  );
}
