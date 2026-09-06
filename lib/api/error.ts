import { AxiosError } from "axios";
import { ErrorResponse } from "../types/api";

/**
 * خطای Axios را می‌گیرد و یک پیام رشته‌ای قابل‌نمایش برمی‌گرداند.
 * چون message از بک‌اند می‌تواند رشته یا آرایه‌ای از رشته‌ها باشد
 * (خطاهای اعتبارسنجی class-validator)، اینجا هر دو حالت را هندل می‌کنیم.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse | undefined;

    if (data?.message) {
      return Array.isArray(data.message)
        ? data.message.join("، ")
        : data.message;
    }

    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return "خطای غیرمنتظره‌ای رخ داد";
}
