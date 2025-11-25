import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg?: string;        // optional Tailwind class for icon background
  badge?: number;         // optional number badge (e.g. unread messages)
  onClick?: () => void;   // UI only
}

export default function ActionCard({
  icon: Icon,
  title,
  description,
  iconBg,
  badge,
  onClick,
}: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-light border border-bombay/30 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-elm-light/5 transition-colors"
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3">
        {/* Icon wrapper */}
        <div
          className={`h-10 w-10 flex items-center justify-center rounded-lg ${
            iconBg || "bg-elm-light/10"
          }`}
        >
          <Icon className="h-5 w-5 text-elm-dark" />
        </div>

        {/* Text Content */}
        <div>
          <p className="text-sm font-medium text-codgray">{title}</p>
          <p className="text-xs text-bombay">{description}</p>
        </div>
      </div>

      {/* Right: Optional Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="bg-elm-dark text-light text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}
