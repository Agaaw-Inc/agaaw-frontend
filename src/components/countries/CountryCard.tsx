import Link from "next/link";
import Image from "next/image";

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
            <div className="w-full h-40 relative">
                <Image src={image || "/images/scholarship-agaaw.png"} alt={name} fill className="object-cover" />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
        </Link>
    );
}