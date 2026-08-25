import axiosInstance from "@/lib/axios";
import { LoginPayload, SignUpPayload } from "@/types";
import { auth } from "./routes";

export async function loginApi(payload: LoginPayload) {
  const response = await axiosInstance.post(auth.login, payload);

  return response.data;
}

export async function signUpApi(payload: SignUpPayload) {
  const response = await axiosInstance.post(auth.signUp, payload);

  return response.data;
}