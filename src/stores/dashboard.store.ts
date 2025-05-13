import dayjs from "dayjs";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { GOAL_RULE, GOAL_STATUS } from "@/constants/goal";
import { STORE_NAME } from "@/constants/store";
import { supabase } from "@/lib/supabase/client";
import { log } from "@/utils/log";
import { mapBy } from "@/utils/map-by";
import { useSessionStore } from "./common/session.store";
import { useTransactionOptionStore } from "./transaction-option.store";

interface DashboardStore {
  transactions: Transaction[];
  statistics: Statistics;
  calendarStatisticsMap: CalendarStatisticsMap | null;
  calendarCountByTypeMap: CalendarCountByTypeMap | null;
  goalsInProgress: GoalInProgress[];

  getTransactions: () => Promise<void>;
  getStatistics: () => Promise<void>;
  getCalendarStatistics: () => Promise<void>;
  getGoalsInProgress: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        transactions: [],
        statistics: [],
        calendarStatisticsMap: null,
        calendarCountByTypeMap: null,
        goalsInProgress: [],

        getTransactions: async () => {
          try {
            const sessionDate = useSessionStore.getState().sessionDate;

            const startOfMonth = dayjs(sessionDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(sessionDate).endOf("month").format("YYYY-MM-DD HH:mm");

            const { data: transactions, error: transactionError } = await supabase
              .from("transactions")
              .select("*")
              .gte("date", startOfMonth)
              .lte("date", endOfMonth);

            if (transactionError) throw transactionError;

            set({ transactions }, false, "getTransactions");
          } catch (error) {
            log.error(error);
          }
        },
        getStatistics: async () => {
          try {
            const types = useTransactionOptionStore.getState().transactionTypes;
            const categories = useTransactionOptionStore.getState().categories;
            const currencies = useTransactionOptionStore.getState().currencies;

            const transactions = get().transactions;

            const statisticsMap: StatisticsMap = {};

            types?.forEach((type) => {
              statisticsMap[type.id] = {
                type,
                totalUsd: 0,
                totalSummaryMap: {},
                categoryMap: {},
              };
            });

            categories?.forEach((category) => {
              if (!statisticsMap?.[category.type_id]?.categoryMap) return;

              statisticsMap[category.type_id].categoryMap[category.id] = {
                category,
                currencyMap: {},
              };
            });

            const currencyMapById = mapBy(currencies, "id");

            transactions?.forEach((transaction) => {
              const typeId = transaction.type_id;
              const categoryId = transaction.category_id;
              const currencyId = transaction.currency_id;

              if (!statisticsMap?.[typeId]?.categoryMap?.[categoryId]) return;
              if (!statisticsMap?.[typeId]?.totalSummaryMap?.[currencyId]) {
                statisticsMap[typeId].totalSummaryMap[currencyId] = {
                  currency: currencyMapById[currencyId],
                  totalAmount: 0,
                  totalCount: 0,
                };
              }
              if (!statisticsMap?.[typeId]?.categoryMap?.[categoryId]?.currencyMap?.[currencyId]) {
                statisticsMap[typeId].categoryMap[categoryId].currencyMap[currencyId] = {
                  currency: currencyMapById[currencyId],
                  transaction: {
                    usd: 0,
                    count: 0,
                    amount: 0,
                  },
                };
              }

              statisticsMap[typeId].totalUsd += transaction.amount * transaction.usd_rate;

              statisticsMap[typeId].totalSummaryMap[currencyId].totalCount += 1;
              statisticsMap[typeId].totalSummaryMap[currencyId].totalAmount += transaction.amount;

              statisticsMap[typeId].categoryMap[categoryId].currencyMap[currencyId].transaction.usd +=
                transaction.amount * transaction.usd_rate;
              statisticsMap[typeId].categoryMap[categoryId].currencyMap[currencyId].transaction.count += 1;
              statisticsMap[typeId].categoryMap[categoryId].currencyMap[currencyId].transaction.amount +=
                transaction.amount;
            });

            const statistics = Object.values(statisticsMap)
              .filter(({ totalUsd }) => totalUsd)
              .map(({ type, totalUsd, totalSummaryMap, categoryMap }) => ({
                type,
                totalUsd,
                totalSummaries: Object.values(totalSummaryMap ?? {}).map(({ currency, totalCount, totalAmount }) => ({
                  currency,
                  totalCount,
                  totalAmount,
                })),
                categories: Object.values(categoryMap ?? {})
                  .filter(({ currencyMap }) => Object.values(currencyMap).length)
                  .map(({ category, currencyMap }) => ({
                    category,
                    currencies: Object.values(currencyMap)
                      .filter(({ transaction }) => transaction.count)
                      .map(({ currency, transaction }) => ({
                        currency,
                        transaction,
                      })),
                  })),
              }));

            set({ statistics }, false, "getStatistics");
          } catch (error) {
            log.error(error);
          }
        },
        getCalendarStatistics: async () => {
          try {
            const types = useTransactionOptionStore.getState().transactionTypes;
            const currencies = useTransactionOptionStore.getState().currencies;

            const transactions = get().transactions;

            const calendarStatisticsMap: CalendarStatisticsMap = {};
            const calendarCountByTypeMap: CalendarCountByTypeMap = {};

            const typeMapById = mapBy(types, "id");
            const currencyMapById = mapBy(currencies, "id");

            transactions?.forEach((transaction) => {
              const type = typeMapById[transaction.type_id];
              const currency = currencyMapById[transaction.currency_id];
              const date = dayjs(transaction.date).format("YYYY-MM-DD");

              if (!type) return;

              if (!calendarStatisticsMap?.[date]) {
                calendarStatisticsMap[date] = {};
              }
              if (!calendarStatisticsMap?.[date]?.[type.id]) {
                calendarStatisticsMap[date][type.id] = { type, count: 0, usd: 0, currencyMap: {} };
              }
              if (!calendarStatisticsMap?.[date]?.[type.id]?.currencyMap?.[currency.id]) {
                calendarStatisticsMap[date][type.id].currencyMap[currency.id] = { currency, amount: 0 };
              }

              if (!calendarCountByTypeMap?.[type.id]) {
                calendarCountByTypeMap[type.id] = { type, count: 0 };
              }

              calendarStatisticsMap[date][type.id].count += 1;
              calendarStatisticsMap[date][type.id].usd += transaction.amount * transaction.usd_rate;
              calendarStatisticsMap[date][type.id].currencyMap[currency.id].amount += transaction.amount;
              calendarCountByTypeMap[type.id].count += 1;
            });

            set({ calendarStatisticsMap, calendarCountByTypeMap }, false, "getCalendarStatistics");
          } catch (error) {
            log.error(error);
          }
        },
        getGoalsInProgress: async () => {
          try {
            const sessionDate = useSessionStore.getState().sessionDate;

            const startOfMonth = dayjs(sessionDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(sessionDate).endOf("month").format("YYYY-MM-DD HH:mm");
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
                `
                  *,
                  type: type_id (*),
                  currency: currency_id (*),
                  map: goal_category_map (id, category: categories (*))
                `,
              )
              .lte("start", endOfMonth)
              .gte("end", startOfMonth)
              .order("start", { ascending: true })
              .order("created_at", { ascending: true });

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
                  let result: GoalInProgress["result"] = "success";
                  let value = 0;

                  goal.map.forEach(({ category }) => {
                    const transactionsByCategory = transactionMapByCategoryId?.[category.id] ?? [];

                    transactionsByCategory.forEach((transaction) => {
                      if (goal.currency_id === transaction.currency_id) {
                        totalAmount += transaction.amount;
                      }
                    });
                  });

                  if (goal.rule === GOAL_RULE.GREATER) {
                    result = totalAmount >= goal.amount ? "success" : "failure";
                    value = (totalAmount / goal.amount) * 100;
                  } else if (goal.rule === GOAL_RULE.LESS) {
                    result = totalAmount <= goal.amount ? "success" : "failure";
                    value = (totalAmount / goal.amount) * 100;
                  }

                  acc.goalsInProgress.push({
                    id: goal.id,
                    rule: goal.rule,
                    result,
                    name: goal.name,
                    value,
                    remain:
                      goal.period === "custom"
                        ? dayjs(goal.end).diff(dayjs(), "day")
                        : dayjs(dayjs().endOf(goal.period as "month" | "week")).diff(dayjs(), "day"),
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

            set({ goalsInProgress }, false, "getGoalsInProgress");
          } catch (error) {
            log.error(error);
          }
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
