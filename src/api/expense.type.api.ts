import { supabase } from "@/db";

export const expenseTypeApi = {
  gets: async () => {
    const res = await supabase.from("types").select<string, IExpenseType>("*");

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
};
