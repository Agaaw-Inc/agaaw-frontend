"use client";

import { ReactNode } from "react";

interface SectionTileProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SectionTile({
  title,
  description,
  icon,
  className = "",
  onClick,
}: SectionTileProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full p-5 rounded-xl border border-bombay/40 bg-light 
        shadow-sm cursor-pointer select-none
        hover:shadow-md hover:bg-bombay/10 transition
        ${className}
      `}
    >
      <div className="flex items-start space-x-4">

        {/* Icon */}
        {icon && <div className="text-codgray text-xl">{icon}</div>}

        {/* Texts */}
        <div>
          <h3 className="text-base font-semibold text-codgray">{title}</h3>

          {description && (
            <p className="text-sm text-bombay mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
