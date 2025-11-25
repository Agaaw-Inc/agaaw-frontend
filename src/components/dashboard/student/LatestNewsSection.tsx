import SectionCard from "../layout/SectionCard";
import Button from "../common/Button";
import NewsItem from "./NewsItem";

interface LatestNewsSectionProps {
  news: {
    category: string;
    date: string;
    title: string;
    description: string;
    thumbnail?: string;
  }[];
}

export default function LatestNewsSection({ news }: LatestNewsSectionProps) {
  return (
    <SectionCard>
      {/* Title + Subtitle */}
      <h2 className="text-lg font-semibold text-codgray">Latest News</h2>
      <p className="text-sm text-bombay mb-4">
        Stay updated with the latest opportunities and announcements
      </p>

      {/* News List */}
      <div>
        {news.map((item, index) => (
          <NewsItem
            key={index}
            category={item.category}
            date={item.date}
            title={item.title}
            description={item.description}
            thumbnail={item.thumbnail}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4">
        <Button variant="outline" fullWidth>
          View All News
        </Button>
      </div>
    </SectionCard>
  );
}
