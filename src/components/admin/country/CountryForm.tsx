"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AdminTextField from "@/components/admin/forms/AdminTextField";
import AdminTextareaField from "@/components/admin/forms/AdminTextareaField";
import { countrySchema, CountryFormValues } from "@/lib/validation/countrySchema";

export default function CountryForm({
  mode = "create",
  defaultValues,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<CountryFormValues>;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      slug: "",
      name: "",
      shortIntro: "",
      opportunities: [""],
      universities: [""],
      howToApply: [""],
      jobOpportunities: [""],
      whenToApply: "",
      visaPolicy: "",
      avgCost: "",
      ...defaultValues,
    },
  });

  const opportunities = useFieldArray({ control, name: "opportunities" });
  const universities = useFieldArray({ control, name: "universities" });
  const howToApply = useFieldArray({ control, name: "howToApply" });
  const jobs = useFieldArray({ control, name: "jobOpportunities" });

  const onSubmit = (data: CountryFormValues) => {
    console.log("✅ COUNTRY FORM DATA:", data);
    alert("Country form validated! Check console.");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow max-w-4xl space-y-6"
    >
      <AdminTextField
        label="Slug"
        placeholder="canada"
        register={register("slug")}
        error={errors.slug}
      />

      <AdminTextField
        label="Country Name"
        placeholder="Canada"
        register={register("name")}
        error={errors.name}
      />

      <AdminTextareaField
        label="Short Intro"
        placeholder="A short overview for students..."
        register={register("shortIntro")}
        error={errors.shortIntro}
      />

      <ArrayField
        title="Opportunities"
        fields={opportunities.fields}
        append={() => opportunities.append("")}
        remove={opportunities.remove}
        register={register}
        name="opportunities"
        error={errors.opportunities as any}
      />

      <ArrayField
        title="Top Universities"
        fields={universities.fields}
        append={() => universities.append("")}
        remove={universities.remove}
        register={register}
        name="universities"
        error={errors.universities as any}
      />

      <ArrayField
        title="How to Apply"
        fields={howToApply.fields}
        append={() => howToApply.append("")}
        remove={howToApply.remove}
        register={register}
        name="howToApply"
        error={errors.howToApply as any}
      />

      <AdminTextareaField
        label="When to Apply"
        register={register("whenToApply")}
        error={errors.whenToApply}
      />

      <AdminTextareaField
        label="Visa Policy"
        register={register("visaPolicy")}
        error={errors.visaPolicy}
      />

      <AdminTextareaField
        label="Average Cost"
        register={register("avgCost")}
        error={errors.avgCost}
      />

      <ArrayField
        title="Job Opportunities"
        fields={jobs.fields}
        append={() => jobs.append("")}
        remove={jobs.remove}
        register={register}
        name="jobOpportunities"
        error={errors.jobOpportunities as any}
      />

      <button className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800">
        {mode === "create" ? "Create Country" : "Save Changes"}
      </button>
    </form>
  );
}

function ArrayField({
  title,
  fields,
  append,
  remove,
  register,
  name,
  error,
}: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={append}
          className="px-3 py-1 bg-gray-900 text-white rounded"
        >
          + Add
        </button>
      </div>

      {fields.map((field: any, index: number) => (
        <div key={field.id} className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded"
            {...register(`${name}.${index}`)}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            X
          </button>
        </div>
      ))}

      {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}