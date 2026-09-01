import { ReactNode } from "react";

interface OutlinedButtonProps {
  icon?: ReactNode;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md";
  className?: string;
}

export default function OutlinedButton({
  icon,
  children,
  href,
  onClick,
  size = "md",
  className = "",
}: OutlinedButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-xs sm:text-sm gap-1.5"
      : "px-5 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-[15px] gap-2.5";

  const classes = `
    group inline-flex items-center rounded-[3px]
    border border-teal-500 bg-black/50
    font-semibold text-white
    shadow-[0_0_18px_rgba(63,168,196,0.45)]
    transition-shadow duration-300
    hover:shadow-[0_0_28px_rgba(63,168,196,0.65)]
    ${sizeClasses} ${className}
  `;

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
