import { notifyPublicContentChanged } from "../public-content-sync";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { SuccessResponse, AuthTokens } from "../types/api";
import { REFRESH_TOKEN_STORAGE_KEY } from "../constants";

// این متغیرها بیرون از هر کامپوننت نگه‌داری می‌شوند چون باید بین
// درخواست‌های مختلف axios به‌صورت سراسری (module-level) مشترک باشند.
let accessToken: string | null = null;

// وقتی یک درخواست refresh در حال اجراست، بقیه‌ی درخواست‌هایی که با 401
// مواجه می‌شوند باید صبر کنند تا همان یک refresh تمام شود (نه اینکه هرکدام
// جداگانه یک درخواست refresh جدید بزنند). این promise دقیقاً همین نقش را دارد.
let refreshPromise: Promise<string> | null = null;

// این callback از AuthProvider ست می‌شود تا وقتی refresh کاملاً fail شد
// (یعنی کاربر واقعاً باید logout شود)، بتوانیم state سراسری auth را هم پاک کنیم.
let onAuthFailure: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setOnAuthFailure(callback: () => void) {
  onAuthFailure = callback;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// یک instance جدا و "خام" فقط برای درخواست refresh، تا وارد چرخه‌ی
// interceptor اصلی (که خودش ممکن است دوباره refresh را صدا بزند) نشود.
const rawClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await rawClient.post<SuccessResponse<AuthTokens>>(
    "/admin/auth/refresh",
    { refreshToken },
  );

  const tokens = response.data.data;
  setAccessToken(tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);

  return tokens.accessToken;
}

apiClient.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const isContentWrite = ["post", "put", "patch", "delete"].includes(method ?? "") &&
      /(?:^|\/)admin\/(?:site-settings|hero|about|footer|projects|services|social-links|contact-cta|tech-icons|media)(?:\/|\?|$)/.test(response.config.url ?? "");
    if (isContentWrite && response.data?.success !== false) {
      notifyPublicContentChanged();
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url?.includes("/admin/auth/");

    // فقط برای 401 روی درخواست‌های غیر-auth، و فقط یک‌بار retry می‌کنیم
    // (پرچم _retry از infinite loop جلوگیری می‌کند).
    if (isUnauthorized && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // اگر یک refresh دیگر از قبل در حال اجراست، منتظرش می‌مانیم
        // به‌جای اینکه یک درخواست refresh جدید و موازی بزنیم.
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );
        return apiClient(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * هلپر برای unwrap کردن SuccessResponse envelope؛ به‌جای اینکه در هر
 * فراخوانی جدا بنویسیم `response.data.data`، همه‌جا از این استفاده می‌کنیم.
 */
export async function apiGet<T>(url: string, params?: object): Promise<T> {
  const res = await apiClient.get<SuccessResponse<T>>(url, { params });
  return res.data.data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiClient.post<SuccessResponse<T>>(url, body);
  return res.data.data;
}

export async function apiPostForm<T>(url: string, body: FormData): Promise<T> {
  const res = await apiClient.post<SuccessResponse<T>>(url, body, {
    headers: { "Content-Type": undefined },
  });
  return res.data.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiClient.patch<SuccessResponse<T>>(url, body);
  return res.data.data;
}

export async function apiPatchForm<T>(url: string, body: FormData): Promise<T> {
  const res = await apiClient.patch<SuccessResponse<T>>(url, body, {
    headers: { "Content-Type": undefined },
  });
  return res.data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await apiClient.delete<SuccessResponse<T>>(url);
  return res.data.data;
}
