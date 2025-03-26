import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@supabase/supabase-js";
import { z } from "zod";

import { loginFormSchema, registerFormSchema } from "@/schema/auth.schema";
import { supabase } from "@/lib/supabase/client";
import { generateCategories } from "@/lib/supabase/seed";

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

        if (!profileData) {
          await generateCategories(data.user);

          const { data: newProfileData, error: newProfileError } = await supabase
            .from("profiles")
            .insert({ user_id: user.id, created_at: user.created_at })
            .select("*")
            .maybeSingle();

          if (newProfileError) throw newProfileError;

          user.profile = newProfileData;
        } else {
          user.profile = profileData;
        }

        set({ user, isLoading: false }, false, "getUser");

        return true;
      } catch (error) {
        console.error(error);

        set({ isLoading: false }, false, "getUser");
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
        console.error(error);

        set({ isLoading: false }, false, "login");
      }
    },
    loginWithGoogle: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${import.meta.env.VITE_SNOWBALL_URL}/dashboard`,
          },
        });

        if (error) throw error;

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

    register: async (formdata: z.infer<typeof registerFormSchema>) => {
      try {
        set({ isLoading: true }, false, "register");

        const { data, error } = await supabase.auth.signUp({
          email: formdata.email,
          password: formdata.password,
        });

        if (error) throw error;

        if (!data?.user) throw new Error("Register failed");

        set({ isLoading: false }, false, "register");

        return true;
      } catch (error) {
        console.error(error);

        set({ isLoading: false }, false, "register");
      }
    },
  })),
);
