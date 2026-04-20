import Link from "next/link";
import { COUNTRIES } from "@/data/countries";

export default function AdminCountries() {
  const list = Object.values(COUNTRIES);

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
          {list.map((c) => (
            <tr key={c.slug} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.universities.length}</td>
              <td className="p-3">
                <Link
                  href={`/admin/countries/edit/${c.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                {" | "}
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}