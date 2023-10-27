import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/db";
import { toast } from "@/styles";

interface IAuthStore {
  user: User | null;
  getUser: () => Promise<{ status: string } | void>;
  login: (email: string, password: string) => Promise<{ status: string } | void>;
  logout: () => Promise<{ status: string } | void>;
}

export const useAuthStore = create<IAuthStore>(set => ({
  user: null,
  getUser: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) return;

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      set({ user: userData.user });

      return { status: "ok" };
    } catch (error) {
      toast.error(error as string);
    }
  },
  login: async (email: string, password: string) => {
    try {
      const { data } = await supabase.auth.signInWithPassword({ email, password });

      if (!data.user) return;

      set({ user: data.user });

      return { status: "ok" };
    } catch (error) {
      toast.error(error as string);
    }
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();

      set({ user: null });

      return { status: "ok" };
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
