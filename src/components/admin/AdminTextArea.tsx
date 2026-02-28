interface AdminTextareaProps {
  label: string;
  defaultValue?: string;
  name: string;
}

export default function AdminTextarea({
  label,
  defaultValue,
  name,
}: AdminTextareaProps) {
  return (
    <div className="space-y-1">
      <label className="block font-semibold">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="w-full p-2 border rounded h-28"
      ></textarea>
    </div>
  );
}