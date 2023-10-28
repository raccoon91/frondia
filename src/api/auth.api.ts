import { supabase } from "@/db";

export const authApi = {
  gets: async (typeId: string | number) => {
    const res = await supabase.from("categories").select<string, ICategory>("*").eq("type_id", typeId);

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
  getSession: async () => {
    const res = await supabase.auth.getSession();

    if (res.error) throw new Error(res.error.message);

    return res.data.session;
  },
  getUser: async () => {
    const res = await supabase.auth.getUser();

    if (res.error) throw new Error(res.error.message);

    return res.data.user;
  },
  login: async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password });

    if (res.error) throw new Error(res.error.message);

    return res.data.user;
  },
  logout: async () => {
    const res = await supabase.auth.signOut();

    if (res.error) throw new Error(res.error.message);
  },
};
