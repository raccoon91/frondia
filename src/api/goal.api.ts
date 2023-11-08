import { supabase } from "@/db";
import { isNil } from "lodash-es";

export const goalApi = {
  gets: async () => {
    const res = await supabase.from("goals").select<string, IGoal>("*");

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
  create: async (goal?: IGoal) => {
    if (!goal) return;

    const res = await supabase.from("goals").insert(goal);

    if (res.error) throw new Error(res.error.message);

    return 200;
  },
  delete: async (goalId: number) => {
    if (isNil(goalId)) return;

    const res = await supabase.from("goals").delete().eq("id", goalId);

    if (res.error) throw new Error(res.error.message);
  },
};
