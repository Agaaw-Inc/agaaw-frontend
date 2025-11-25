import SideCardContainer from "../common/SideCardContainer";
import ProgressBar from "../common/ProgressBar";

interface MentorProfileCompletionSectionProps {
  progress: number;
  checklist: {
    label: string;
    checked: boolean;
  }[];
}

export default function MentorProfileCompletionSection({
  progress,
  checklist,
}: MentorProfileCompletionSectionProps) {
  return (
    <SideCardContainer
      title="Profile Completion"
      subtitle="Complete your profile to attract more students"
      className="mb-6"
    >
      {/* Progress Bar */}
      <div>
        <p className="text-sm text-codgray mb-1">Overall Progress</p>
        <ProgressBar value={progress} />
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-3">
        {checklist.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span
              className={`text-sm ${
                item.checked ? "text-codgray" : "text-bombay"
              }`}
            >
              {item.label}
            </span>

            {item.checked && (
              <span className="text-xs text-elm font-medium">Complete</span>
            )}
          </div>
        ))}
      </div>
    </SideCardContainer>
  );
}
