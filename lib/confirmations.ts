"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { richTextPlainText } from "@/lib/rich-text";
import "sweetalert2/dist/sweetalert2.min.css";
import "./confirmations.css";

export const useConfirmationState = create<{ active: boolean }>(() => ({ active: false }));

async function ask(title: string, text: string, destructive: boolean): Promise<boolean> {
  // A second action must never share the first action's approval.
  if (useConfirmationState.getState().active) return false;
  const previousFocus = document.activeElement;
  useConfirmationState.setState({ active: true });
  try {
    const { default: Swal } = await import("sweetalert2");
    const result = await Swal.fire({
      titleText: title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: destructive ? "بله، حذف شود" : "بستن بدون ذخیره",
      cancelButtonText: destructive ? "انصراف" : "ادامهٔ ویرایش",
      focusCancel: true,
      buttonsStyling: false,
      heightAuto: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      keydownListenerCapture: true,
      stopKeydownPropagation: true,
      returnFocus: false,
      customClass: {
        container: "admin-confirmation-layer",
        popup: `admin-confirmation ${destructive ? "admin-confirmation--danger" : ""}`,
        title: "admin-confirmation-title",
        htmlContainer: "admin-confirmation-text",
        actions: "admin-confirmation-actions",
        confirmButton: "admin-confirmation-confirm",
        cancelButton: "admin-confirmation-cancel",
      },
      didOpen: (popup) => { popup.dir = "rtl"; popup.lang = "fa"; },
    });
    return result.isConfirmed;
  } catch {
    toast.error("نمایش پنجرهٔ تأیید ممکن نشد. دوباره تلاش کنید.");
    return false;
  } finally {
    useConfirmationState.setState({ active: false });
    requestAnimationFrame(() => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    });
  }
}

export function confirmDelete(itemName?: string) {
  const name = itemName ? richTextPlainText(itemName).trim() : "";
  return ask("از حذف مطمئن هستید؟", name ? `«${name}» حذف خواهد شد. این کار قابل بازگشت نیست.` : "این مورد حذف خواهد شد. این کار قابل بازگشت نیست.", true);
}

export function confirmDiscardChanges() {
  return ask("تغییرات ذخیره نشده‌اند", "با بستن این پنجره، تغییرات شما از بین می‌روند. می‌خواهید به ویرایش ادامه دهید؟", false);
}
