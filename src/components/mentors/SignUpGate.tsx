"use client";

import { Check, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

const UNLOCKS = [
  "Every mentor's full story — where they studied, and how they got there",
  "The services they offer, with prices in taka",
  "Reviews from students they've helped",
  "Sending a mentorship request and messaging them",
];

/**
 * What a logged-out visitor sees where mentor details need an account (the
 * directory, a mentor's profile): what an account unlocks, and a way back
 * here after signing up.
 */
export default function SignUpGate({ title, returnTo }: { title: string; returnTo: string }) {
  const login = `/login?redirect=${encodeURIComponent(returnTo)}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-maroon">
        <Lock size={13} /> Members only
      </span>
      <SectionHeading className="mt-4" title={title} />
      <ul className="mt-6 space-y-3">
        {UNLOCKS.map((item) => (
          <li key={item} className="flex gap-3 text-ink-soft">
            <Check size={18} className="mt-0.5 shrink-0 text-elm" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/register/student">Create free account</ButtonLink>
        <ButtonLink href={login} variant="outline">
          I already have one
        </ButtonLink>
      </div>
      <p className="mt-4 text-sm text-ink-soft">Signing up is free. You only pay when you order a service.</p>
    </div>
  );
}
