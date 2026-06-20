import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconBg?: string; // optional tailwind class
}

export default function MetricCard({ icon: Icon, label, value, iconBg }: MetricCardProps) {
    return (
        <div className="flex items-center gap-4 bg-light border border-bombay/30 rounded-xl p-4 shadow-sm w-full">
            {/* Icon Container */}
            <div
                className={`h-12 w-12 flex items-center justify-center rounded-lg ${iconBg || "bg-elm-light/10"
                    }`}
            >
                <Icon className="text-elm-dark h-6 w-6" />
            </div>

            {/* Text Info */}
            <div>
                <p className="text-sm text-bombay">{label}</p>
                <p className="text-xl font-semibold text-codgray">{value}</p>
            </div>
        </div>
    );
}
