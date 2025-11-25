import Button from "../common/Button";
import { Clock } from "lucide-react";

interface MessageItemProps {
  name: string;
  message: string;
  time: string;
  isNew?: boolean;
}

export default function MessageItem({ name, message, time, isNew }: MessageItemProps) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-bombay/20 last:border-none">
      
      {/* LEFT SIDE */}
      <div>
        <div className="flex items-center gap-2">
          {/* Name */}
          <p className="text-sm font-medium text-codgray">{name}</p>

          {/* NEW Badge */}
          {isNew && (
            <span className="text-xs bg-elm-light/20 text-elm-dark px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Message text */}
        <p className="text-sm text-codgray mt-0.5">{message}</p>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-bombay mt-1">
          <Clock className="h-3 w-3" />
          <span>{time}</span>
        </div>
      </div>

      {/* Reply Button */}
      <Button variant="outline" className="text-xs px-3 py-1">
        Reply
      </Button>
    </div>
  );
}
