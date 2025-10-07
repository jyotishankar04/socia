import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/types/index";




interface AuthState {
    user: User | null;
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(devtools((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    logout: () => set({ user: null }),
})));