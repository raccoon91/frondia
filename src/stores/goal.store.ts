import dayjs from "dayjs";
import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { goalAPI } from "@/apis/goal.api";
import { GOAL_STATUS } from "@/constants/goal";
import { STORE_NAME } from "@/constants/store";
import type { goalFormSchema } from "@/schema/goal.schema";
import { log } from "@/utils/log";
import { useSessionStore } from "./common/session.store";

interface GoalStore {
  isLoading: boolean;

  goalsInReady: Goal[];
  goalsInProgress: Goal[];
  goalsInDone: Goal[];

  getGoals: () => Promise<void>;
  getGoal: (goalId: number) => Promise<Nullish<Goal>>;
  createGoal: (formdata: z.infer<typeof goalFormSchema>) => Promise<void>;
  updateGoal: (goal: Goal, formdata: z.infer<typeof goalFormSchema>) => Promise<void>;
  removeGoal: (goalId: number) => Promise<void>;
}

export const useGoalStore = create<GoalStore>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,

        goalsInReady: [],
        goalsInProgress: [],
        goalsInDone: [],

        getGoals: async () => {
          try {
            const sessionDate = useSessionStore.getState().sessionDate;

            const startOfMonth = dayjs(sessionDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(sessionDate).endOf("month").format("YYYY-MM-DD HH:mm");
            const today = dayjs().format("YYYY-MM-DD 00:00");

            const goals = await goalAPI.gets({ start: startOfMonth, end: endOfMonth });

            const { goalsInReady, goalsInProgress, goalsInDone, updated } = goals.reduce<{
              goalsInReady: Goal[];
              goalsInProgress: Goal[];
              goalsInDone: Goal[];
              updated: Goal[];
            }>(
              (acc, goal) => {
                if (
                  goal.status === GOAL_STATUS.READY &&
                  (dayjs(goal.start).isSame(today) || dayjs(goal.start).isBefore(today))
                ) {
                  // change goal status to progress
                  goal.status = GOAL_STATUS.PROGRESS;

                  acc.updated.push(goal);
                } else if (goal.status === GOAL_STATUS.PROGRESS && dayjs(goal.end).isBefore(today)) {
                  // change goal status to done
                  goal.status = GOAL_STATUS.DONE;

                  acc.updated.push(goal);
                }

                if (goal.status === GOAL_STATUS.READY) acc.goalsInReady.push(goal);
                if (goal.status === GOAL_STATUS.PROGRESS) acc.goalsInProgress.push(goal);
                if (goal.status === GOAL_STATUS.DONE) acc.goalsInDone.push(goal);

                return acc;
              },
              {
                goalsInReady: [],
                goalsInProgress: [],
                goalsInDone: [],
                updated: [],
              },
            );

            await goalAPI.bulkUpdate(updated);

            set({ goalsInReady, goalsInProgress, goalsInDone }, false, "getGoals");
          } catch (error) {
            log.error(error);
          }
        },
        getGoal: async (goalId: number) => {
          try {
            set({ isLoading: true }, false, "getGoal");

            const data = await goalAPI.get({ id: goalId });

            set({ isLoading: false }, false, "getGoal");

            return data;
          } catch (error) {
            set({ isLoading: false }, false, "getGoal");

            log.error(error);
          }
        },
        createGoal: async (formdata: z.infer<typeof goalFormSchema>) => {
          try {
            set({ isLoading: true }, false, "createGoal");

            await goalAPI.create(formdata);

            set({ isLoading: false }, false, "createGoal");
          } catch (error) {
            set({ isLoading: false }, false, "createGoal");

            log.error(error);
          }
        },
        updateGoal: async (goal: Goal, formdata: z.infer<typeof goalFormSchema>) => {
          try {
            set({ isLoading: true }, false, "updateGoal");

            await goalAPI.update(goal, formdata);

            set({ isLoading: false }, false, "updateGoal");
          } catch (error) {
            set({ isLoading: false }, false, "updateGoal");

            log.error(error);
          }
        },
        removeGoal: async (goalId: number) => {
          try {
            set({ isLoading: true }, false, "removeGoal");

            await goalAPI.delete({ id: goalId });

            set({ isLoading: false }, false, "removeGoal");
          } catch (error) {
            set({ isLoading: false }, false, "removeGoal");

            log.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.GOAL,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          goalsInReady: state.goalsInReady,
          goalsInProgress: state.goalsInProgress,
          goalsInDone: state.goalsInDone,
        }),
      },
    ),
  ),
);
