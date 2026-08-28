"use client";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function HamburgerButton({
  isOpen,
  onClick,
  className = "",
}: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className={`relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.25 ${className}`}
    >
      <span
        className={`block h-0.5 w-5 bg-white transition-all duration-300 ease-out ${
          isOpen ? "translate-y-1.75 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-5 bg-white transition-all duration-200 ease-out ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`block h-0.5 w-5 bg-white transition-all duration-300 ease-out ${
          isOpen ? "-translate-y-1.75 -rotate-45" : ""
        }`}
      />
    </button>
  );
}
