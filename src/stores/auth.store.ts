import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

interface AuthStore {
  user: Nullable<User>;

  getUser: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    user: null,

    getUser: async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (!data?.user) return false;

        set({ user: data.user }, false, "getUser");

        return true;
      } catch (error) {
        console.error(error);
      }
    },
    login: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        if (!data?.user) return false;

        set({ user: data.user }, false, "login");

        return true;
      } catch (error) {
        console.error(error);
      }
    },
    logout: async () => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        set({ user: null }, false, "logout");

        return true;
      } catch (error) {
        console.error(error);
      }
    },
  })),
);
