import SideCardContainer from "../common/SideCardContainer";
import ProgressBar from "../common/ProgressBar";
import ChecklistItem from "../common/ChecklistItem";
import Button from "../common/Button";

interface StudentProfileProgressSectionProps {
  progress: number;
  checklist: {
    label: string;
    checked: boolean;
  }[];
}

export default function StudentProfileProgressSection({
  progress,
  checklist,
}: StudentProfileProgressSectionProps) {
  return (
    <SideCardContainer
      title="Your Progress"
      subtitle="Complete your profile to get better recommendations"
    >
      {/* Progress Bar */}
      <ProgressBar value={progress} />

      {/* Checklist */}
      <div className="mt-4 space-y-3">
        {checklist.map((item, index) => (
          <ChecklistItem 
            key={index} 
            label={item.label} 
            checked={item.checked} 
          />
        ))}
      </div>

      {/* Complete Profile Button */}
      <div className="mt-5">
        <Button fullWidth>Complete Profile</Button>
      </div>
    </SideCardContainer>
  );
}
