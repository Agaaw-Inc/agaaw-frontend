import SideCardContainer from "../common/SideCardContainer";
import ProgressBar from "../common/ProgressBar";

interface PerformanceMetric {
  label: string;
  value: number;
}

interface PerformanceSectionProps {
  metrics: PerformanceMetric[];
}

export default function PerformanceSection({ metrics }: PerformanceSectionProps) {
  return (
    <SideCardContainer
      title="Performance"
      subtitle="Your engagement analytics for this month"
    >
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            {/* Label + Value */}
            <div className="flex justify-between mb-1">
              <span className="text-sm text-codgray">{metric.label}</span>
              <span className="text-sm font-medium text-codgray">{metric.value}%</span>
            </div>

            {/* Progress bar */}
            <ProgressBar value={metric.value} />
          </div>
        ))}
      </div>
    </SideCardContainer>
  );
}
