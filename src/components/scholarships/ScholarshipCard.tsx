import Link from "next/link";

interface ScholarshipCardProps {
    title: string;
    university: string;
    deadline: string;
    image: string;
    slug: string;
    funding?: string;
    amount?: string;
}

export default function ScholarshipCard({
    title,
    university,
    deadline,
    image,
    slug,
    funding,
    amount,
}: ScholarshipCardProps) {
    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image || "/images/scholarship-agaaw.png"} alt={title} className="w-full h-48 object-cover" />
            <div className="p-5 flex flex-col flex-1">
                {funding && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-elm/10 px-3 py-1 text-xs font-semibold text-elm">
                        {funding}
                    </span>
                )}
                <h3 className="text-xl font-bold text-codgray leading-tight">{title}</h3>
                <p className="text-bombay mt-1">{university}</p>
                
                <div className="mt-auto border-t border-bombay/10 pt-4 mt-4">
                    <p className="text-sm text-red-600 font-medium">Deadline: {deadline}</p>
                    {amount && <p className="text-sm text-bombay mt-1">{amount}</p>}
                    <Link
                        href={`/scholarships/${slug}`}
                        className="inline-block mt-2 text-elm font-semibold hover:underline transition-colors"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
