"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const t = useTranslations("Footer");

  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // gsap.context تمام انیمیشن‌ها و ScrollTriggerهای ساخته‌شده داخلش را
    // ردیابی می‌کند تا هنگام unmount شدن کامپوننت، همه را یک‌جا پاک کنیم
    const ctx = gsap.context(() => {
      gsap.from(".footer-item", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-black py-12 text-white sm:py-14"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        {/* خط جداکننده‌ی محو - روشن در وسط، شفاف در دو طرف */}
        <div
          className="footer-item mx-auto h-px w-full max-w-xs sm:max-w-sm"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(156,163,175,0.5), transparent)",
          }}
        />

        <p className="footer-item mt-8 font-mono text-sm text-gray-500 sm:text-base">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
