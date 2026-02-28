"use client";

import Link from "next/link";

export default function StudentsPage() {
  return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Students</h1>
        <p className="mb-4">This is a placeholder page for student management.</p>
        <p className="mb-4">In the future, you will be able to add, edit, and remove students from this page.</p>
        <Link href="/dashboard/admin" className="text-blue-600 hover:underline">Back to Dashboard</Link>
    </div>
  );
}