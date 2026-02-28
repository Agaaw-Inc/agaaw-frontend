import Link from "next/link";
import { SCHOLARSHIPS } from "@/data/scholarships";

export default function AdminScholarships() {
  const list = Object.values(SCHOLARSHIPS);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Scholarships</h1>
        <Link
          href="/dashboard/admin/scholarships/create"
          className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
        >
          + Add Scholarship
        </Link>
      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Provider</th>
            <th className="p-3">Deadline</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {list.map((s) => (
            <tr key={s.slug} className="border-t">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.provider}</td>
              <td className="p-3">{s.deadline}</td>
              <td className="p-3">
                <Link
                  href={`/dashboard/admin/scholarships/edit/${s.slug}`}
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