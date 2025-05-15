import type { z } from "zod";

import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { supabase } from "@/lib/supabase/client";
import type { macroFormSchema } from "@/schema/macro.schema";

export const macroAPI = {
  gets: async ({ active }: { active?: string }) => {
    const builder = supabase.from("macros").select("*");

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
    const { data, error } = await supabase.from("macros").select("*").eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  },

  create: async (formdata: z.infer<typeof macroFormSchema>) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!authData?.user) throw new Error("User not exist");

    const { data, error } = await supabase.from("macros").insert({
      user_id: authData.user.id,
      name: formdata.name,
      type_id: formdata.type_id ? Number(formdata.type_id) : null,
      category_id: formdata.category_id ? Number(formdata.category_id) : null,
      currency_id: formdata.currency_id ? Number(formdata.currency_id) : null,
      amount: formdata.amount ? Number(formdata.amount) : null,
      memo: formdata.memo,
      day: formdata.day ? Number(formdata.day) : null,
      hour: formdata.hour ? Number(formdata.hour) : null,
      minute: formdata.minute ? Number(formdata.minute) : null,
      active: true,
    });

    if (error) throw error;

    return data;
  },

  update: async (macro: Macro, formdata: z.infer<typeof macroFormSchema>) => {
    const { data, error } = await supabase
      .from("macros")
      .update({
        user_id: macro.user_id,
        name: formdata.name,
        type_id: formdata.type_id ? Number(formdata.type_id) : null,
        category_id: formdata.category_id ? Number(formdata.category_id) : null,
        currency_id: formdata.currency_id ? Number(formdata.currency_id) : null,
        amount: formdata.amount ? Number(formdata.amount) : null,
        memo: formdata.memo,
        day: formdata.day ? Number(formdata.day) : null,
        hour: formdata.hour ? Number(formdata.hour) : null,
        minute: formdata.minute ? Number(formdata.minute) : null,
        active: macro.active,
      })
      .eq("id", macro.id);

    if (error) throw error;

    return data;
  },

  toggle: async ({ id, active }: { id: number; active: boolean }) => {
    const { data, error } = await supabase.from("macros").update({ active }).eq("id", id);

    if (error) throw error;

    return data;
  },

  delete: async ({ id }: { id: number }) => {
    const { data, error } = await supabase.from("macros").delete().eq("id", id);

    if (error) throw error;

    return data;
  },
};
