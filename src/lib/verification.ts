/**
 * Mentor identity verification. The phone number is write-only from the
 * mentor's side: it is sent on submit but the API never returns it to them.
 */

import { authFetch } from "./authFetch";

export type CredentialType = "university" | "company" | "organization";
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface VerificationDocument {
  id: string;
  kind: "id_card" | "supporting";
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface MyVerification {
  id: string;
  credentialType: CredentialType;
  professionalEmail: string;
  linkedinUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  documents: VerificationDocument[];
}

export interface VerificationInput {
  credentialType: CredentialType;
  professionalEmail: string;
  linkedinUrl: string;
  phoneNumber: string;
  /** Required on the first submission; optional when resubmitting. */
  idCard?: File | null;
  supportingDocs?: File[];
}

export const CREDENTIAL_TYPE_LABELS: Record<CredentialType, string> = {
  university: "University",
  company: "Company",
  organization: "Organization",
};

// Mirrors the API's limits so mistakes are caught before uploading.
export const VERIFICATION_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const VERIFICATION_MAX_SUPPORTING_DOCS = 5;
export const VERIFICATION_ACCEPT = "application/pdf,image/png,image/jpeg,image/webp";

function errorMessage(json: unknown, fallback: string): string {
  const msg = (json as { message?: unknown } | null)?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  return typeof msg === "string" && msg ? msg : fallback;
}

/** Null when the mentor hasn't submitted yet. */
export async function getMyVerification(): Promise<MyVerification | null> {
  const res = await authFetch("/mentor-verification/mine", { cache: "no-store" });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(errorMessage(json, "Failed to load verification status"));
  return json?.data ?? null;
}

export async function submitVerification(input: VerificationInput): Promise<MyVerification> {
  const form = new FormData();
  form.append("credentialType", input.credentialType);
  form.append("professionalEmail", input.professionalEmail);
  form.append("linkedinUrl", input.linkedinUrl);
  form.append("phoneNumber", input.phoneNumber);
  if (input.idCard) form.append("idCard", input.idCard);
  (input.supportingDocs ?? []).forEach((file) => form.append("supportingDocs", file));

  // No Content-Type header: the browser sets the multipart boundary itself.
  const res = await authFetch("/mentor-verification", { method: "POST", body: form });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 413) throw new Error("Each file must be 5 MB or smaller");
    throw new Error(errorMessage(json, "Failed to submit verification"));
  }
  return json.data;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
