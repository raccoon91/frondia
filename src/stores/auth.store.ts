import type { User } from "@supabase/supabase-js";
import type { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { supabase } from "@/lib/supabase/client";
import { generateCategories } from "@/lib/supabase/seed";
import type { loginFormSchema, registerFormSchema } from "@/schema/auth.schema";

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
        set({ isLoading: true }, false, "loginWithGoogle");

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        if (!data) throw new Error("Google Login failed");

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            if (!profile) {
              await supabase.from("profiles").insert({
                user_id: session.user.id,
              });
            }
          }
        });

        set({ isLoading: false }, false, "loginWithGoogle");

        return true;
      } catch (error) {
        console.error(error);

        set({ isLoading: false }, false, "loginWithGoogle");
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

        await supabase.from("profiles").insert({
          user_id: data.user.id,
          name: formdata.name,
        });

        set({ isLoading: false }, false, "register");

        return true;
      } catch (error) {
        console.error(error);

        set({ isLoading: false }, false, "register");
      }
    },
  })),
);
