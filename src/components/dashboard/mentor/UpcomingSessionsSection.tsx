import SectionCard from "../layout/SectionCard";
import Button from "../common/Button";
import SessionItem from "./SessionItem";

interface UpcomingSessionsSectionProps {
  sessions: {
    student: string;
    title: string;
    datetime: string;
  }[];
}

export default function UpcomingSessionsSection({
  sessions,
}: UpcomingSessionsSectionProps) {
  return (
    <SectionCard>
      {/* Title + Subtitle */}
      <h2 className="text-lg font-semibold text-codgray">Upcoming Sessions</h2>
      <p className="text-sm text-bombay mb-4">
        Your scheduled consultations
      </p>

      {/* Sessions List */}
      <div>
        {sessions.map((session, index) => (
          <SessionItem
            key={index}
            student={session.student}
            title={session.title}
            datetime={session.datetime}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4">
        <Button variant="outline" fullWidth>
          View All Sessions
        </Button>
      </div>
    </SectionCard>
  );
}
