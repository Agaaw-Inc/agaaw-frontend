import Link from "next/link";

interface CountryCardProps {
    name: string;
    image: string;
}

export default function CountryCard({ name, image }: CountryCardProps) {
    return (
        <Link
            href={`/countries/${name.toLowerCase()}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
        >
            <img src={image} alt={name} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
        </Link>
    );
}