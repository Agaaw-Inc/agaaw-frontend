import { STATUS_META, type OrderStatus } from "@/lib/orders";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const meta = STATUS_META[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${meta.className}`}>
            {meta.label}
        </span>
    );
}
