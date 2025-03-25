import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { z } from "zod";
import dayjs from "dayjs";

import { STORE_NAME } from "@/constants/store";
import { GOAL_STATUS } from "@/constants/goal";
import { goalFormSchema } from "@/schema/goal.schema";
import { supabase } from "@/lib/supabase/client";
import { useLocalStore } from "./local.store";

interface GoalStore {
  isLoading: boolean;

  goalsInReady: Goal[];
  goalsInProgress: Goal[];
  goalsInDone: Goal[];

  getGoals: () => Promise<void>;
  createGoal: (formdata: z.infer<typeof goalFormSchema>) => Promise<void>;

  movePrevMonth: (date: string) => void;
  moveNextMonth: (date: string) => void;
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
            const localDate = useLocalStore.getState().localDate;

            const startOfMonth = dayjs(localDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(localDate).endOf("month").format("YYYY-MM-DD HH:mm");
            const today = dayjs().format("YYYY-MM-DD 00:00");

            const { data: goals, error: goalErorr } = await supabase
              .from("goals")
              .select(
                "*, type: type_id (*), currency: currency_id (*), map:goal_category_map (category:categories (*))",
              )
              .lte("start", endOfMonth)
              .gte("end", startOfMonth);

            if (goalErorr) throw goalErorr;

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

            if (updated.length) {
              await supabase.from("goals").upsert(
                updated.map((goal) => ({
                  id: goal.id,
                  user_id: goal.user_id,
                  name: goal.name,
                  type_id: goal.type_id,
                  currency_id: goal.currency_id,
                  amount: goal.amount,
                  period: goal.period,
                  start: goal.start,
                  end: goal.end,
                  status: goal.status,
                  created_at: goal.created_at,
                  rule: goal.rule,
                  date_unit: goal.date_unit,
                })),
              );
            }

            set({ goalsInReady, goalsInProgress, goalsInDone }, false, "getGoals");
          } catch (error) {
            console.error(error);
          }
        },
        createGoal: async (formdata) => {
          try {
            set({ isLoading: true }, false, "createGoal");

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

            if (!data) {
              set({ isLoading: false }, false, "createGoal");
              return;
            }

            if (goalErorr) throw goalErorr;

            const categoryMap = formdata.categories.map((categoryId) => ({
              goal_id: data.id,
              category_id: Number(categoryId),
            }));

            const { error: mapErorr } = await supabase.from("goal_category_map").insert(categoryMap);

            if (mapErorr) throw mapErorr;

            set({ isLoading: false }, false, "createGoal");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "createGoal");
          }
        },

        movePrevMonth: (date: string) => {
          useLocalStore.getState().setDate(dayjs(date).subtract(1, "month").format("YYYY-MM"));
        },
        moveNextMonth: (date: string) => {
          useLocalStore.getState().setDate(dayjs(date).add(1, "month").format("YYYY-MM"));
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
