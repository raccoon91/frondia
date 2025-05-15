import type { User } from "@supabase/supabase-js";
import type { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { authAPI } from "@/apis/auth.api";
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

        const data = await authAPI.user();

        set({ user: data, isLoading: false }, false, "getUser");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "getUser");

        log.error(error);
      }
    },

    login: async (formdata: z.infer<typeof loginFormSchema>) => {
      try {
        set({ isLoading: true }, false, "login");

        await authAPI.login(formdata);

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

        await authAPI.googleLogin();

        set({ isLoading: false }, false, "loginWithGoogle");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "loginWithGoogle");

        log.error(error);
      }
    },

    logout: async () => {
      try {
        await authAPI.logout();

        set({ user: null }, false, "logout");

        return true;
      } catch (error) {
        log.error(error);
      }
    },

    register: async (formdata: z.infer<typeof registerFormSchema>) => {
      try {
        set({ isLoading: true }, false, "register");

        await authAPI.register(formdata);

        set({ isLoading: false }, false, "register");

        return true;
      } catch (error) {
        set({ isLoading: false }, false, "register");

        log.error(error);
      }
    },
  })),
);
