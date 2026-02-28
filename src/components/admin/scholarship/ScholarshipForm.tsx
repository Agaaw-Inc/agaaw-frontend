"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  scholarshipSchema,
  ScholarshipFormValues,
} from "@/lib/validation/scholarshipSchema";

import AdminTextField from "@/components/admin/forms/AdminTextField";
import AdminTextareaField from "@/components/admin/forms/AdminTextareaField";

export default function ScholarshipForm({
  defaultValues,
  mode = "create",
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<ScholarshipFormValues>;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      slug: "",
      name: "",
      provider: "",
      country: "",
      level: "",
      deadline: "",
      description: "",
      benefits: [""],
      eligibility: [""],
      applicationSteps: [""],
      officialLink: "",
      ...defaultValues,
    },
  });

  const benefits = useFieldArray({ control, name: "benefits" });
  const eligibility = useFieldArray({ control, name: "eligibility" });
  const steps = useFieldArray({ control, name: "applicationSteps" });

  const onSubmit = (data: ScholarshipFormValues) => {
    console.log("✅ FORM DATA:", data);
    alert("Form validated! Check console.");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow max-w-4xl space-y-6"
    >
      <AdminTextField
        label="Slug"
        placeholder="daad-scholarship"
        register={register("slug")}
        error={errors.slug}
      />

      <AdminTextField
        label="Name"
        placeholder="DAAD Scholarship"
        register={register("name")}
        error={errors.name}
      />

      <AdminTextField
        label="Provider"
        register={register("provider")}
        error={errors.provider}
      />

      <AdminTextField
        label="Country"
        register={register("country")}
        error={errors.country}
      />

      <AdminTextField
        label="Level"
        register={register("level")}
        error={errors.level}
      />

      <AdminTextField
        label="Deadline"
        type="date"
        register={register("deadline")}
        error={errors.deadline}
      />

      <AdminTextareaField
        label="Description"
        register={register("description")}
        error={errors.description}
      />

      {/* Dynamic array fields */}
      <ArrayField
        title="Benefits"
        fields={benefits.fields}
        append={() => benefits.append("")}
        remove={benefits.remove}
        register={register}
        name="benefits"
        error={errors.benefits as any}
      />

      <ArrayField
        title="Eligibility"
        fields={eligibility.fields}
        append={() => eligibility.append("")}
        remove={eligibility.remove}
        register={register}
        name="eligibility"
        error={errors.eligibility as any}
      />

      <ArrayField
        title="Application Steps"
        fields={steps.fields}
        append={() => steps.append("")}
        remove={steps.remove}
        register={register}
        name="applicationSteps"
        error={errors.applicationSteps as any}
      />

      <AdminTextField
        label="Official Link"
        placeholder="https://..."
        register={register("officialLink")}
        error={errors.officialLink}
      />

      <button className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800">
        {mode === "create" ? "Create Scholarship" : "Save Changes"}
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