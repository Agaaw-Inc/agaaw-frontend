interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  className,
  fullWidth,
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all";

  const variants = {
    primary: "bg-elm text-light hover:bg-elm-dark",
    outline:
      "bg-light text-codgray border border-bombay/40 hover:bg-bombay/10",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className || ""}`}
    >
      {children}
    </button>
  );
}
