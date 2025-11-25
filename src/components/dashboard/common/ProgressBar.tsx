interface ProgressBarProps {
  value: number;             // 0–100
  color?: string;            // optional override
  background?: string;       // optional override
  className?: string;
}

export default function ProgressBar({
  value,
  color = "bg-elm",                // default brand color
  background = "bg-bombay/30",     // subtle light gray background
  className,
}: ProgressBarProps) {
  return (
    <div className={`w-full h-2 ${background} rounded-full overflow-hidden ${className || ""}`}>
      <div
        className={`${color} h-full rounded-full transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
