"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
// import { Linkedin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTypewriter } from "../../hooks/useTypewriter";

gsap.registerPlugin(ScrollTrigger);

// آیکون‌های شبکه‌های اجتماعی؛ در صورت وجود فایل SVG اختصاصی برند،
// آن‌ها را جایگزین این پیاده‌سازی موقت کنید
const socialLinks = [
//   { id: "linkedin", href: "#", icon: <Linkedin className="h-4 w-4" /> },
  { id: "upwork", href: "#", label: "Up" },
  { id: "clutch", href: "#", label: "✛" },
  { id: "webflow", href: "#", label: "W" },
  { id: "behance", href: "#", label: "Bē" },
];

export default function ContactCTASection() {
  const t = useTranslations("ContactCTA");

  const sectionRef = useRef<HTMLElement>(null);

  // متن‌های چرخشی افکت تایپ‌رایتر از فایل ترجمه خوانده می‌شوند
  const typewriterWords = t.raw("typewriterPhrases") as string[];
  const typedText = useTypewriter(typewriterWords);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(".cta-item", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      }).from(
        ".cta-orb",
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );

      // شناوری بی‌نهایت کره‌ها
      gsap.to(".cta-orb-back", {
        y: -10,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".cta-orb-front", {
        y: 10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-20 text-white sm:py-24 md:py-28"
    >
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="cta-item font-mono text-3xl font-bold text-gray-300 sm:text-4xl md:text-5xl">
          {t("heading")}
        </h2>

        <p className="cta-item mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
          {t("description")}
        </p>

        {/* دکمه + کره‌های هم‌پوشان */}
        <div className="relative mt-10 flex items-center justify-center">
          <a
            href={t("connectHref")}
            className="cta-item pulse-btn group relative z-10 flex items-center gap-3 rounded-full border border-teal-500/40 bg-black px-6 py-3.5 font-mono text-sm font-bold text-white transition-colors hover:border-teal-400 sm:text-base"
          >
            {/* دایره‌ی چشمک‌زن reusable */}
            <span className="pulse-dot relative flex h-2.5 w-2.5">
              <span className="pulse-dot-ping absolute inline-flex h-full w-full rounded-full bg-teal-400" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-400" />
            </span>
            {t("connectLabel")}
          </a>

          {/* دو کره‌ی هم‌پوشان گلاسی */}
          <div className="pointer-events-none absolute start-full top-1/2 hidden -translate-y-1/2 sm:block">
            <div className="relative h-28 w-40">
              <div
                className="cta-orb cta-orb-back absolute start-0 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full opacity-90"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #99f6e4 0%, #2dd4bf 22%, #0d9488 50%, #0f3d3a 78%, #041b19 100%)",
                  boxShadow:
                    "inset -8px -8px 20px rgba(0,0,0,0.5), inset 6px 6px 14px rgba(255,255,255,0.15), 0 0 40px -6px rgba(45,212,191,0.45)",
                }}
              />
              <div
                className="cta-orb cta-orb-front absolute start-14 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background:
                    "radial-gradient(circle at 30% 26%, rgba(226,255,250,0.9) 0%, rgba(94,234,212,0.55) 26%, rgba(13,148,136,0.5) 55%, rgba(6,78,74,0.6) 80%, rgba(3,20,19,0.7) 100%)",
                  boxShadow:
                    "inset -8px -8px 18px rgba(0,0,0,0.35), inset 6px 6px 14px rgba(255,255,255,0.25), 0 8px 28px -6px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(1px)",
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    top: "10%",
                    left: "16%",
                    width: "36%",
                    height: "24%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 45%, transparent 75%)",
                    filter: "blur(2px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* آیکون‌های شبکه‌های اجتماعی */}
        <div className="cta-item mt-10 flex items-center justify-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.href}
              aria-label={social.id}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800/80 text-sm font-bold text-gray-200 transition-colors hover:bg-gray-700"
            >
              {social.icon ?? social.label}
            </a>
          ))}
        </div>

        {/* باکس افکت تایپ‌رایتر */}
        <div className="cta-item relative mt-16 flex justify-center">
          <div className="min-h-[76px] w-full max-w-lg rounded-2xl border border-teal-500/40 px-6 py-4 text-center font-mono text-sm text-gray-200 sm:text-base">
            {typedText}
            <span className="typewriter-cursor ms-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-teal-400 align-middle" />
          </div>
        </div>
      </div>
    </section>
  );
}
