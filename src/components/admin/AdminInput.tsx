interface AdminInputProps {
  label: string;
  type?: string;
  defaultValue?: string;
  name: string;
}

export default function AdminInput({
  label,
  type = "text",
  defaultValue,
  name,
}: AdminInputProps) {
  return (
    <div className="space-y-1">
      <label className="block font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}