import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthStore {
  user: User | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(() => ({
    user: null,

    login: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        if (data.user) return true;
      } catch (error) {
        console.error(error);
      }
    },
    logout: async () => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return true;
      } catch (error) {
        console.error(error);
      }
    },
  })),
);
