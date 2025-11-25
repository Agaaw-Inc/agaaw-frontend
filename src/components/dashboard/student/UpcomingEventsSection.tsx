import SectionCard from "../layout/SectionCard";
import Button from "../common/Button";
import EventItem from "./EventItem";

interface EventsSectionProps {
  events: {
    title: string;
    date: string;
    type: "online" | "webinar" | "in-person";
  }[];
}

export default function UpcomingEventsSection({ events }: EventsSectionProps) {
  return (
    <SectionCard>
      {/* Title + Subtitle */}
      <h2 className="text-lg font-semibold text-codgray">Upcoming Events</h2>
      <p className="text-sm text-bombay mb-4">
        Don’t miss out on important sessions and opportunities
      </p>

      {/* Events List */}
      <div>
        {events.map((event, index) => (
          <EventItem
            key={index}
            title={event.title}
            date={event.date}
            type={event.type}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4">
        <Button variant="outline" fullWidth>
          View All Events
        </Button>
      </div>
    </SectionCard>
  );
}
