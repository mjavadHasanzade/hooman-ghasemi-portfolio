import { ReactNode } from "react";

interface TechBoxProps {
  icon: ReactNode;
  name: string;
}

export default function TechBox({ icon, name }: TechBoxProps) {
  return (
    <div className="tech-box flex flex-col items-center gap-3 opacity-0">
      <div
        className="
          group relative flex aspect-square w-20 items-center justify-center
          overflow-hidden border border-gray-800 bg-black
          transition-colors duration-300
          hover:border-teal-500
          sm:w-24
          md:w-28
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]
          "
        />
        <div className="relative h-9 w-9 grayscale transition-all duration-300 group-hover:grayscale-0 sm:h-11 sm:w-11 md:h-12 md:w-12">
          {icon}
        </div>
      </div>

      <span className="font-mono text-xs uppercase tracking-wider text-gray-400 sm:text-sm">
        {name}
      </span>
    </div>
  );
}
