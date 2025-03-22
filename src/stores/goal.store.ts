import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { z } from "zod";

import { STORE_NAME } from "@/constants/store";
import { goalFormSchema } from "@/schema/goal.schema";
import { supabase } from "@/lib/supabase/client";

interface GoalStore {
  goals: Goal[];

  getGoals: () => Promise<void>;
  createGoal: (formdata: z.infer<typeof goalFormSchema>) => Promise<void>;
}

export const useGoalStore = create<GoalStore>()(
  devtools(
    persist(
      (set) => ({
        goals: [],

        getGoals: async () => {
          try {
            const { data: goals, error: goalErorr } = await supabase
              .from("goals")
              .select(
                "*, type: type_id (*), currency: currency_id (*), map:goal_category_map (category:categories (*))",
              );

            if (goalErorr) throw goalErorr;

            set({ goals }, false, "getGoals");
          } catch (error) {
            console.error(error);
          }
        },
        createGoal: async (formdata) => {
          try {
            const { data, error: goalErorr } = await supabase
              .from("goals")
              .insert({
                name: formdata.name,
                type_id: Number(formdata.type_id),
                currency_id: Number(formdata.currency_id),
                amount: Number(formdata.amount),
                rule: formdata.rule,
                period: Number(formdata.period),
                date_unit: formdata.date_unit,
                start: formdata.start,
                end: formdata.end,
                status: formdata.status,
              })
              .select("*")
              .maybeSingle();

            if (!data) return;

            if (goalErorr) throw goalErorr;

            const categoryMap = formdata.categories.map((categoryId) => ({
              goal_id: data.id,
              category_id: Number(categoryId),
            }));

            const { error: mapErorr } = await supabase.from("goal_category_map").insert(categoryMap);

            if (mapErorr) throw mapErorr;
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.GOAL,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          goals: state.goals,
        }),
      },
    ),
  ),
);
