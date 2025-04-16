import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { STORE_NAME } from "@/constants/store";
import { GOAL_RULE_NAME, GOAL_STATUS } from "@/constants/goal";
import { supabase } from "@/lib/supabase/client";
import { useLocalStore } from "./local.store";
import { useTransactionOptionStore } from "./transaction-option.store";

interface DashboardStore {
  transactions: Transaction[];
  statistics: Statistics;
  calendarStatisticsMap: CalendarStatisticsMap;
  calendarStatisticsByTypeMap: CalendarStatisticsByTypeMap;
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
        calendarStatisticsByTypeMap: {},
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

            const currencyMapById = currencies?.reduce<Record<number, Currency>>((mapById, currency) => {
              mapById[currency.id] = currency;
              return mapById;
            }, {});

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
            console.error(error);
          }
        },
        getCalendarStatistics: async () => {
          try {
            const types = useTransactionOptionStore.getState().transactionTypes;

            const transactions = get().transactions;

            const calendarStatisticsMap: CalendarStatisticsMap = {};
            const calendarStatisticsByTypeMap: CalendarStatisticsByTypeMap = {};

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
                  count: 0,
                };
              }

              if (!calendarStatisticsByTypeMap?.[type.id]) {
                calendarStatisticsByTypeMap[type.id] = { type, count: 0, amount: 0 };
              }

              calendarStatisticsMap[date][type.id].count += 1;
              calendarStatisticsByTypeMap[type.id].count += 1;
              calendarStatisticsByTypeMap[type.id].amount += transaction.amount;
            });

            set({ calendarStatisticsMap, calendarStatisticsByTypeMap }, false, "getCalendarStatistics");
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
                `
                  *,
                  rule: rule_id (*),
                  type: type_id (*),
                  currency: currency_id (*),
                  map: goal_category_map (id, category: categories (*))
                `,
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

                  if (goal.rule.name === GOAL_RULE_NAME.FIXED_AMOUNT) {
                    result = totalAmount >= goal.amount ? "success" : "failure";
                    value = (totalAmount / goal.amount) * 100;
                  } else if (goal.rule.name === GOAL_RULE_NAME.SPENDING_LIMIT) {
                    result = totalAmount <= goal.amount ? "success" : "failure";
                    value = (totalAmount / goal.amount) * 100;
                  } else if (goal.rule.name === GOAL_RULE_NAME.COUNT_AMOUNT) {
                    result = totalCount >= goal.amount ? "success" : "failure";
                    value = (totalCount / goal.amount) * 100;
                  } else if (goal.rule.name === GOAL_RULE_NAME.COUNT_LIMIT) {
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
                  rule_id: goal.rule_id,
                  type_id: goal.type_id,
                  currency_id: goal.currency_id,
                  amount: goal.amount,
                  period: goal.period,
                  start: goal.start,
                  end: goal.end,
                  status: goal.status,
                  created_at: goal.created_at,
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
