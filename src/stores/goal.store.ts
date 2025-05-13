import dayjs from "dayjs";
import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { GOAL_STATUS } from "@/constants/goal";
import { STORE_NAME } from "@/constants/store";
import { supabase } from "@/lib/supabase/client";
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

            const { data: goals, error: goalErorr } = await supabase
              .from("goals")
              .select(
                `
                  *,
                  type: type_id (*),
                  currency: currency_id (*),
                  map: goal_category_map (id, category: categories (*))
                `,
              )
              // .or(
              //   `
              //   repeat.eq.every,
              //   and(repeat.eq.once,period.eq.month,start.lte.${endOfMonth},end.gte.${startOfMonth}),
              //   and(repeat.eq.once,period.eq.week,start.lte.${endOfWeek},end.gte.${startOfWeek})
              //   `,
              // )
              .lte("start", endOfMonth)
              .gte("end", startOfMonth)
              .order("start", { ascending: true })
              .order("created_at", { ascending: true });

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
            }

            set({ goalsInReady, goalsInProgress, goalsInDone }, false, "getGoals");
          } catch (error) {
            log.error(error);
          }
        },
        getGoal: async (goalId: number) => {
          try {
            set({ isLoading: true }, false, "getGoal");

            const { data, error } = await supabase
              .from("goals")
              .select(
                `
                  *,
                  type: type_id (*),
                  currency: currency_id (*),
                  map: goal_category_map (id, category: categories (*))
                `,
              )
              .eq("id", goalId)
              .maybeSingle();

            if (error) throw error;

            set({ isLoading: false }, false, "getGoal");

            return data;
          } catch (error) {
            set({ isLoading: false }, false, "getGoal");

            log.error(error);
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
            set({ isLoading: false }, false, "createGoal");

            log.error(error);
          }
        },
        updateGoal: async (goal: Goal, formdata: z.infer<typeof goalFormSchema>) => {
          try {
            set({ isLoading: true }, false, "updateGoal");

            const { error: macroError } = await supabase
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

            if (macroError) throw macroError;

            const created = formdata.categories.reduce<{ goal_id: number; category_id: number }[]>(
              (created, categoryId) => {
                if (goal.map?.find((map) => map.category.id.toString() === categoryId)) return created;

                created.push({
                  goal_id: goal.id,
                  category_id: Number(categoryId),
                });

                return created;
              },
              [],
            );

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

            set({ isLoading: false }, false, "updateGoal");
          } catch (error) {
            set({ isLoading: false }, false, "updateGoal");

            log.error(error);
          }
        },
        removeGoal: async (goalId: number) => {
          try {
            set({ isLoading: true }, false, "removeGoal");

            const { error } = await supabase.from("goals").delete().eq("id", goalId);

            if (error) throw error;

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
