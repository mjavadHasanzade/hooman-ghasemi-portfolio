import { ReactNode } from "react";

export default function TechBadge({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-sm">
      {icon}
    </div>
  );
}
