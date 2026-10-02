import type { ComponentType, ReactNode } from "react";

interface SectionCardProps {
    title: string;
    description?: string;
    /**
     * Kept for compatibility with existing callers, but no longer drawn:
     * an icon in a tinted square on every card was the most template-like
     * part of the dashboards. Titles carry the section on their own.
     */
    icon?: ComponentType<{ size?: number; className?: string }>;
    iconClassName?: string;
    badge?: ReactNode;
    actions?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function SectionCard({ title, description, badge, actions, footer, children, className = "" }: SectionCardProps) {
    return (
        <section className={`rounded-2xl bg-card p-6 ring-1 ring-ink/10 ${className}`}>
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-end">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
                        {badge}
                    </div>
                    {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
            </div>

            <div className="flex-1">{children}</div>

            {footer && <div className="mt-5 border-t border-ink/10 pt-5 text-center">{footer}</div>}
        </section>
    );
}
