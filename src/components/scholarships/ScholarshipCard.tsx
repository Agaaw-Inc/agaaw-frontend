import Link from "next/link";

interface ScholarshipCardProps {
    title: string;
    university: string;
    deadline: string;
}

export default function ScholarshipCard({
    title,
    university,
    deadline,
}: ScholarshipCardProps) {
    return (
        <div className="border p-5 rounded-lg shadow hover:shadow-lg transition bg-white">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-600">{university}</p>
            <p className="text-sm text-red-600 mt-2">Deadline: {deadline}</p>

            <Link
                href={`/scholarships/${title.toLowerCase().replace(/ /g, "-")}`}
                className="inline-block mt-4 text-teal-700 hover:underline"
            >
                View Details →
            </Link>
        </div>
    );
}