import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { goalMacroAPI } from "@/apis/goal-macro.api";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { STORE_NAME } from "@/constants/store";
import type { goalMacroFormSchema } from "@/schema/macro.schema";
import { log } from "@/utils/log";
import { useMacroOptionStore } from "./macro-option.store";

interface GoalMacroStore {
  isLoading: boolean;

  goalMacros: GoalMacro[];
  allGoalMacros: GoalMacro[];

  getGoalMacros: () => Promise<void>;
  getAllGoalMacros: () => Promise<void>;
  getGoalMacro: (goalMacroId: number) => Promise<Nullish<GoalMacro>>;
  createGoalMacro: (formdata: z.infer<typeof goalMacroFormSchema>) => Promise<void>;
  updateGoalMacro: (goalMacro: GoalMacro, formdata: z.infer<typeof goalMacroFormSchema>) => Promise<void>;
  toggleGoalMacroActive: (goalMacroId: number, active: boolean) => Promise<void>;
  removeGoalMacro: (goalMacroId: number) => Promise<void>;
}

export const useGoalMacroStore = create<GoalMacroStore>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,

        goalMacros: [],
        allGoalMacros: [],

        getGoalMacros: async () => {
          try {
            const data = await goalMacroAPI.gets({ active: MACRO_ACTIVE_STATUS.ACTIVE });

            set({ goalMacros: data ?? [] }, false, "getGoalMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getAllGoalMacros: async () => {
          try {
            const status = useMacroOptionStore.getState().status;

            const data = await goalMacroAPI.gets({ active: status });

            set({ allGoalMacros: data ?? [] }, false, "getAllGoalMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getGoalMacro: async (goalMacroId: number) => {
          try {
            set({ isLoading: true }, false, "getGoalMacro");

            const data = await goalMacroAPI.get({ id: goalMacroId });

            set({ isLoading: false }, false, "getGoalMacro");

            return data;
          } catch (error) {
            set({ isLoading: false }, false, "getGoalMacro");

            log.error(error);
          }
        },
        createGoalMacro: async (formdata: z.infer<typeof goalMacroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "createGoalMacro");

            await goalMacroAPI.create(formdata);

            set({ isLoading: false }, false, "createGoalMacro");
          } catch (error) {
            set({ isLoading: false }, false, "createGoalMacro");

            log.error(error);
          }
        },
        updateGoalMacro: async (goalMacro: GoalMacro, formdata: z.infer<typeof goalMacroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "updateGoalMacro");

            await goalMacroAPI.update(goalMacro, formdata);

            set({ isLoading: false }, false, "updateGoalMacro");
          } catch (error) {
            set({ isLoading: false }, false, "updateGoalMacro");

            log.error(error);
          }
        },
        toggleGoalMacroActive: async (goalMacroId: number, active: boolean) => {
          try {
            set({ isLoading: true }, false, "toggleGoalMacroActive");

            await goalMacroAPI.toggle({ id: goalMacroId, active });

            set({ isLoading: false }, false, "toggleGoalMacroActive");
          } catch (error) {
            set({ isLoading: false }, false, "toggleGoalMacroActive");

            log.error(error);
          }
        },
        removeGoalMacro: async (goalMacroId: number) => {
          try {
            set({ isLoading: true }, false, "removeGoalMacro");

            await goalMacroAPI.delete({ id: goalMacroId });

            set({ isLoading: false }, false, "removeGoalMacro");
          } catch (error) {
            set({ isLoading: false }, false, "removeGoalMacro");

            log.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.GOAL_MACRO,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          goalMacros: state.goalMacros,
          allGoalMacros: state.allGoalMacros,
        }),
      },
    ),
  ),
);
