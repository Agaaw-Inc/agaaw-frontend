interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={`w-full bg-light border border-bombay/30 rounded-xl shadow-sm p-6 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
