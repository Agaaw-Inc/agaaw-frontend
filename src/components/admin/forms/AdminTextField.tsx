"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export default function AdminTextField({
  label,
  placeholder,
  type = "text",
  register,
  error,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}) {
  return (
    <div className="space-y-1">
      <label className="block font-semibold">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full p-2 border rounded outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...register}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}