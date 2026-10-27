const CONTENT_CHANGED_EVENT = "cms:public-content-changed";
const CONTENT_CHANGED_KEY = "cms_public_content_revision";

/** Notify this document and other same-origin tabs only after a CMS save succeeds. */
export function notifyPublicContentChanged() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONTENT_CHANGED_KEY, `${Date.now()}-${Math.random()}`);
  } catch {
    // Storage may be disabled; same-tab notifications and focus refresh still work.
  }
  window.dispatchEvent(new Event(CONTENT_CHANGED_EVENT));
}

export function subscribeToPublicContentChanges(onChange: () => void) {
  const refreshVisiblePage = () => {
    if (document.visibilityState === "visible") onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONTENT_CHANGED_KEY) refreshVisiblePage();
  };
  window.addEventListener(CONTENT_CHANGED_EVENT, refreshVisiblePage);
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", refreshVisiblePage);
  window.addEventListener("pageshow", refreshVisiblePage);
  document.addEventListener("visibilitychange", refreshVisiblePage);

  return () => {
    window.removeEventListener(CONTENT_CHANGED_EVENT, refreshVisiblePage);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", refreshVisiblePage);
    window.removeEventListener("pageshow", refreshVisiblePage);
    document.removeEventListener("visibilitychange", refreshVisiblePage);
  };
}
