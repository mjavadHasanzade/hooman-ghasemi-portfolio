"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicFooter } from "@/lib/types/public-content";

gsap.registerPlugin(ScrollTrigger);

export default function Footer({
  footer,
  logoUrl,
}: {
  footer: PublicFooter;
  logoUrl?: string | null;
}) {

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
      className="relative w-full bg-black text-white"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="footer-item -mb-18 -mt-20 flex items-center justify-center sm:-mb-21 sm:-mt-23">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={1254}
              height={1254}
              unoptimized
              className="h-80 w-auto max-w-none object-contain sm:h-92"
            />
          ) : null}
        </div>
        {/* خط جداکننده‌ی محو - روشن در وسط، شفاف در دو طرف */}
        <div
          className="footer-item mx-auto h-px w-full max-w-xs sm:max-w-sm"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(156,163,175,0.5), transparent)",
          }}
        />

        <p className="footer-item mt-5 pb-3 ltr:font-mono text-sm text-gray-500 sm:mt-6 sm:pb-4 sm:text-base">
          {footer.copyrightText}
        </p>
      </div>
    </footer>
  );
}
