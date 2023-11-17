import { supabase } from "@/db";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";

export const scheduleApi = {
  gets: async ({
    query,
    relation,
    date,
  }: {
    query?: string;
    relation?: string[];
    date?: {
      eq?: string | number;
      from?: string | number;
      to?: string | number;
    };
  }) => {
    let queryString = "*";

    if (query) {
      queryString = query;
    } else if (relation) {
      relation.forEach(table => {
        queryString += ` ${table} (*)`;
      });
    }

    let res: PostgrestSingleResponse<ISchedule[]>;

    if (date?.eq) {
      res = await supabase.from("schedules").select<string, ISchedule>(queryString).eq("date", date.eq);
    } else if (date?.from && date?.to) {
      res = await supabase
        .from("schedules")
        .select<string, ISchedule>(queryString)
        .gte("date", date.from)
        .lte("date", date.to);
    } else {
      res = await supabase.from("schedules").select<string, ISchedule>(queryString);
    }

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
  upsert: async (user: User | null, schedules: ISchedule[]) => {
    if (!user) return;

    const { update, create } = schedules.reduce(
      (acc, cur) => {
        const body = {
          user_id: user.id,
          date: cur.date,
          name: cur.name,
          price: cur.price,
          type_id: cur.type_id,
          category_id: cur.category_id,
        };

        if (cur.id) {
          acc.update.push({
            id: cur.id,
            ...body,
          });
        } else {
          acc.create.push(body);
        }

        return acc;
      },
      { update: [] as ISchedule[], create: [] as ISchedule[] }
    );

    const updateRes = await supabase.from("schedules").upsert(update);

    if (updateRes.error) throw new Error(updateRes.error.message);

    const createRes = await supabase.from("schedules").insert(create);

    if (createRes.error) throw new Error(createRes.error.message);

    return 200;
  },
};
