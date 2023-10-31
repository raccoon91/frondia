import { supabase } from "@/db";

export const scheduleApi = {
  gets: async () => {
    const res = await supabase.from("schedules").select<string, ISchedule>("*");

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
};
