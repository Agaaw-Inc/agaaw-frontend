import SectionCard from "../layout/SectionCard";
import Button from "../common/Button";
import MessageItem from "./MessageItem";

interface MessagesSectionProps {
  messages: {
    name: string;
    message: string;
    time: string;
    isNew?: boolean;
  }[];
}

export default function MessagesSection({ messages }: MessagesSectionProps) {
  return (
    <SectionCard>
      {/* Title */}
      <h2 className="text-lg font-semibold text-codgray">Recent Messages</h2>
      <p className="text-sm text-bombay mb-4">
        Student inquiries awaiting response
      </p>

      {/* Message List */}
      <div>
        {messages.map((msg, index) => (
          <MessageItem
            key={index}
            name={msg.name}
            message={msg.message}
            time={msg.time}
            isNew={msg.isNew}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4">
        <Button variant="outline" fullWidth>
          View All Messages
        </Button>
      </div>
    </SectionCard>
  );
}
