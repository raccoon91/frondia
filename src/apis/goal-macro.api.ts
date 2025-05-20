import type { z } from "zod";

import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { supabase } from "@/lib/supabase/client";
import type { goalMacroFormSchema } from "@/schema/macro.schema";

export const goalMacroAPI = {
  gets: async ({ active }: { active?: string }) => {
    const builder = supabase.from("goal_macros").select("*");

    if (active === MACRO_ACTIVE_STATUS.ACTIVE) {
      builder.eq("active", true);
    } else if (active === MACRO_ACTIVE_STATUS.INACTIVE) {
      builder.eq("active", false);
    }

    const { data, error } = await builder.order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  },

  get: async ({ id }: { id: number }) => {
    const { data, error } = await supabase.from("goal_macros").select("*").eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  },

  create: async (formdata: z.infer<typeof goalMacroFormSchema>) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!authData?.user) throw new Error("User not exist");

    const { data, error } = await supabase.from("goal_macros").insert({
      user_id: authData.user.id,
      name: formdata.name,
      goal_name: formdata.goal_name,
      type_id: formdata.type_id ? Number(formdata.type_id) : null,
      category_ids: formdata.category_ids?.length
        ? formdata.category_ids.map((categoryId) => Number(categoryId))
        : null,
      currency_id: formdata.currency_id ? Number(formdata.currency_id) : null,
      rule: formdata.rule,
      amount: formdata.amount ? Number(formdata.amount) : null,
      period: formdata.period,
      active: true,
    });

    if (error) throw error;

    return data;
  },

  update: async (macro: GoalMacro, formdata: z.infer<typeof goalMacroFormSchema>) => {
    const { data, error } = await supabase
      .from("goal_macros")
      .update({
        user_id: macro.user_id,
        name: formdata.name,
        goal_name: formdata.goal_name,
        type_id: formdata.type_id ? Number(formdata.type_id) : null,
        category_ids: formdata.category_ids?.length
          ? formdata.category_ids.map((categoryId) => Number(categoryId))
          : null,
        currency_id: formdata.currency_id ? Number(formdata.currency_id) : null,
        rule: formdata.rule,
        amount: formdata.amount ? Number(formdata.amount) : null,
        period: formdata.period,
        active: true,
      })
      .eq("id", macro.id);

    if (error) throw error;

    return data;
  },

  toggle: async ({ id, active }: { id: number; active: boolean }) => {
    const { data, error } = await supabase.from("goal_macros").update({ active }).eq("id", id);

    if (error) throw error;

    return data;
  },

  delete: async ({ id }: { id: number }) => {
    const { data, error } = await supabase.from("goal_macros").delete().eq("id", id);

    if (error) throw error;

    return data;
  },
};
