"use client";

import { useEffect } from "react";
import { setAccessToken, setOnAuthFailure } from "../api/client";
import { getMeRequest, refreshRequest } from "../api/auth";
import { REFRESH_TOKEN_STORAGE_KEY } from "../constants";
import { useAuthStore } from "./auth-store";

// این promise در سطح ماژول (نه داخل کامپوننت) نگه‌داری می‌شود تا حتی اگر
// AuthProvider به هر دلیلی (route group جدا، Fast Refresh، StrictMode)
// چند بار mount شود، فقط یک تلاش واقعی برای restore کردن session انجام شود
// و بقیه‌ی mountها منتظر همان promise بمانند یا آن را نادیده بگیرند.
let restoreSessionPromise: Promise<void> | null = null;

async function restoreSession(
  setUser: (u: Awaited<ReturnType<typeof getMeRequest>> | null) => void,
  setStatus: (s: "loading" | "authenticated" | "unauthenticated") => void,
) {
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

  if (!storedRefreshToken) {
    setStatus("unauthenticated");
    return;
  }

  // مرحله‌ی ۱: رفرش توکن. اگر این fail شود، یعنی refreshToken واقعاً
  // نامعتبر/منقضی است - فقط اینجا مجاز به پاک کردن session هستیم.
  let accessToken: string;
  try {
    const tokens = await refreshRequest(storedRefreshToken);
    setAccessToken(tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
    accessToken = tokens.accessToken;
  } catch {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setStatus("unauthenticated");
    return;
  }

  // مرحله‌ی ۲: گرفتن پروفایل. اگر این fail شود (مثلاً خطای شبکه‌ی موقت)،
  // نباید توکنی که همین الان با موفقیت گرفتیم را پاک کنیم - فقط کاربر
  // را unauthenticated نشان می‌دهیم تا در تلاش بعدی (مثلاً رفرش صفحه)
  // دوباره امتحان شود. توکن در localStorage دست‌نخورده می‌ماند.
  try {
    const profile = await getMeRequest();
    setUser(profile);
    setStatus("authenticated");
  } catch {
    setAccessToken(accessToken); // توکن را نگه می‌داریم، فقط status را عوض می‌کنیم
    setStatus("unauthenticated");
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const reset = useAuthStore((s) => s.reset);

  useEffect(() => {
    setOnAuthFailure(() => {
      reset();
    });

    // اگر یک تلاش restoreSession از قبل (چه از همین mount، چه از یک
    // instance دیگر) در حال اجراست یا قبلاً تمام شده، دوباره اجرا نکن.
    if (!restoreSessionPromise) {
      restoreSessionPromise = restoreSession(setUser, setStatus);
    }
  }, [reset, setStatus, setUser]);

  return <>{children}</>;
}
