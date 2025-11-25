import { CheckCircle, Circle } from "lucide-react";

interface ChecklistItemProps {
  label: string;
  checked: boolean;
  className?: string;
}

export default function ChecklistItem({ label, checked, className }: ChecklistItemProps) {
  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      {checked ? (
        <CheckCircle className="h-5 w-5 text-elm" />
      ) : (
        <Circle className="h-5 w-5 text-bombay" />
      )}

      <span className={`text-sm ${checked ? "text-codgray" : "text-bombay"}`}>
        {label}
      </span>
    </div>
  );
}
