import type { ComponentType, ReactNode } from "react";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

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

/** A dashboard section: the shared Card with a shared heading and optional footer. */
export default function SectionCard({ title, description, badge, actions, footer, children, className }: SectionCardProps) {
    return (
        <Card as="section" className={className}>
            <SectionHeading
                size="card"
                title={
                    <span className="flex flex-wrap items-center gap-2">
                        {title}
                        {badge}
                    </span>
                }
                description={description}
                action={actions}
                className="mb-5 border-b border-ink/10 pb-4"
            />
            <div className="flex-1">{children}</div>
            {footer && <div className="mt-5 border-t border-ink/10 pt-5 text-center">{footer}</div>}
        </Card>
    );
}
