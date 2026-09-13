"use client";

import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const minimumDisplay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 650);
    });
    const pageReady = Promise.all([
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
      document.fonts?.ready ?? Promise.resolve(),
    ]);

    Promise.all([minimumDisplay, pageReady]).then(() => {
      if (!cancelled) setVisible(false);
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) setVisible(false);
    }, 4000);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="site-loader" role="status" aria-label="Loading">
      <div className="site-loader-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="site-loader-line" aria-hidden="true" />
    </div>
  );
}
