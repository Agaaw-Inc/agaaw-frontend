import type { ComponentType, ReactNode } from "react";

interface SectionCardProps {
    title: string;
    description?: string;
    icon?: ComponentType<{ size?: number; className?: string }>;
    iconClassName?: string;
    badge?: ReactNode;
    actions?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function SectionCard({
    title,
    description,
    icon: Icon,
    iconClassName = "bg-teal-50 text-teal-600",
    badge,
    actions,
    footer,
    children,
    className = "",
}: SectionCardProps) {
    return (
        <section className={`bg-white rounded-2xl border border-gray-100 ambient-shadow p-6 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                    {Icon && (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}>
                            <Icon size={18} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
                            {badge}
                        </div>
                        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
                    </div>
                </div>
                {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
            </div>

            <div className="flex-1">{children}</div>

            {footer && <div className="mt-5 pt-5 border-t border-gray-100 text-center">{footer}</div>}
        </section>
    );
}
