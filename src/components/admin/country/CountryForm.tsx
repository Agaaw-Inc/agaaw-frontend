"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, Loader2, CheckCircle2, 
  AlertCircle, ChevronDown, ChevronUp, Globe 
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { Country, CreateCountryPayload } from "@/lib/adminTypes";
import { countrySchema, CountryFormValues } from "@/lib/validation/countrySchema";

const SECTION_KEYS = [
  { value: "opportunities", label: "Opportunities" },
  { value: "top_universities", label: "Top Universities" },
  { value: "how_to_proceed", label: "How to Proceed" },
  { value: "when_to_apply", label: "Application Deadlines" },
  { value: "cons", label: "Cons/Challenges" },
  { value: "living_cost", label: "Living Cost" },
  { value: "tuition_fees", label: "Tuition Fees" },
  { value: "scholarships_overview", label: "Scholarships Overview" },
  { value: "admission", label: "Admission" },
  { value: "test_scores", label: "Test Scores" },
  { value: "visa_documents", label: "Visa Documents" },
];

export default function CountryForm({
  mode = "create",
  initialData,
  countryId,
}: {
  mode?: "create" | "edit";
  initialData?: Country;
  countryId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      flagImage: initialData?.flagImage || "",
      region: initialData?.region || "",
      currency: initialData?.currency || "",
      language: initialData?.language || "",
      tuitionCost: initialData?.tuitionCost || "",
      workRights: initialData?.workRights || "",
      visaInfo: initialData?.visaInfo || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      sections: initialData?.sections || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = async (data: CountryFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const payload: CreateCountryPayload = {
        ...data,
        flagImage: data.flagImage || undefined,
        region: data.region || undefined,
        currency: data.currency || undefined,
        language: data.language || undefined,
        tuitionCost: data.tuitionCost || undefined,
        workRights: data.workRights || undefined,
        visaInfo: data.visaInfo || undefined,
        description: data.description || undefined,
      };

      if (mode === "create") {
        await adminApi.createCountry(payload);
      } else if (countryId) {
        await adminApi.updateCountry(countryId, payload);
      }
      router.push("/internal-hq/countries");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl pb-20">
      {/* ── Server Error ── */}
      {serverError && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Col: Basic Info ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Globe size={18} className="text-teal-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Country Name</label>
                <input
                  {...register("name")}
                  placeholder="e.g. Canada"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">URL Slug</label>
                <input
                  {...register("slug")}
                  placeholder="e.g. canada"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Flag Image URL</label>
              <input
                {...register("flagImage")}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
              />
              {errors.flagImage && <p className="text-xs text-red-500">{errors.flagImage.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                {...register("description")}
                placeholder="Overview of the country..."
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* ── Sections ── */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Guide Content Sections</h3>
              <button
                type="button"
                onClick={() => append({ sectionKey: "opportunities", content: "", order: fields.length })}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus size={14} />
                ADD SECTION
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                <p className="text-sm">No sections added yet.</p>
                <button 
                  type="button" 
                  onClick={() => append({ sectionKey: "opportunities", content: "", order: 0 })}
                  className="mt-2 text-xs text-teal-600 font-medium hover:underline"
                >
                  Click here to start
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <select
                        {...register(`sections.${index}.sectionKey`)}
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {SECTION_KEYS.map(k => (
                          <option key={k.value} value={k.value}>{k.label}</option>
                        ))}
                      </select>
                      
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ChevronUp size={16} /></button>
                        <button type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ChevronDown size={16} /></button>
                        <button type="button" onClick={() => remove(index)} className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-1"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    
                    <textarea
                      {...register(`sections.${index}.content`)}
                      placeholder="Content (supports markdown/HTML)..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-y min-h-[100px]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Col: Sidebar Stats ── */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Key Statistics</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Currency</label>
                <input {...register("currency")} placeholder="e.g. CAD, USD" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Region</label>
                <select
                  {...register("region")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">Select region</option>
                  <option value="Africa">Africa</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Middle East">Middle East</option>
                  <option value="North America">North America</option>
                  <option value="Oceania">Oceania</option>
                  <option value="South America">South America</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Language</label>
                <input {...register("language")} placeholder="e.g. English, French" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Work Rights</label>
                <input {...register("workRights")} placeholder="e.g. 20h/week" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
               <label className="font-bold text-gray-900">Active Status</label>
               <input 
                 type="checkbox" 
                 {...register("isActive")}
                 className="w-10 h-6 bg-gray-200 rounded-full appearance-none checked:bg-teal-600 transition-colors relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4 shadow-inner" 
               />
             </div>
             <p className="text-[11px] text-gray-400 leading-relaxed">
               Inactive countries will not be visible to students in the main platform.
             </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
            {mode === "create" ? "Create Country" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
