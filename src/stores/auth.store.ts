import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { authApi } from "@/api";
import { toast } from "@/styles";

interface IAuthStore {
  user: User | null;
  getUser: () => Promise<{ status: number } | void>;
  login: (email: string, password: string) => Promise<{ status: number } | void>;
  logout: () => Promise<{ status: number } | void>;
}

export const useAuthStore = create<IAuthStore>(set => ({
  user: null,
  getUser: async () => {
    try {
      const session = await authApi.getSession();

      if (!session) return;

      const user = await authApi.getUser();

      if (!user) return;

      set({ user });

      return { status: 200 };
    } catch (error) {
      toast.error(error);
    }
  },
  login: async (email: string, password: string) => {
    try {
      const user = await authApi.login(email, password);

      set({ user });

      return { status: 200 };
    } catch (error) {
      toast.error(error);
    }
  },
  logout: async () => {
    try {
      await authApi.logout();

      set({ user: null });

      return { status: 200 };
    } catch (error) {
      toast.error(error);
    }
  },
}));
