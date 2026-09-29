import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatTileProps {
    label: string;
    value: string;
    /** One line of context under the number. */
    sub?: string;
    icon?: LucideIcon;
    /** The dashboard's lead number gets the accent treatment. */
    accent?: boolean;
    /** Makes the whole tile a link (e.g. to the queue that needs action). */
    href?: string;
    /** Draws attention when something is waiting on an admin. */
    attention?: boolean;
    loading?: boolean;
}

export default function StatTile({ label, value, sub, icon: Icon, accent, href, attention, loading }: StatTileProps) {
    const tone = accent
        ? "bg-teal-700 border-teal-800 text-white"
        : attention
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-gray-100";

    const body = (
        <div className={`h-full rounded-2xl border p-4 sm:p-5 shadow-sm transition-shadow ${tone} ${href ? "hover:shadow-md" : ""}`}>
            <div className={`flex items-start gap-2 text-xs font-semibold uppercase tracking-wide leading-tight ${accent ? "text-teal-100" : "text-gray-500"}`}>
                {Icon && <Icon size={14} className="shrink-0 mt-px" />}
                <span>{label}</span>
            </div>
            {loading ? (
                <div className={`mt-3 h-7 w-24 rounded animate-pulse ${accent ? "bg-teal-600" : "bg-gray-100"}`} />
            ) : (
                <p className={`mt-2 text-xl sm:text-2xl font-bold break-words ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
            )}
            {sub && !loading && <p className={`mt-1 text-xs ${accent ? "text-teal-100" : "text-gray-500"}`}>{sub}</p>}
        </div>
    );

    return href ? (
        <Link href={href} className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
            {body}
        </Link>
    ) : (
        body
    );
}
