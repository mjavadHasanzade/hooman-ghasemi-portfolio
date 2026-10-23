import { apiGet, apiPatch, apiPost } from "./client";
import {
  AdminProfile,
  AuthTokens,
  UpdateAdminProfileInput,
  UpdateAdminProfileResponse,
} from "../types/api";

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

export function updateProfileRequest(body: UpdateAdminProfileInput) {
  return apiPatch<UpdateAdminProfileResponse>("/admin/auth/profile", body);
}
