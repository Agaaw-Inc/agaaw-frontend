interface NewsItemProps {
  category: string;
  date: string;
  title: string;
  description: string;
  thumbnail?: string; // optional image URL
}

export default function NewsItem({
  category,
  date,
  title,
  description,
  thumbnail,
}: NewsItemProps) {
  return (
    <div className="flex justify-between gap-4 py-4 border-b border-bombay/20 last:border-none">
      
      {/* LEFT CONTENT */}
      <div className="flex-1">
        {/* Category + Date */}
        <div className="flex items-center gap-2 text-xs text-bombay mb-1">
          <span className="bg-bombay/10 px-2 py-1 rounded-md text-codgray">
            {category}
          </span>

          <span>{date}</span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-codgray mb-1">
          {title}
        </h4>

        {/* Description */}
        <p className="text-sm text-bombay">{description}</p>
      </div>

      {/* RIGHT THUMBNAIL */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="h-16 w-24 rounded-md object-cover"
        />
      )}
    </div>
  );
}
