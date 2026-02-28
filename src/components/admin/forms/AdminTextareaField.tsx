"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export default function AdminTextareaField({
  label,
  placeholder,
  register,
  error,
}: {
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}) {
  return (
    <div className="space-y-1">
      <label className="block font-semibold">{label}</label>
      <textarea
        placeholder={placeholder}
        className={`w-full p-2 border rounded h-28 outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...register}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}