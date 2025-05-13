import type { User } from "@supabase/supabase-js";
import type { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { ROUTE } from "@/constants/route";
import { supabase } from "@/lib/supabase/client";
import type { loginFormSchema, registerFormSchema } from "@/schema/auth.schema";
import { log } from "@/utils/log";

interface AuthStore {
  isLoading: boolean;

  user: Nullable<User & { profile: Nullable<Profile> }>;

  getUser: () => Promise<boolean>;

  login: (formdata: z.infer<typeof loginFormSchema>) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<boolean>;

  register: (formdata: z.infer<typeof registerFormSchema>) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    isLoading: false,

    user: null,

    getUser: async () => {
      try {
        set({ isLoading: true }, false, "getUser");

        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (!data?.user) throw new Error("User not exist");

        const user: User & { profile: Nullable<Profile> } = { ...data.user, profile: null };

        const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").maybeSingle();

        if (profileError) throw profileError;

        user.profile = profileData;

        set({ user, isLoading: false }, false, "getUser");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "getUser");

        log.error(error);
      }
    },

    login: async (formdata: z.infer<typeof loginFormSchema>) => {
      try {
        set({ isLoading: true }, false, "login");

        const { error } = await supabase.auth.signInWithPassword({
          email: formdata.email,
          password: formdata.password,
        });

        if (error) throw error;

        set({ isLoading: false }, false, "login");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "login");

        log.error(error);
      }
    },
    loginWithGoogle: async () => {
      try {
        set({ isLoading: true }, false, "loginWithGoogle");

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${import.meta.env.VITE_SNOWBALL_URL}${ROUTE.DASHBOARD}`,
          },
        });

        if (error) throw error;

        if (!data) throw new Error("Google Login failed");

        set({ isLoading: false }, false, "loginWithGoogle");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "loginWithGoogle");

        log.error(error);
      }
    },

    logout: async () => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        set({ user: null }, false, "logout");

        return true;
      } catch (error) {
        log.error(error);
      }
    },

    register: async (formdata: z.infer<typeof registerFormSchema>) => {
      try {
        set({ isLoading: true }, false, "register");

        const { data, error } = await supabase.auth.signUp({
          email: formdata.email,
          password: formdata.password,
          options: {
            data: {
              name: formdata.name ?? "",
            },
          },
        });

        if (error) throw error;

        if (!data?.user) throw new Error("Register failed");

        set({ isLoading: false }, false, "register");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "register");

        log.error(error);
      }
    },
  })),
);
