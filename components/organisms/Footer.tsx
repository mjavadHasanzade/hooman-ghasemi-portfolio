"use client";

import { richTextHtml } from "@/lib/rich-text";

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
      className="site-footer relative w-full bg-black text-white"
    >
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 flex flex-col justify-center items-center">
        <div className="footer-logo footer-item relative mx-auto h-52 w-full max-w-lg sm:h-56">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              unoptimized
              className="object-cover object-center"
            />
          ) : null}
        </div>
        <div
          className="cms-rich-text footer-copyright footer-item mt-2 pb-4 ltr:font-mono text-sm text-gray-500 sm:mt-3 sm:pb-5 sm:text-base"
          dangerouslySetInnerHTML={{
            __html: richTextHtml(footer.copyrightText),
          }}
        />
      </div>
    </footer>
  );
}
