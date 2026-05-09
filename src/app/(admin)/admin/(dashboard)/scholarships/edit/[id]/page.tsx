"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ScholarshipForm from "@/components/admin/scholarship/ScholarshipForm";
import * as adminApi from "@/lib/adminApi";
import { Loader2, AlertCircle } from "lucide-react";

export default function EditScholarshipPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [scholarship, setScholarship] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScholarship() {
      try {
        const data = await adminApi.getScholarship(id);
        setScholarship(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load scholarship");
      } finally {
        setIsLoading(false);
      }
    }
    fetchScholarship();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm">Loading scholarship data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Scholarship</h1>
      <ScholarshipForm mode="edit" initialData={scholarship} scholarshipId={id} />
    </div>
  );
}
