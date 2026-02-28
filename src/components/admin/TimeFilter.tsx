"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function TimeFilter({ value, onChange }: Props) {
  const options = ["weekly", "monthly", "yearly"];

  return (
    <div className="flex bg-gray-100 rounded-full p-1 w-fit">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-1 text-sm rounded-full capitalize transition-all duration-300 ${
            value === option
              ? "bg-white shadow-sm font-medium"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}