import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";
import { supabase } from "@/lib/supabase/client";

interface GoalRuleStore {
  goalRules: GoalRule[];

  getGoalRules: () => Promise<void>;
}

export const useGoalRuleStore = create<GoalRuleStore>()(
  devtools(
    persist(
      (set) => ({
        goalRules: [],

        getGoalRules: async () => {
          try {
            const { data: goalRules, error } = await supabase.from("goal_rules").select("*");

            if (error) throw error;

            set({ goalRules }, false, "getGoalRules");
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.GOAL_RULE,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          goalRules: state.goalRules,
        }),
      },
    ),
  ),
);
