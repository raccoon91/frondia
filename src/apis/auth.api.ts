import type { User } from "@supabase/supabase-js";
import type { z } from "zod";

import { ROUTE } from "@/constants/route";
import { supabase } from "@/lib/supabase/client";
import type { loginFormSchema, registerFormSchema } from "@/schema/auth.schema";

export const authAPI = {
  user: async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (!data?.user) throw new Error("User not exist");

    const user: User & { profile: Nullable<Profile> } = { ...data.user, profile: null };

    const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").maybeSingle();

    if (profileError) throw profileError;

    user.profile = profileData;

    return user;
  },

  login: async (formdata: z.infer<typeof loginFormSchema>) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formdata.email,
      password: formdata.password,
    });

    if (error) throw error;

    return data;
  },

  googleLogin: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${import.meta.env.VITE_SNOWBALL_URL}${ROUTE.DASHBOARD}`,
      },
    });

    if (error) throw error;

    if (!data) throw new Error("Google Login failed");
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },

  register: async (formdata: z.infer<typeof registerFormSchema>) => {
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
  },
};
