"use client";

import { Control, FieldError, useFieldArray } from "react-hook-form";

export default function AdminArrayField({
  title,
  name,
  control,
  error,
}: {
  title: string;
  name: "benefits" | "eligibility" | "applicationSteps";
  control: Control<any>;
  error?: FieldError;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => append("")}
          className="px-3 py-1 bg-gray-900 text-white rounded"
        >
          + Add
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded"
            {...(control as any)._fields[name][index]}
            name={`${name}.${index}`}
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

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}