"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import TechBadge from "../atoms/TechBadge";

export default function ProjectTechMarquee({ icons }: { icons: ReactNode[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;
    const measure = () => setOverflowing(group.scrollWidth > viewport.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, [icons]);

  if (!icons.length) return null;

  const badges = icons.map((icon, index) => (
    <div key={index} className="shrink-0">
      <TechBadge icon={icon} />
    </div>
  ));

  return (
    <div
      ref={viewportRef}
      dir="ltr"
      className={`project-tech-viewport min-w-0 flex-1 overflow-hidden ${overflowing ? "project-tech-overflow" : "flex justify-end"}`}
    >
      <div className={`flex w-max items-center ${overflowing ? "project-tech-track" : ""}`}>
        <div ref={groupRef} className="flex shrink-0 items-center gap-1.5 pe-1.5">
          {badges}
        </div>
        {overflowing && (
          <div aria-hidden="true" className="project-tech-copy pointer-events-none flex shrink-0 items-center gap-1.5 pe-1.5">
            {badges}
          </div>
        )}
      </div>
    </div>
  );
}
