import { ReactNode } from "react";

export default function TechBadge({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-white/5 p-1 sm:h-7 sm:w-7">
      {icon}
    </div>
  );
}
