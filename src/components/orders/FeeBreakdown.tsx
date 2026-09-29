import { formatTaka } from "@/lib/orders";

interface FeeBreakdownProps {
    amount: string | number;
    platformFee: string | number;
    mentorPayout: string | number;
    commissionRate: number;
    compact?: boolean;
}

/** What the student pays → Agaaw's cut → what the mentor takes home. */
export default function FeeBreakdown({ amount, platformFee, mentorPayout, commissionRate, compact }: FeeBreakdownProps) {
    const pct = Math.round(commissionRate * 100);

    if (compact) {
        return (
            <p className="text-xs text-gray-500">
                Student pays {formatTaka(amount)} · Agaaw fee ({pct}%) {formatTaka(platformFee)} ·{" "}
                <span className="font-bold text-teal-700">You get {formatTaka(mentorPayout)}</span>
            </p>
        );
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm space-y-2">
            <div className="flex justify-between text-gray-600">
                <span>Student pays</span>
                <span className="font-semibold text-gray-900">{formatTaka(amount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
                <span>Agaaw platform fee ({pct}%)</span>
                <span className="font-semibold text-gray-900">− {formatTaka(platformFee)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-bold text-gray-900">You receive</span>
                <span className="font-extrabold text-teal-700">{formatTaka(mentorPayout)}</span>
            </div>
        </div>
    );
}
