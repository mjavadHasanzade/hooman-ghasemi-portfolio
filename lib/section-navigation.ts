"use client";

let cancelPrevious: (() => void) | undefined;

/** Wait for streamed home content and correct late layout shifts after navigation. */
export function scrollToHomeSection(href: string) {
  cancelPrevious?.();
  const url = new URL(href, window.location.href);
  if (!/^\/(?:(?:fa|en)\/?)?$/.test(url.pathname)) return () => {};
  const id = url.hash.slice(1);
  if (!["portfolio", "about", "contact"].includes(id)) return () => {};

  let frame = 0;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let lastTop: number | undefined;
  let finished = false;
  let verifyPosition = false;
  let verifyTimer: ReturnType<typeof setTimeout> | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let observedMain: Element | null = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stop = () => {
    finished = true;
    cancelAnimationFrame(frame);
    clearTimeout(expiry);
    clearTimeout(retryTimer);
    clearTimeout(verifyTimer);
    clearTimeout(settleTimer);
    mutations.disconnect();
    resize.disconnect();
    window.removeEventListener("scrollend", verify);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stopOnKey);
    if (cancelPrevious === stop) cancelPrevious = undefined;
  };
  const stopOnKey = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Escape"].includes(event.key)) stop();
  };
  const check = () => {
    frame = 0;
    if (finished) return;
    const target = document.getElementById(id);
    if (window.location.pathname !== url.pathname || window.location.hash !== url.hash || !target) {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(schedule, 50);
      return;
    }
    const main = document.querySelector(".site-content main");
    if (main && main !== observedMain) {
      observedMain = main;
      resize.observe(main);
    }
    const headerHeight = document.querySelector(".site-content header")?.getBoundingClientRect().height ?? 0;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 16);
    const destination = Math.min(top, Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
    const positionWasReset = verifyPosition && Math.abs(window.scrollY - destination) > 2;
    verifyPosition = false;
    if (lastTop !== undefined && Math.abs(top - lastTop) < 2 && !positionWasReset) return;
    lastTop = top;
    window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
    clearTimeout(verifyTimer);
    verifyTimer = setTimeout(verify, 500);
    // Keep a short correction window for router.refresh(), fonts and images.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(stop, 1500);
  };
  const schedule = () => {
    if (!finished && !frame) frame = requestAnimationFrame(() => { frame = requestAnimationFrame(check); });
  };
  const verify = () => { verifyPosition = true; schedule(); };
  const mutations = new MutationObserver(schedule);
  const resize = new ResizeObserver(schedule);
  mutations.observe(document.querySelector(".site-content") ?? document.body, { childList: true, subtree: true });
  const expiry = setTimeout(stop, 10000);
  window.addEventListener("scrollend", verify);
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stopOnKey);
  document.fonts.ready.then(schedule);
  cancelPrevious = stop;
  schedule();
  return stop;
}
