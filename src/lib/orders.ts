/**
 * Paid orders, manual bKash/bank payments, and the mentor wallet.
 *
 * Money arrives from the API as strings ("1499.00") so no precision is lost
 * in transit; convert with Number() only for display.
 */

import { authFetch } from "./authFetch";

// ── Types ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "awaiting_quote"
  | "pending_payment"
  | "payment_submitted"
  | "payment_rejected"
  | "funded"
  | "in_progress"
  | "delivered"
  | "disputed"
  | "released"
  | "refund_pending"
  | "refunded"
  | "cancelled";

export type PaymentMethod = "bkash" | "bank";
export type PayoutMethod = "bkash" | "nagad" | "bank";

export interface OrderParty {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface OrderDeliverable {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  /** 1 = original delivery, 2+ = after an admin-requested revision. */
  round: number;
  uploadedAt: string;
}

export interface OrderDispute {
  id: string;
  round: number;
  /** Null when the system raised it (a missed revision deadline). */
  raisedById: string | null;
  reason: string;
  status: "open" | "resolved_release" | "resolved_refund" | "resolved_revision";
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  isCustom: boolean;
  title: string;
  description: string | null;
  connectionId: string;
  mentorServiceId: string | null;
  currency: string;
  amount: string | null;
  /** Only returned to the mentor and admins. */
  commissionRate: number | null;
  platformFee: string | null;
  mentorPayout: string | null;
  quoteNote: string | null;
  deliveryNote: string | null;
  declineReason: string | null;
  cancelReason: string | null;
  refundNote: string | null;
  createdAt: string;
  quotedAt: string | null;
  fundedAt: string | null;
  acceptedAt: string | null;
  deliveredAt: string | null;
  disputeDeadline: string | null;
  releasedAt: string | null;
  refundedAt: string | null;
  cancelledAt: string | null;
  revisionCount: number;
  maxRevisions: number;
  revisionDueAt: string | null;
  /** The admin's instructions for the revision in progress. */
  revisionNote: string | null;
  student: OrderParty;
  mentor: OrderParty;
  deliverables: OrderDeliverable[];
  latestPayment: {
    id: string;
    method: PaymentMethod;
    senderInfo: string;
    transactionId: string;
    hasScreenshot: boolean;
    status: "pending" | "verified" | "rejected";
    submittedAt: string;
    reviewedAt: string | null;
    rejectionReason: string | null;
  } | null;
  /** Latest dispute; `disputes` holds the full history, oldest first. */
  dispute: OrderDispute | null;
  disputes: OrderDispute[];
}

export interface OrderList {
  data: Order[];
  meta: { page: number; limit: number; total: number };
  counts: Partial<Record<OrderStatus, number>>;
}

export interface OrderPricingConfig {
  commissionRate: number;
  currency: string;
  disputeWindowHours: number;
  minPayout: string;
}

export interface PaymentInstructions {
  reference: string;
  title: string;
  amount: string;
  currency: string;
  bkash: { number: string; type: "personal" | "merchant" } | null;
  bank: { bankName: string; accountNo: string; accountName: string | null; branch: string | null } | null;
  instructions: string | null;
}

export interface PayoutDetails {
  accountNumber: string;
  accountName: string;
  bankName?: string | null;
  branchName?: string | null;
}

export interface Wallet {
  currency: string;
  availableBalance: string;
  totalEarned: string;
  pendingEarnings: string;
  pendingEarningsOrders: number;
  pendingPayoutAmount: string;
  minPayout: string;
  payoutMethod: PayoutMethod | null;
  payoutDetails: PayoutDetails | null;
  kycVerified: boolean;
  detailsUpdatedAt: string | null;
  canRequestPayout: boolean;
  blockedReason: string | null;
}

export interface WalletTransaction {
  id: string;
  type: "credit_released" | "debit_payout" | "credit_payout_reversal";
  amount: string;
  balanceAfter: string;
  createdAt: string;
  order: { id: string; reference: string; title: string } | null;
  payoutId: string | null;
}

export interface Payout {
  id: string;
  amount: string;
  method: PayoutMethod;
  payoutDetails: PayoutDetails & { method?: PayoutMethod };
  status: "pending" | "completed" | "failed";
  requestedAt: string;
  processedAt: string | null;
  transferReference: string | null;
  adminNote: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

// ── Display helpers ───────────────────────────────────────────────────────

/** "৳1,499" or "৳1,349.10" — drops ".00" to keep whole-taka prices clean. */
export function formatTaka(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  const hasPaisa = Math.round(n * 100) % 100 !== 0;
  return `৳${n.toLocaleString("en-US", {
    minimumFractionDigits: hasPaisa ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Mirrors the backend's splitPrice so a mentor sees their take-home while
 * typing a price. The server recomputes it authoritatively — this is only a
 * preview. Works in whole paisa (integers) to avoid floating-point drift.
 */
export function previewSplit(amount: number, commissionRate: number) {
  const paisa = Math.round((Number(amount) || 0) * 100);
  const feePaisa = Math.round(paisa * commissionRate);
  return { platformFee: feePaisa / 100, mentorPayout: (paisa - feePaisa) / 100 };
}

export const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  awaiting_quote: { label: "Awaiting quote", className: "bg-amber-50 text-amber-700 border-amber-200" },
  pending_payment: { label: "Awaiting payment", className: "bg-amber-50 text-amber-700 border-amber-200" },
  payment_submitted: { label: "Verifying payment", className: "bg-blue-50 text-blue-700 border-blue-200" },
  payment_rejected: { label: "Payment not verified", className: "bg-red-50 text-red-700 border-red-200" },
  funded: { label: "Paid — awaiting mentor", className: "bg-teal-50 text-teal-700 border-teal-200" },
  in_progress: { label: "In progress", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", className: "bg-violet-50 text-violet-700 border-violet-200" },
  disputed: { label: "Disputed", className: "bg-red-50 text-red-700 border-red-200" },
  released: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  refund_pending: { label: "Refund pending", className: "bg-orange-50 text-orange-700 border-orange-200" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-600 border-gray-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export const PAYOUT_METHOD_LABEL: Record<PayoutMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  bank: "Bank transfer",
};

/** Tabs used by both order list pages. */
export const ORDER_TABS: { key: string; label: string; statuses: OrderStatus[] }[] = [
  {
    key: "active",
    label: "Active",
    statuses: ["awaiting_quote", "pending_payment", "payment_submitted", "payment_rejected", "funded", "in_progress", "delivered", "disputed", "refund_pending"],
  },
  { key: "completed", label: "Completed", statuses: ["released"] },
  { key: "closed", label: "Cancelled & refunded", statuses: ["cancelled", "refunded"] },
];

// ── Request plumbing ──────────────────────────────────────────────────────

async function call<T>(path: string, init: Parameters<typeof authFetch>[1] = {}): Promise<T> {
  const res = await authFetch(path, { cache: "no-store", ...init });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.message;
    const text = Array.isArray(msg) ? msg.join(", ") : msg || `Request failed (${res.status})`;
    // Backend errors are prefixed with a code ("DUPLICATE_TRANSACTION_ID: …");
    // users only need the sentence.
    throw new Error(String(text).replace(/^[A-Z_]+:\s*/, ""));
  }
  return (json.data ?? json) as T;
}

const jsonBody = (body: unknown) => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// ── Orders ────────────────────────────────────────────────────────────────

export const getOrderConfig = () => call<OrderPricingConfig>("/orders/config");

export const listOrders = (params: { status?: OrderStatus[]; page?: number; limit?: number } = {}) => {
  const qs = new URLSearchParams();
  if (params.status?.length) qs.set("status", params.status.join(","));
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const q = qs.toString();
  return call<OrderList>(`/orders${q ? `?${q}` : ""}`);
};

export const getOrder = (id: string) => call<Order>(`/orders/${id}`);

export const createOrder = (
  body:
    | { connectionId: string; mentorServiceId: string }
    | { connectionId: string; customTitle: string; customDescription: string },
) => call<Order>("/orders", { method: "POST", ...jsonBody(body) });

export const quoteOrder = (id: string, amount: number, note?: string) =>
  call<Order>(`/orders/${id}/quote`, { method: "PATCH", ...jsonBody({ amount, note: note || undefined }) });

export const declineQuote = (id: string, reason: string) =>
  call<Order>(`/orders/${id}/decline-quote`, { method: "PATCH", ...jsonBody({ reason }) });

export const cancelOrder = (id: string, reason?: string) =>
  call<Order>(`/orders/${id}/cancel`, { method: "PATCH", ...jsonBody(reason ? { reason } : {}) });

export const acceptOrder = (id: string) => call<Order>(`/orders/${id}/accept`, { method: "PATCH" });

export const declineOrder = (id: string, reason: string) =>
  call<Order>(`/orders/${id}/decline`, { method: "PATCH", ...jsonBody({ reason }) });

export const deliverOrder = (id: string, note?: string) =>
  call<Order>(`/orders/${id}/deliver`, { method: "PATCH", ...jsonBody(note ? { note } : {}) });

export const confirmReceived = (id: string) =>
  call<Order>(`/orders/${id}/confirm-received`, { method: "PATCH" });

export const disputeOrder = (id: string, reason: string) =>
  call<Order>(`/orders/${id}/dispute`, { method: "PATCH", ...jsonBody({ reason }) });

export const getPaymentInstructions = (id: string) =>
  call<PaymentInstructions>(`/orders/${id}/payment-instructions`);

export function submitPayment(
  id: string,
  data: { method: PaymentMethod; senderInfo: string; transactionId: string; screenshot?: File | null },
) {
  const form = new FormData();
  form.append("method", data.method);
  form.append("senderInfo", data.senderInfo);
  form.append("transactionId", data.transactionId);
  if (data.screenshot) form.append("screenshot", data.screenshot);
  return call<Order>(`/orders/${id}/payment-submissions`, { method: "POST", body: form });
}

export function uploadDeliverable(id: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return call<OrderDeliverable>(`/orders/${id}/deliverables`, { method: "POST", body: form });
}

export const removeDeliverable = (id: string, deliverableId: string) =>
  call<{ id: string }>(`/orders/${id}/deliverables/${deliverableId}`, { method: "DELETE" });

/**
 * Files are private: they're fetched with the user's token and handed to the
 * browser as a temporary blob URL, never as a shareable link.
 */
export async function downloadDeliverable(orderId: string, file: OrderDeliverable) {
  const res = await authFetch(`/orders/${orderId}/deliverables/${file.id}/download`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || "Download failed");
  }
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = file.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// ── Wallet ────────────────────────────────────────────────────────────────

export const getWallet = () => call<Wallet>("/wallet");

export const getWalletTransactions = (page = 1) =>
  call<Paginated<WalletTransaction>>(`/wallet/transactions?page=${page}&limit=20`);

export const getPayouts = (page = 1) => call<Paginated<Payout>>(`/wallet/payouts?page=${page}&limit=20`);

export const updatePayoutDetails = (body: {
  method: PayoutMethod;
  accountNumber: string;
  accountName: string;
  bankName?: string;
  branchName?: string;
}) => call<Wallet>("/wallet/payout-details", { method: "PATCH", ...jsonBody(body) });

export const requestPayout = () => call<Wallet>("/wallet/payouts", { method: "POST" });
