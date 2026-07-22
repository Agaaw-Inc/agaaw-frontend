"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { DailyCall } from "@daily-co/daily-js";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { joinSession, getSessionDetail, type SessionDetail } from "@/lib/api";
import { getUserInfo } from "@/lib/auth";

const CONNECT_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
    ]);
}

export default function SessionCallPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const callFrameRef = useRef<DailyCall | null>(null);
    // React Strict Mode double-invokes effects in dev (mount → cleanup → mount
    // again) to surface exactly this kind of bug: without this guard, the
    // second invocation fired a second POST /sessions/:id/join for the same
    // session, racing the first and occasionally losing a Daily room-name
    // collision. This ref survives the simulated remount (same fiber) but
    // resets on a genuine unmount, so a real rejoin still works.
    const joinAttemptedIdRef = useRef<string | null>(null);

    const [session, setSession] = useState<SessionDetail | null>(null);
    const [status, setStatus] = useState<"joining" | "connected" | "error">("joining");
    const [error, setError] = useState<string | null>(null);
    // getUserInfo() reads localStorage, which doesn't exist during SSR — calling
    // it directly in render made the server always render the student href while
    // the client (which does have localStorage) could render the mentor one,
    // a hydration mismatch React explicitly won't patch up. Default to the
    // SSR value here, then correct it client-side once mounted.
    const [backHref, setBackHref] = useState("/dashboard/student/sessions");

    useEffect(() => {
        if (getUserInfo()?.role === "mentor") setBackHref("/dashboard/mentor/sessions");
    }, []);

    useEffect(() => {
        if (joinAttemptedIdRef.current === id) return;
        joinAttemptedIdRef.current = id;

        let cancelled = false;

        (async () => {
            try {
                const [detail, joinResult] = await withTimeout(
                    Promise.all([getSessionDetail(id), joinSession(id)]),
                    CONNECT_TIMEOUT_MS,
                    "Connecting is taking too long. Please check your connection and try again.",
                );
                if (cancelled) return;
                setSession(detail);

                const { default: Daily } = await import("@daily-co/daily-js");
                if (cancelled || !containerRef.current) return;

                const callFrame = Daily.createFrame(containerRef.current, {
                    showLeaveButton: true,
                    iframeStyle: { width: "100%", height: "100%", border: "0" },
                });
                callFrameRef.current = callFrame;

                callFrame.on("left-meeting", () => {
                    // Computed fresh rather than closing over `backHref` state —
                    // this handler is registered once per mount and wouldn't
                    // otherwise see the post-mount role-corrected value.
                    const href = getUserInfo()?.role === "mentor" ? "/dashboard/mentor/sessions" : "/dashboard/student/sessions";
                    router.push(href);
                });

                // Hand off to Daily's own UI once the frame exists, rather than
                // waiting for join() to fully resolve. Daily Prebuilt shows its
                // own pre-call screen (camera preview + a Join button) inside
                // the iframe before the call actually connects — our overlay
                // was covering that screen, so the user could see our spinner
                // but never Daily's UI underneath it, and could never click
                // through to actually join.
                if (!cancelled) setStatus("connected");
                await callFrame.join({ url: joinResult.roomUrl, token: joinResult.token });
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to join the session.");
                    setStatus("error");
                }
            }
        })();

        return () => {
            cancelled = true;
            callFrameRef.current?.destroy();
            callFrameRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <div className="fixed inset-0 bg-gray-950 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
                <Link
                    href={backHref}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Sessions
                </Link>
                <p className="text-sm font-semibold text-gray-300 truncate max-w-[50%]">
                    {session?.title || "Session Call"}
                </p>
            </div>

            <div className="flex-1 relative">
                {status === "joining" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-300">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-sm font-medium">Connecting to your session...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="text-white font-semibold">{error}</p>
                        <Link
                            href={backHref}
                            className="mt-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                        >
                            Back to Sessions
                        </Link>
                    </div>
                )}

                <div ref={containerRef} className="w-full h-full" />
            </div>
        </div>
    );
}
