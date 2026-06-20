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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
                {sub && <p className="text-xs text-teal-600 font-medium mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}