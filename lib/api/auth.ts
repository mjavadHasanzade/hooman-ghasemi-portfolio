import { apiGet, apiPost } from "./client";
import { AdminProfile, AuthTokens } from "../types/api";

export function loginRequest(email: string, password: string) {
  return apiPost<AuthTokens>("/admin/auth/login", { email, password });
}

export function refreshRequest(refreshToken: string) {
  return apiPost<AuthTokens>("/admin/auth/refresh", { refreshToken });
}

export function logoutRequest(refreshToken: string) {
  return apiPost<null>("/admin/auth/logout", { refreshToken });
}

export function getMeRequest() {
  return apiGet<AdminProfile>("/admin/auth/me");
}
