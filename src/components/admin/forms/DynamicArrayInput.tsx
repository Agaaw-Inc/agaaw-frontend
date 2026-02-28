"use client";

import { Plus, Trash } from "lucide-react";

interface Props {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export default function DynamicArrayInput({ label, values, onChange }: Props) {
  const addField = () => {
    onChange([...values, ""]);
  };

  const updateField = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
  };

  const removeField = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="font-medium">{label}</label>

      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <input
            className="flex-1 p-3 border rounded-xl"
            value={value}
            onChange={(e) => updateField(index, e.target.value)}
          />
          <button type="button" onClick={() => removeField(index)}>
            <Trash size={18} className="text-red-500" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="flex items-center gap-2 text-[#635bff]"
      >
        <Plus size={16} /> Add
      </button>
    </div>
  );
}