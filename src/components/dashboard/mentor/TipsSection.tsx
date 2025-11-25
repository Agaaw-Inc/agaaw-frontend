import SideCardContainer from "../common/SideCardContainer";

interface TipsSectionProps {
  tips: string[];
}

export default function TipsSection({ tips }: TipsSectionProps) {
  return (
    <SideCardContainer
      title="Quick Tips"
      subtitle="Improve your mentoring impact"
    >
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            {/* Bullet */}
            <span className="mt-1 h-2 w-2 rounded-full bg-elm" />

            {/* Text */}
            <p className="text-sm text-codgray">{tip}</p>
          </li>
        ))}
      </ul>
    </SideCardContainer>
  );
}
