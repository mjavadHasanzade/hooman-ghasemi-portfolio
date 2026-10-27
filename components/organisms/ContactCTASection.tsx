"use client";

import {
  richTextHtml,
  richTextPlainText,
  revealRichText,
} from "@/lib/rich-text";

import Image from "next/image";
import { memo, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTypewriter } from "../../hooks/useTypewriter";
import { publicMediaUrl } from "@/lib/media/public-media-url";
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
  const words = useMemo(
    () => phrases.map((phrase) => richTextPlainText(phrase, false)),
    [phrases],
  );
  const { text: typedText, wordIndex } = useTypewriter(words);
  const phrase = phrases[wordIndex % Math.max(1, phrases.length)] ?? "";

  return (
    <div className="cta-item relative mt-16 flex justify-center">
      <div className="min-h-19 w-full max-w-lg rounded-2xl border border-teal-500/40 px-6 py-4 text-center ltr:font-mono text-sm text-gray-200 rtl:leading-7 sm:text-base">
        <div
          className="cms-rich-text cms-typewriter-text"
          dangerouslySetInnerHTML={{
            __html: revealRichText(phrase, typedText.length, true),
          }}
        />
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
  const sortedSocialLinks = [...socialLinks].sort((a, b) => a.order - b.order);

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
  const email =
    contactEmail ||
    sortedSocialLinks
      .find((social) => social.url.startsWith("mailto:"))
      ?.url.replace(/^mailto:/i, "");

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden bg-black py-20 text-white sm:py-24 md:py-28"
    >
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div
          role="heading"
          aria-level={2}
          className="cms-rich-text cta-item ltr:font-mono text-3xl font-bold text-gray-300 sm:text-4xl md:text-5xl"
          dangerouslySetInnerHTML={{ __html: richTextHtml(contactCta.heading) }}
        />

        <div
          className="cms-rich-text cta-item mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
          dangerouslySetInnerHTML={{
            __html: richTextHtml(contactCta.description),
          }}
        />

        <div className="cta-item relative mx-auto mt-10 w-full max-w-lg rounded-2xl border border-teal-500/40 bg-[linear-gradient(160deg,rgba(20,25,32,1)_0%,rgba(8,10,14,1)_55%,rgba(5,7,10,1)_100%)] px-5 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-8 sm:py-8">
          <div
            role="heading"
            aria-level={3}
            className="cms-rich-text ltr:font-mono text-base font-bold text-white sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: richTextHtml(contactCta.connectLabel),
            }}
          />

          {(email || phone) && (
            <ul className="mx-auto mt-5 flex w-fit max-w-full flex-col items-start gap-3 text-sm text-teal-200 sm:text-base">
              {email && (
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400"
                  />
                  <a
                    href={`mailto:${email}`}
                    dir="ltr"
                    className="min-w-0 break-all transition-colors hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
                  >
                    Email: {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400"
                  />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    dir="ltr"
                    className="min-w-0 break-all transition-colors hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
                  >
                    Phone: {phone}
                  </a>
                </li>
              )}
            </ul>
          )}

          {/* آیکون‌های شبکه‌های اجتماعی */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {sortedSocialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.platform}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800/80 text-sm font-bold text-gray-200 transition-colors hover:bg-gray-700"
              >
                {publicMediaUrl(social.image) ? (
                  <Image
                    src={publicMediaUrl(social.image)!}
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
        </div>

        {/* باکس افکت تایپ‌رایتر */}
        <TypewriterText phrases={contactCta.phrases} />
      </div>
    </section>
  );
}
