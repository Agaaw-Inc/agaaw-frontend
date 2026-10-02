"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    BadgeCheck,
    Clock,
    FileText,
    Link2,
    Loader2,
    Lock,
    Mail,
    ShieldCheck,
    UploadCloud,
    X,
    XCircle,
} from "lucide-react";
import Footer from "@/components/landing/Footer";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import {
    CREDENTIAL_TYPE_LABELS,
    formatFileSize,
    getMyVerification,
    submitVerification,
    VERIFICATION_ACCEPT,
    VERIFICATION_MAX_FILE_BYTES,
    VERIFICATION_MAX_SUPPORTING_DOCS,
    type CredentialType,
    type MyVerification,
} from "@/lib/verification";

const ACCEPTED_TYPES = VERIFICATION_ACCEPT.split(",");

/** Returns an error message, or null if the file is acceptable. */
function checkFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) return `${file.name}: only PDF, JPG, PNG or WEBP files are accepted.`;
    if (file.size > VERIFICATION_MAX_FILE_BYTES) return `${file.name} is larger than 5 MB.`;
    return null;
}

export default function MentorVerificationPage() {
    const { toast, showToast, hideToast } = useToast();
    const [verification, setVerification] = useState<MyVerification | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
            setVerification(await getMyVerification());
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Couldn't load your verification status");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    const status = verification?.status;
    // A first-timer and a rejected mentor see the form straight away; a pending
    // mentor can choose to update; an approved mentor can't change anything.
    const showForm = !verification || status === "rejected" || (status === "pending" && isEditing);

    return (
        <div className="min-h-screen bg-paper">
            <Toast toast={toast} onHide={hideToast} />
            <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Verification</h1>
                    <p className="text-gray-600 mt-1">
                        Show students you are who you say you are. Agaaw&apos;s team reviews every submission by hand.
                    </p>
                </div>

                {loadError && (
                    <div className="flex items-center justify-between gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
                        <span className="flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{loadError}</span>
                        <button onClick={() => void load()} className="font-semibold underline">Try again</button>
                    </div>
                )}

                {verification && <StatusCard verification={verification} />}

                {status === "pending" && !isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-semibold text-teal-700 hover:text-teal-800"
                    >
                        Made a mistake? Update your submission
                    </button>
                )}

                {showForm && !loadError && (
                    <VerificationForm
                        existing={verification}
                        onCancel={status === "pending" ? () => setIsEditing(false) : undefined}
                        onSubmitted={(saved) => {
                            setVerification(saved);
                            setIsEditing(false);
                            showToast("Submitted — we'll review it soon");
                        }}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}

function StatusCard({ verification }: { verification: MyVerification }) {
    const { status } = verification;
    const meta = {
        pending: {
            icon: Clock,
            title: "Under review",
            body: "Thanks — our team is checking your documents. We'll notify you when it's done.",
            className: "bg-amber-50 border-amber-200 text-amber-800",
        },
        approved: {
            icon: BadgeCheck,
            title: "Verified",
            body: "Your identity and credentials have been confirmed.",
            className: "bg-emerald-50 border-emerald-200 text-emerald-800",
        },
        rejected: {
            icon: XCircle,
            title: "Changes needed",
            body: "Your submission wasn't approved. Fix the issue below and resubmit.",
            className: "bg-red-50 border-red-200 text-red-800",
        },
    }[status];
    const Icon = meta.icon;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`flex items-start gap-3 border-b px-6 py-4 ${meta.className}`}>
                <Icon size={22} className="shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold">{meta.title}</p>
                    <p className="text-sm mt-0.5">{meta.body}</p>
                    {status === "rejected" && verification.rejectionReason && (
                        <p className="text-sm mt-2">
                            <span className="font-semibold">Reason:</span> {verification.rejectionReason}
                        </p>
                    )}
                </div>
            </div>
            <dl className="px-6 py-5 grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Credential</dt>
                    <dd className="mt-1 text-gray-900">{CREDENTIAL_TYPE_LABELS[verification.credentialType]}</dd>
                </div>
                <div>
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</dt>
                    <dd className="mt-1 text-gray-900">{new Date(verification.submittedAt).toLocaleDateString()}</dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional email</dt>
                    <dd className="mt-1 text-gray-900 truncate">{verification.professionalEmail}</dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">LinkedIn</dt>
                    <dd className="mt-1 truncate">
                        <a href={verification.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                            {verification.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                        </a>
                    </dd>
                </div>
                <div className="sm:col-span-2">
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">Documents</dt>
                    <dd className="mt-2 space-y-1.5">
                        {verification.documents.map((doc) => (
                            <p key={doc.id} className="flex items-center gap-2 text-gray-700">
                                <FileText size={14} className="text-gray-400 shrink-0" />
                                <span className="truncate">{doc.fileName}</span>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {doc.kind === "id_card" ? "ID card" : "Supporting"} · {formatFileSize(doc.sizeBytes)}
                                </span>
                            </p>
                        ))}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

function VerificationForm({
    existing,
    onCancel,
    onSubmitted,
}: {
    existing: MyVerification | null;
    onCancel?: () => void;
    onSubmitted: (saved: MyVerification) => void;
}) {
    const hasIdCard = !!existing?.documents.some((d) => d.kind === "id_card");
    const [credentialType, setCredentialType] = useState<CredentialType>(existing?.credentialType ?? "university");
    const [professionalEmail, setProfessionalEmail] = useState(existing?.professionalEmail ?? "");
    const [linkedinUrl, setLinkedinUrl] = useState(existing?.linkedinUrl ?? "");
    // Never pre-filled: the API doesn't send the number back, even to its owner.
    const [phoneNumber, setPhoneNumber] = useState("");
    const [idCard, setIdCard] = useState<File | null>(null);
    const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const idInputRef = useRef<HTMLInputElement>(null);
    const docsInputRef = useRef<HTMLInputElement>(null);

    const pickIdCard = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow picking the same file again after removing it
        if (!file) return;
        const problem = checkFile(file);
        if (problem) return setError(problem);
        setError(null);
        setIdCard(file);
    };

    const pickSupportingDocs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        const problem = files.map(checkFile).find(Boolean);
        if (problem) return setError(problem);
        const next = [...supportingDocs, ...files];
        if (next.length > VERIFICATION_MAX_SUPPORTING_DOCS) {
            return setError(`You can attach up to ${VERIFICATION_MAX_SUPPORTING_DOCS} supporting documents.`);
        }
        setError(null);
        setSupportingDocs(next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idCard && !hasIdCard) return setError("Upload a photo or scan of your ID card.");
        setIsSubmitting(true);
        setError(null);
        try {
            const saved = await submitVerification({
                credentialType,
                professionalEmail: professionalEmail.trim(),
                linkedinUrl: linkedinUrl.trim(),
                phoneNumber: phoneNumber.trim(),
                idCard,
                supportingDocs,
            });
            onSubmitted(saved);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50";
    const labelClass = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
    const helpClass = "text-xs text-gray-500 mt-1.5";

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">{existing ? "Update your submission" : "Submit for verification"}</h2>
            </div>

            <div>
                <label htmlFor="v-credential" className={labelClass}>I&apos;m verifying through my</label>
                <select
                    id="v-credential"
                    value={credentialType}
                    onChange={(e) => setCredentialType(e.target.value as CredentialType)}
                    disabled={isSubmitting}
                    className={inputClass}
                >
                    {(Object.keys(CREDENTIAL_TYPE_LABELS) as CredentialType[]).map((type) => (
                        <option key={type} value={type}>{CREDENTIAL_TYPE_LABELS[type]}</option>
                    ))}
                </select>
            </div>

            {/* ID card */}
            <div>
                <span className={labelClass}>ID card {hasIdCard && <span className="normal-case font-medium text-gray-400">(optional — keeps your current one)</span>}</span>
                <input ref={idInputRef} type="file" accept={VERIFICATION_ACCEPT} onChange={pickIdCard} className="sr-only" aria-label="ID card" />
                {idCard ? (
                    <FileRow file={idCard} onRemove={() => setIdCard(null)} disabled={isSubmitting} />
                ) : (
                    <button
                        type="button"
                        onClick={() => idInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-6 text-sm text-gray-600 hover:border-teal-400 hover:bg-teal-50/40 transition-colors disabled:opacity-50"
                    >
                        <UploadCloud size={22} className="text-teal-600" />
                        <span className="font-semibold">{hasIdCard ? "Replace ID card" : "Upload ID card"}</span>
                        <span className="text-xs text-gray-400">University, employee or national ID · PDF, JPG, PNG or WEBP · max 5 MB</span>
                    </button>
                )}
            </div>

            {/* Supporting documents */}
            <div>
                <span className={labelClass}>
                    Supporting documents <span className="normal-case font-medium text-gray-400">(optional, up to {VERIFICATION_MAX_SUPPORTING_DOCS})</span>
                </span>
                <input ref={docsInputRef} type="file" accept={VERIFICATION_ACCEPT} multiple onChange={pickSupportingDocs} className="sr-only" aria-label="Supporting documents" />
                <div className="space-y-2">
                    {supportingDocs.map((file, i) => (
                        <FileRow
                            key={`${file.name}-${i}`}
                            file={file}
                            disabled={isSubmitting}
                            onRemove={() => setSupportingDocs((docs) => docs.filter((_, j) => j !== i))}
                        />
                    ))}
                    {supportingDocs.length < VERIFICATION_MAX_SUPPORTING_DOCS && (
                        <button
                            type="button"
                            onClick={() => docsInputRef.current?.click()}
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                            <UploadCloud size={14} /> Add documents
                        </button>
                    )}
                </div>
                <p className={helpClass}>
                    An offer letter, enrolment certificate or employment letter helps us verify you faster.
                    {existing?.documents.some((d) => d.kind === "supporting") && " Adding new ones replaces the ones you sent before."}
                </p>
            </div>

            <div>
                <label htmlFor="v-email" className={labelClass}>Professional email</label>
                <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        id="v-email"
                        type="email"
                        value={professionalEmail}
                        onChange={(e) => setProfessionalEmail(e.target.value)}
                        placeholder="you@university.edu"
                        required
                        disabled={isSubmitting}
                        className={`${inputClass} pl-10`}
                    />
                </div>
                <p className={helpClass}>Use your university or company email — personal addresses like Gmail aren&apos;t accepted.</p>
            </div>

            <div>
                <label htmlFor="v-linkedin" className={labelClass}>LinkedIn profile</label>
                <div className="relative">
                    <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        id="v-linkedin"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://www.linkedin.com/in/your-name"
                        required
                        disabled={isSubmitting}
                        className={`${inputClass} pl-10`}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="v-phone" className={labelClass}>Phone number</label>
                <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        id="v-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        required
                        autoComplete="tel"
                        disabled={isSubmitting}
                        className={`${inputClass} pl-10`}
                    />
                </div>
                <p className={helpClass}>
                    Only visible to Agaaw admins, never shown to students.
                    {existing && " For your privacy we never show it back — please enter it again."}
                </p>
            </div>

            {error && (
                <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Submit for review"}
                </button>
            </div>
        </form>
    );
}

function FileRow({ file, onRemove, disabled }: { file: File; onRemove: () => void; disabled: boolean }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <span className="flex items-center gap-2 min-w-0 text-sm text-gray-700">
                <FileText size={16} className="text-teal-600 shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-gray-400 shrink-0">{formatFileSize(file.size)}</span>
            </span>
            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
            >
                <X size={14} />
            </button>
        </div>
    );
}
