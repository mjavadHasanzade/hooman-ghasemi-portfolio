"use client";

import { useEffect, useState } from "react";

/**
 * هوک افکت تایپ‌رایتر: بین چند رشته متن می‌چرخد،
 * هر کدام را حرف‌به‌حرف تایپ می‌کند، مکث می‌کند، سپس پاک کرده
 * و به سراغ متن بعدی می‌رود.
 */
export function useTypewriter(
  words: string[],
  typingSpeed = 65,
  deletingSpeed = 35,
  pauseDuration = 1600,
) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const currentWord = words[wordIndex % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text.length < currentWord.length) {
      // در حال تایپ کردن حرف بعدی
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && text.length === currentWord.length) {
      // متن کامل شد؛ کمی مکث قبل از شروع پاک کردن
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text.length > 0) {
      // در حال پاک کردن حرف آخر
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1));
      }, deletingSpeed);
    } else {
      // پاک شد؛ برو سراغ متن بعدی
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [
    text,
    isDeleting,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return text;
}
