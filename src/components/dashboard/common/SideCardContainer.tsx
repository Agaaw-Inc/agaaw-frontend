interface SideCardContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SideCardContainer({
  title,
  subtitle,
  children,
  className,
}: SideCardContainerProps) {
  return (
    <div
      className={`bg-light border border-bombay/30 rounded-xl shadow-sm p-5 w-full ${className || ""}`}
    >
      {/* Title */}
      <h3 className="text-codgray font-semibold text-base">{title}</h3>

      {/* Subtitle */}
      {subtitle && <p className="text-sm text-bombay mt-1">{subtitle}</p>}

      {/* Content */}
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}
