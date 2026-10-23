import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken } from "../api/client";
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  updateProfileRequest,
} from "../api/auth";
import { REFRESH_TOKEN_STORAGE_KEY } from "../constants";
import { useAuthStore } from "./auth-store";
import type { UpdateAdminProfileInput } from "../types/api";

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const reset = useAuthStore((s) => s.reset);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await loginRequest(email, password);

      setAccessToken(tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);

      const profile = await getMeRequest();
      setUser(profile);
      setStatus("authenticated");
      router.push("/");
    },
    [router, setUser, setStatus],
  );

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch {
      // حتی اگر درخواست logout سمت سرور fail شود (مثلاً توکن از قبل
      // منقضی بوده)، همچنان باید state محلی را پاک کنیم.
    } finally {
      setAccessToken(null);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      reset();
      router.push("/login");
    }
  }, [reset, router]);

  const updateProfile = useCallback(
    async (input: UpdateAdminProfileInput) => {
      const result = await updateProfileRequest(input);

      setAccessToken(result.tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, result.tokens.refreshToken);
      setUser(result.profile);
      setStatus("authenticated");

      return result.profile;
    },
    [setStatus, setUser],
  );

  return { user, status, login, logout, updateProfile };
}
