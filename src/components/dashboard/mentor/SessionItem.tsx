import Button from "../common/Button";

interface SessionItemProps {
  student: string;
  title: string;
  datetime: string;
}

export default function SessionItem({ student, title, datetime }: SessionItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-bombay/20 last:border-none">
      
      {/* LEFT SIDE */}
      <div>
        <p className="text-sm font-medium text-codgray">{student}</p>
        <p className="text-xs text-bombay mt-1">{title}</p>
        <p className="text-xs text-bombay mt-1">{datetime}</p>
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="text-xs px-3 py-1">
          Reschedule
        </Button>

        <Button className="text-xs px-3 py-1">
          Join
        </Button>
      </div>
    </div>
  );
}
