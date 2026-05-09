"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CountryForm from "@/components/admin/country/CountryForm";
import * as adminApi from "@/lib/adminApi";
import { Loader2, AlertCircle } from "lucide-react";

export default function EditCountryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [country, setCountry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const data = await adminApi.getCountry(id);
        setCountry(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load country");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCountry();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm">Loading country data...</p>
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
      <h1 className="text-2xl font-bold text-gray-900">Edit Country</h1>
      <CountryForm mode="edit" initialData={country} countryId={id} />
    </div>
  );
}
