import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

// Dummy data for front-end prototyping
const dummyCountries = [
    { name: "United Kingdom", slug: "united-kingdom", universities: [1, 2, 3, 4, 5] },
    { name: "Germany", slug: "germany", universities: [1, 2, 3] },
    { name: "Canada", slug: "canada", universities: [1, 2, 3, 4] },
    { name: "Australia", slug: "australia", universities: [1, 2] },
];

export default function AdminCountriesPage() {
    return (
        <div>
            <div className="flex justify-between mb-8">
                <h1 className="text-3xl font-bold">Countries</h1>
                <Link
                    href="/admin/countries/create"
                    className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
                >
                    + Add Country
                </Link>
            </div>

            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
                <thead className="bg-gray-200 text-left">
                    <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Universities</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Mapping over the dummy data */}
                    {dummyCountries.map((c) => (
                        <tr key={c.slug} className="border-t">
                            <td className="p-3 font-medium">{c.name}</td>
                            <td className="p-3">{c.universities.length}</td>
                            <td className="p-3">
                                <Link
                                    href={`/admin/countries/edit/${c.slug}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </Link>
                                {" | "}
                                <DeleteButton
                                    itemName={c.name}
                                    deleteAction={async () => {
                                        "use server";
                                        console.log(`Deleting ${c.slug}...`);
                                        // When ready, replace with: await deleteCountry(c.slug);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}