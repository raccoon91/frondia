import { supabase } from "@/db";

export const categoryApi = {
  gets: async (typeId: string | number) => {
    const res = await supabase.from("categories").select<string, ICategory>("*").eq("type_id", typeId);

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
};
