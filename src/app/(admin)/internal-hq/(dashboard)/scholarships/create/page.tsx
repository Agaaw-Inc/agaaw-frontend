import ScholarshipForm from "@/components/admin/scholarship/ScholarshipForm";

export default function CreateScholarshipPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Scholarship</h1>
      <ScholarshipForm mode="create" />
    </div>
  );
}