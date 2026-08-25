import { auth } from "@/api/routes";
import axios from "axios";
import { getAppConfig } from "../config";

const config = await getAppConfig();
const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          await axios.post(
            auth.refreshToken,
            {},
            {
              withCredentials: true,
            },
          );

          isRefreshing = false;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
