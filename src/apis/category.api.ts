import { supabase } from "@/lib/supabase/client";

export const categoryAPI = {
  gets: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true });

    if (error) throw error;

    return data;
  },
};
