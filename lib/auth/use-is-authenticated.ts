import { useAuthStore } from "./auth-store";

/**
 * تا زمانی که AuthProvider وضعیت session را از طریق silent refresh مشخص نکرده
 * است، queryهای محافظت‌شده نباید اجرا شوند.
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.status === "authenticated");
}
