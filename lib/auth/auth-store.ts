import { create } from "zustand";
import { AdminProfile } from "../types/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  user: AdminProfile | null;
  status: AuthStatus;
  setUser: (user: AdminProfile | null) => void;
  setStatus: (status: AuthStatus) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  reset: () => set({ user: null, status: "unauthenticated" }),
}));
