"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, Loader2, CheckCircle2, 
  AlertCircle, ChevronDown, ChevronUp, GraduationCap, MapPin, Layers, Target, FileText
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import { scholarshipSchema, ScholarshipFormValues } from "@/lib/validation/scholarshipSchema";
import type { Country } from "@/lib/adminTypes";

export default function ScholarshipForm({
  mode = "create",
  initialData,
  scholarshipId,
}: {
  mode?: "create" | "edit";
  initialData?: any;
  scholarshipId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      provider: "",
      countryId: "",
      level: "masters",
      coverage: "full",
      description: "",
      howToApply: "",
      requiredDocuments: "",
      isActive: true,
      faqs: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "faqs",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, catRes] = await Promise.all([
          adminApi.listCountries({ limit: 100 }),
          adminApi.listScholarshipCategories(),
        ]);
        setCountries(cRes.data);
        setCategories(catRes);
      } catch (err) {
        console.error("Failed to load countries/categories", err);
      }
    }
    loadData();
  }, []);

  const onSubmit = async (data: ScholarshipFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (mode === "create") {
        await adminApi.createScholarship(data as any);
      } else if (scholarshipId) {
        await adminApi.updateScholarship(scholarshipId, data as any);
      }
      router.push("/admin/scholarships");
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
        {/* ── Left Col: Main Details ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap size={18} className="text-teal-600" />
              Scholarship Basics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Scholarship Name</label>
                <input
                  {...register("name")}
                  placeholder="e.g. DAAD Masters Scholarship"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">URL Slug</label>
                <input
                  {...register("slug")}
                  placeholder="e.g. daad-masters"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
                />
                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Provider / Organization</label>
              <input
                {...register("provider")}
                placeholder="e.g. German Academic Exchange Service"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
              />
              {errors.provider && <p className="text-xs text-red-500">{errors.provider.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register("description")}
                placeholder="Detailed description of the scholarship..."
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all resize-none"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          {/* ── Eligibility & Steps ── */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <Target size={16} className="text-teal-600" />
                   How to Apply
                 </h3>
                 <textarea
                   {...register("howToApply")}
                   placeholder="Step-by-step application instructions..."
                   rows={6}
                   className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                 />
                 {errors.howToApply && <p className="text-xs text-red-500">{errors.howToApply.message}</p>}
               </div>
               <div className="space-y-2">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <FileText size={16} className="text-teal-600" />
                   Required Documents
                 </h3>
                 <textarea
                   {...register("requiredDocuments")}
                   placeholder="List of documents needed..."
                   rows={6}
                   className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                 />
                 {errors.requiredDocuments && <p className="text-xs text-red-500">{errors.requiredDocuments.message}</p>}
               </div>
            </div>
          </div>

          {/* ── FAQs ── */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Frequently Asked Questions</h3>
              <button
                type="button"
                onClick={() => append({ question: "", answer: "", order: fields.length })}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus size={14} />
                ADD FAQ
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      {...register(`faqs.${index}.question`)}
                      placeholder="Question..."
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => remove(index)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <textarea
                    {...register(`faqs.${index}.answer`)}
                    placeholder="Answer..."
                    rows={2}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Col: Metadata ── */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Targeting & Scope</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1">
                  <MapPin size={12} /> Target Country
                </label>
                <select
                  {...register("countryId")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.countryId && <p className="text-xs text-red-500">{errors.countryId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1">
                  <Layers size={12} /> Category
                </label>
                <select
                  {...register("categoryId")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1">
                  <Layers size={12} /> Study Level
                </label>
                <select
                  {...register("level")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="bachelors">Bachelors</option>
                  <option value="masters">Masters</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1">
                  <CheckCircle2 size={12} /> Coverage
                </label>
                <select
                  {...register("coverage")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="full">Full Coverage</option>
                  <option value="partial">Partial Coverage</option>
                  <option value="varies">Varies</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Deadline</label>
                <input
                  type="date"
                  {...register("deadline")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">Official Link</label>
                <input
                  {...register("officialLink")}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                {errors.officialLink && <p className="text-xs text-red-500">{errors.officialLink.message}</p>}
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
            {mode === "create" ? "Create Scholarship" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}