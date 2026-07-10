import type { ComponentType } from "react";

type StatCardProps = {
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
    sub?: string;
    color: string;
};

export default function StatCard({ icon: Icon, label, value, sub, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 ambient-shadow p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color} shadow-sm`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p>
                <p className="text-sm text-gray-500 truncate">{label}</p>
                {sub && <p className="text-xs text-teal-600 font-semibold mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}
