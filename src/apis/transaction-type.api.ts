import { supabase } from "@/lib/supabase/client";

export const transactionTypeAPI = {
  gets: async () => {
    const { data, error } = await supabase.from("transaction_types").select("*").order("order", { ascending: true });

    if (error) throw error;

    return data;
  },
};
