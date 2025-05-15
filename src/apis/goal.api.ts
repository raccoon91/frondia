import type { z } from "zod";

import { supabase } from "@/lib/supabase/client";
import type { goalFormSchema } from "@/schema/goal.schema";

// const { data, error } = await supabase
//   .from("goals")
//   .select("*, type: type_id (*), currency: currency_id (*), map: goal_category_map (id, category: categories (*))")
//   .or("repeat.eq.every, and(repeat.eq.once,period.eq.month,start.lte.${endOfMonth},end.gte.${startOfMonth}), and(repeat.eq.once,period.eq.week,start.lte.${endOfWeek},end.gte.${startOfWeek})")
//   .lte("start", start)
//   .gte("end", end)
//   .order("start", { ascending: true })
//   .order("created_at", { ascending: true });

export const goalAPI = {
  gets: async ({ start, end }: { start: string; end: string }) => {
    const { data, error } = await supabase
      .from("goals")
      .select("*, type: type_id (*), currency: currency_id (*), map: goal_category_map (id, category: categories (*))")
      .gte("start", start)
      .lte("end", end)
      .order("start", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  },

  get: async ({ id }: { id: number }) => {
    const { data, error } = await supabase
      .from("goals")
      .select("*, type: type_id (*), currency: currency_id (*), map: goal_category_map (id, category: categories (*))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  create: async (formdata: z.infer<typeof goalFormSchema>) => {
    const { data, error: goalErorr } = await supabase
      .from("goals")
      .insert({
        name: formdata.name,
        type_id: Number(formdata.type_id),
        rule: formdata.rule,
        amount: Number(formdata.amount),
        currency_id: Number(formdata.currency_id),
        period: formdata.period,
        start: formdata.start,
        end: formdata.end,
        status: formdata.status,
      })
      .select("*")
      .maybeSingle();

    if (goalErorr) throw goalErorr;

    if (!data) return null;

    const categoryMap = formdata.categories.map((categoryId) => ({
      goal_id: data.id,
      category_id: Number(categoryId),
    }));

    const { error: mapErorr } = await supabase.from("goal_category_map").insert(categoryMap);

    if (mapErorr) throw mapErorr;

    return data;
  },

  update: async (goal: Goal, formdata: z.infer<typeof goalFormSchema>) => {
    const { data, error: goalError } = await supabase
      .from("goals")
      .update({
        name: formdata.name,
        type_id: Number(formdata.type_id),
        rule: formdata.rule,
        amount: Number(formdata.amount),
        currency_id: Number(formdata.currency_id),
        period: formdata.period,
        start: formdata.start,
        end: formdata.end,
        status: formdata.status,
      })
      .eq("id", goal.id);

    if (goalError) throw goalError;

    const created = formdata.categories.reduce<{ goal_id: number; category_id: number }[]>((created, categoryId) => {
      if (goal.map?.find((map) => map.category.id.toString() === categoryId)) return created;

      created.push({
        goal_id: goal.id,
        category_id: Number(categoryId),
      });

      return created;
    }, []);

    const deleted = goal.map?.reduce<number[]>((deleted, map) => {
      if (formdata.categories.find((categoryId) => categoryId === map.category.id.toString())) return deleted;

      deleted.push(map.id);

      return deleted;
    }, []);

    if (created?.length) {
      const { error: mapErorr } = await supabase.from("goal_category_map").insert(created);

      if (mapErorr) throw mapErorr;
    }

    if (deleted?.length) {
      const { error: mapErorr } = await supabase.from("goal_category_map").delete().in("id", deleted);

      if (mapErorr) throw mapErorr;
    }

    return data;
  },

  delete: async ({ id }: { id: number }) => {
    const { error } = await supabase.from("goals").delete().eq("id", id);

    if (error) throw error;
  },

  bulkUpdate: async (goals: Goal[]) => {
    if (!goals.length) return null;

    const { data, error } = await supabase.from("goals").upsert(
      goals.map((goal) => ({
        id: goal.id,
        user_id: goal.user_id,
        name: goal.name,
        type_id: goal.type_id,
        rule: goal.rule,
        amount: goal.amount,
        currency_id: goal.currency_id,
        period: goal.period,
        start: goal.start,
        end: goal.end,
        status: goal.status,
        created_at: goal.created_at,
      })),
    );

    if (error) throw error;

    return data;
  },
};
