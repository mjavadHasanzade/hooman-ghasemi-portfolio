import axiosInstance from "@/lib/axios";
import { users } from "./routes";

export async function getUsersApi() {
  const response = await axiosInstance.get(users.getAll);

  return response.data;
}
