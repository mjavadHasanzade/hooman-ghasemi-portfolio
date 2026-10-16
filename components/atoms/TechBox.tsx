import { ReactNode } from "react";

interface TechBoxProps {
  icon: ReactNode;
  name: string;
}

export default function TechBox({ icon, name }: TechBoxProps) {
  return (
    <div className="tech-box flex min-w-0 flex-col items-center gap-3 opacity-0">
      <div
        className="
          tech-box-blink group relative flex aspect-square w-20 items-center justify-center
          overflow-hidden border border-gray-800 bg-black
          transition-all duration-300
          hover:-translate-y-1 hover:border-teal-400 hover:shadow-[0_10px_30px_rgba(45,212,191,0.2)]
          sm:w-24
          md:w-28
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
          "
        />
        <div className="tech-icon relative h-11 w-11 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 sm:h-12 sm:w-12 md:h-14 md:w-14">
          {icon}
        </div>
      </div>

      <span className="w-full truncate text-center font-mono text-sm uppercase tracking-wider text-gray-400 sm:text-base">
        {name}
      </span>
    </div>
  );
}
