import Link from "next/link";

interface ScholarshipCardProps {
    title: string;
    university: string;
    deadline: string;
    image: string;
}

export default function ScholarshipCard({
    title,
    university,
    deadline,
    image,
}: ScholarshipCardProps) {
    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col h-full">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-codgray leading-tight">{title}</h3>
                <p className="text-bombay mt-1">{university}</p>
                
                <div className="mt-auto border-t border-bombay/10 pt-4 mt-4">
                    <p className="text-sm text-red-600 font-medium">Deadline: {deadline}</p>
                    <Link
                        href={`/scholarships/${title.toLowerCase().replace(/ /g, "-")}`}
                        className="inline-block mt-2 text-elm font-semibold hover:underline transition-colors"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}