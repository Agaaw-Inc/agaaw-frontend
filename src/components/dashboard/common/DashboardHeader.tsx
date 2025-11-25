interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-codgray">{title}</h1>
      <p className="text-bombay mt-1">{subtitle}</p>
    </div>
  );
}
