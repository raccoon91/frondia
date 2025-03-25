import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { STORE_NAME } from "@/constants/store";
import { CALENDAR_TYPE_POSITION } from "@/constants/calendar";
import { GOAL_RULE, GOAL_STATUS } from "@/constants/goal";
import { supabase } from "@/lib/supabase/client";
import { useLocalStore } from "./local.store";
import { useTransactionOptionStore } from "./transaction-option.store";

interface DashboardStore {
  transactions: Transaction[];
  statistics: Statistics;
  calendarStatisticsMap: CalendarStatisticsMap;
  goalsInProgress: GoalInProgress[];

  getTransactions: () => Promise<void>;
  getStatistics: () => Promise<void>;
  getCalendarStatistics: () => Promise<void>;
  getGoalsInProgress: () => Promise<void>;

  movePrevMonth: (date: string) => void;
  moveNextMonth: (date: string) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        transactions: [],
        statistics: [],
        calendarStatisticsMap: {},
        goalsInProgress: [],

        getTransactions: async () => {
          try {
            const localDate = useLocalStore.getState().localDate;

            const startOfMonth = dayjs(localDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(localDate).endOf("month").format("YYYY-MM-DD HH:mm");

            const { data: transactions, error: transactionError } = await supabase
              .from("transactions")
              .select("*")
              .gte("date", startOfMonth)
              .lte("date", endOfMonth);

            if (transactionError) throw transactionError;

            set({ transactions }, false, "getTransactions");
          } catch (error) {
            console.error(error);
          }
        },
        getStatistics: async () => {
          try {
            const types = useTransactionOptionStore.getState().transactionTypes;
            const categories = useTransactionOptionStore.getState().categories;

            const transactions = get().transactions;

            const statisticsMap: StatisticsMap = {};

            types?.forEach((type) => {
              statisticsMap[type.id] = { type, totalAmount: 0, totalCount: 0, categoryMap: {} };
            });

            categories?.forEach((category) => {
              if (!statisticsMap?.[category.type_id]?.categoryMap) return;

              statisticsMap[category.type_id].categoryMap![category.id] = {
                category,
                transaction: { amount: 0, count: 0 },
              };
            });

            transactions?.forEach((transaction) => {
              const typeId = transaction.type_id;
              const categoryId = transaction.category_id;

              if (!statisticsMap?.[typeId]?.categoryMap?.[categoryId]?.transaction) return;

              statisticsMap[typeId].totalAmount += transaction.amount;
              statisticsMap[typeId].totalCount += 1;

              statisticsMap[typeId].categoryMap[categoryId].transaction.amount += transaction.amount;
              statisticsMap[typeId].categoryMap[categoryId].transaction.count += 1;
            });

            const statistics = Object.values(statisticsMap)
              .filter((statistic) => statistic.totalCount)
              .map(({ type, totalAmount, totalCount, categoryMap }) => ({
                type,
                totalAmount,
                totalCount,
                categories: Object.values(categoryMap ?? {})
                  .filter(({ transaction }) => transaction.count)
                  .map(({ category, transaction }) => ({
                    category,
                    transaction,
                  })),
              }));

            set({ statistics }, false, "getStatistics");
          } catch (error) {
            console.error(error);
          }
        },
        getCalendarStatistics: async () => {
          try {
            const types = useTransactionOptionStore.getState().transactionTypes;

            const transactions = get().transactions;

            const calendarStatisticsMap: CalendarStatisticsMap = {};
            const typeMap = types.reduce<Record<number, TransactionType>>((typeMap, type) => {
              typeMap[type.id] = type;

              return typeMap;
            }, {});

            transactions?.forEach((transaction) => {
              const type = typeMap[transaction.type_id];
              const date = dayjs(transaction.date).format("YYYY-MM-DD");

              if (!type) return;

              if (!calendarStatisticsMap?.[date]) calendarStatisticsMap[date] = {};
              if (!calendarStatisticsMap?.[date]?.[type.id]) {
                calendarStatisticsMap[date][type.id] = {
                  type,
                  position: CALENDAR_TYPE_POSITION[type.id],
                  count: 0,
                };
              }

              calendarStatisticsMap[date][type.id].count += 1;
            });

            set({ calendarStatisticsMap }, false, "getCalendarStatistics");
          } catch (error) {
            console.error(error);
          }
        },
        getGoalsInProgress: async () => {
          try {
            const localDate = useLocalStore.getState().localDate;

            const startOfMonth = dayjs(localDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(localDate).endOf("month").format("YYYY-MM-DD HH:mm");
            const today = dayjs().format("YYYY-MM-DD 00:00");

            const transactions = get().transactions;

            const transactionMapByCategoryId = transactions.reduce<Record<number, Transaction[]>>(
              (map, transaction) => {
                if (!map[transaction.category_id]) map[transaction.category_id] = [];

                map[transaction.category_id].push(transaction);

                return map;
              },
              {},
            );

            const { data: goals, error: goalErorr } = await supabase
              .from("goals")
              .select(
                "*, type: type_id (*), currency: currency_id (*), map:goal_category_map (category:categories (*))",
              )
              .lte("start", endOfMonth)
              .gte("end", startOfMonth);

            if (goalErorr) throw goalErorr;

            const { goalsInProgress, updated } = goals.reduce<{
              goalsInProgress: GoalInProgress[];
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

                if (goal.status === GOAL_STATUS.PROGRESS) {
                  let totalAmount = 0;
                  let totalCount = 0;
                  let result: GoalInProgress["result"] = "success";
                  let value = 0;

                  goal.map.forEach(({ category }) => {
                    const transactions = transactionMapByCategoryId?.[category.id] ?? [];

                    transactions.forEach((transaction) => {
                      totalAmount += transaction.amount;
                      totalCount += 1;
                    });
                  });

                  if (goal.rule === GOAL_RULE.FIXED_AMOUNT) {
                    result = totalAmount >= goal.amount ? "success" : "failure";
                    value = (totalAmount / goal.amount) * 100;
                  } else if (goal.rule === GOAL_RULE.SPENDING_LIMIT) {
                    result = totalAmount <= goal.amount ? "success" : "failure";
                    value = (totalAmount / goal.amount) * 100;
                  } else if (goal.rule === GOAL_RULE.COUNT_AMOUNT) {
                    result = totalCount >= goal.amount ? "success" : "failure";
                    value = (totalCount / goal.amount) * 100;
                  } else if (goal.rule === GOAL_RULE.COUNT_LIMIT) {
                    result = totalCount < goal.amount ? "success" : "failure";
                    value = (totalCount / goal.amount) * 100;
                  }

                  acc.goalsInProgress.push({
                    id: goal.id,
                    rule: goal.rule,
                    result,
                    name: goal.name,
                    value,
                    remain: dayjs(goal.end).diff(dayjs(), "day"),
                  });
                }

                return acc;
              },
              { goalsInProgress: [], updated: [] },
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

            set({ goalsInProgress }, false, "getGoalsInProgress");
          } catch (error) {
            console.error(error);
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
        name: STORE_NAME.DASHBOARD,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          transactions: state.transactions,
          statistics: state.statistics,
          calendarStatisticsMap: state.calendarStatisticsMap,
          goalsInProgress: state.goalsInProgress,
        }),
      },
    ),
  ),
);
