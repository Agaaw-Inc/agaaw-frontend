import type { ComponentProps } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** "See all →" — the quiet text link used in section headers. */
export default function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={cn("group inline-flex items-center gap-1 text-sm font-semibold text-ink hover:underline", className)}>
      {children}
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
