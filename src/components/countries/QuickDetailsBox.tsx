"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Banknote, ChevronDown, Coins, Languages } from "lucide-react";

interface QuickDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function QuickDetailItem({ icon, label, value }: QuickDetailItemProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = value.length > 30;

  return (
    <li className="flex items-start gap-4">
      <div className="bg-white/10 p-2.5 rounded-xl shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">
          {label}
        </p>
        <div className="relative">
          <p
            className={`max-w-full font-medium text-white transition-all duration-300 ease-in-out ${
              expanded ? "whitespace-normal break-words" : "truncate"
            }`}
            title={!expanded && isLong ? value : undefined}
          >
            {value}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-teal-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
              aria-expanded={expanded}
            >
              {expanded ? "See less" : "See more"}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

interface QuickDetailsBoxProps {
  tuitionCost?: string | null;
  currency?: string | null;
  language?: string | null;
}

export default function QuickDetailsBox({
  tuitionCost,
  currency,
  language,
}: QuickDetailsBoxProps) {
  const details: Array<{
    icon: ReactNode;
    label: string;
    value?: string | null;
  }> = [
    {
      icon: <Banknote className="w-5 h-5 text-teal-200" />,
      label: "Tuition Cost",
      value: tuitionCost,
    },
    {
      icon: <Coins className="w-5 h-5 text-teal-200" />,
      label: "Currency",
      value: currency,
    },
    {
      icon: <Languages className="w-5 h-5 text-teal-200" />,
      label: "Language",
      value: language,
    },
  ];

  const visibleDetails = details.flatMap((detail) => {
    const value = detail.value?.trim();

    return value ? [{ ...detail, value }] : [];
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-[320px] shrink-0 mt-4 md:mt-0 shadow-xl shadow-teal-950/20">
      <h3 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-5">
        Quick Details
      </h3>
      <ul className="space-y-5">
        {visibleDetails.map((detail) => (
          <QuickDetailItem
            key={detail.label}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </ul>
    </div>
  );
}
