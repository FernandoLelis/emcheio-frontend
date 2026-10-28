import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Logo({ className = "", variant = "dark" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-text-primary";

  return (
    <Link
      href="/"
      className={`text-2xl font-bold tracking-tight transition-transform hover:scale-105 ${className}`}
      aria-label="EmCheio - Página inicial"
    >
      <span className={`font-heading ${textColor}`}>Em</span>
      <span className="gradient-brand-text font-heading">Cheio</span>
    </Link>
  );
}