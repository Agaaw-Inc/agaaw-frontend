interface EventItemProps {
  title: string;
  date: string;
  type: "online" | "webinar" | "in-person";
}

export default function EventItem({ title, date, type }: EventItemProps) {
  const badgeClasses = {
    online: "bg-codgray text-light",
    webinar: "bg-elm-light/20 text-elm-dark",
    "in-person": "bg-elm-dark text-light",
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-bombay/20 last:border-none">
      {/* Info */}
      <div>
        <p className="text-sm font-medium text-codgray">{title}</p>
        <p className="text-xs text-bombay mt-1">{date}</p>
      </div>

      {/* Badge */}
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClasses[type]}`}
      >
        {type === "online" && "Online"}
        {type === "webinar" && "Webinar"}
        {type === "in-person" && "In-Person"}
      </span>
    </div>
  );
}
