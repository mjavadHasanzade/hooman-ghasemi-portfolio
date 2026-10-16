"use client";

import Image from "next/image";
import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTypewriter } from "../../hooks/useTypewriter";
import { mediaUrl } from "@/lib/types/media";
import type {
  PublicContactCta,
  PublicSocialLink,
} from "@/lib/types/public-content";

gsap.registerPlugin(ScrollTrigger);

const TypewriterText = memo(function TypewriterText({
  phrases,
}: {
  phrases: string[];
}) {
  const typedText = useTypewriter(phrases);

  return (
    <div className="cta-item relative mt-16 flex justify-center">
      <div className="min-h-19 w-full max-w-lg rounded-2xl border border-teal-500/40 px-6 py-4 text-center font-mono text-sm text-gray-200 sm:text-base">
        {typedText}
        <span className="typewriter-cursor ms-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-teal-400 align-middle" />
      </div>
    </div>
  );
});

export default function ContactCTASection({
  contactCta,
  socialLinks,
  contactEmail,
  phoneNumber,
}: {
  contactCta: PublicContactCta;
  socialLinks: PublicSocialLink[];
  contactEmail?: string;
  phoneNumber?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const phone = phoneNumber?.trim() || null;
  const email = contactEmail ||
    socialLinks.find((social) => social.url.startsWith("mailto:"))?.url.replace(/^mailto:/i, "");

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden bg-black py-20 text-white sm:py-24 md:py-28"
    >
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="cta-item font-mono text-3xl font-bold text-gray-300 sm:text-4xl md:text-5xl">
          {contactCta.heading}
        </h2>

        <p className="cta-item mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
          {contactCta.description}
        </p>

        {/* دکمه‌ی ارتباط */}
        <div className="relative mt-10 flex items-center justify-center">
          <button
            type="button"
            className="cta-item pulse-btn group relative z-10 inline-flex rounded-full border border-teal-500/40 bg-black px-6 py-3.5 font-mono text-sm font-bold text-white transition-colors hover:border-teal-400 sm:text-base"
          >
            {contactCta.connectLabel}
          </button>

        </div>

        {(email || phone) && (
          <ul className="cta-item mx-auto mt-5 flex w-fit flex-col items-start gap-2 font-mono text-sm text-teal-300">
            {email && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <a href={`mailto:${email}`} dir="ltr" className="transition-colors hover:text-teal-100">{email}</a>
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" className="transition-colors hover:text-teal-100">{phone}</a>
              </li>
            )}
          </ul>
        )}

        {/* آیکون‌های شبکه‌های اجتماعی */}
        <div className="cta-item mt-10 flex items-center justify-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.platform}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800/80 text-sm font-bold text-gray-200 transition-colors hover:bg-gray-700"
            >
              {mediaUrl(social.image) ? (
                <Image
                  src={mediaUrl(social.image)!}
                  alt={social.platform}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                  unoptimized
                />
              ) : (
                social.iconKey.slice(0, 2).toUpperCase()
              )}
            </a>
          ))}
        </div>

        {/* باکس افکت تایپ‌رایتر */}
        <TypewriterText phrases={contactCta.phrases} />
      </div>
    </section>
  );
}
