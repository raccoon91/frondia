import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { STORE_NAME } from "@/constants/store";
import { CALENDAR_TYPE_POSITION } from "@/constants/calendar";
import { GOAL_STATUS } from "@/constants/goal";
import { supabase } from "@/lib/supabase/client";
import { useLocalStore } from "./local.store";
import { useTransactionOptionStore } from "./transaction-option.store";

interface HomeStore {
  statistics: Statistics;
  calendarStatisticsMap: CalendarStatisticsMap;
  goalsInProgress: Goal[];

  getStatistics: () => Promise<void>;
  getGoalsInProgress: () => Promise<void>;

  movePrevMonth: (date: string) => void;
  moveNextMonth: (date: string) => void;
}

export const useHomeStore = create<HomeStore>()(
  devtools(
    persist(
      (set) => ({
        statistics: [],
        calendarStatisticsMap: {},
        goalsInProgress: [],

        getStatistics: async () => {
          try {
            const localDate = useLocalStore.getState().localDate;

            const startOfMonth = dayjs(localDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(localDate).endOf("month").format("YYYY-MM-DD HH:mm");

            const types = useTransactionOptionStore.getState().transactionTypes;
            const categories = useTransactionOptionStore.getState().categories;

            const typeMap = types.reduce<Record<number, TransactionType>>((typeMap, type) => {
              typeMap[type.id] = type;

              return typeMap;
            }, {});

            const statisticsMap: StatisticsMap = {};
            const calendarStatisticsMap: CalendarStatisticsMap = {};

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

            const { data: transactions, error: transactionError } = await supabase
              .from("transactions")
              .select("*")
              .gte("date", startOfMonth)
              .lte("date", endOfMonth);

            if (transactionError) throw transactionError;

            transactions?.forEach((transaction) => {
              const typeId = transaction.type_id;
              const categoryId = transaction.category_id;

              if (!statisticsMap?.[typeId]?.categoryMap?.[categoryId]?.transaction) return;

              statisticsMap[typeId].totalAmount += transaction.amount;
              statisticsMap[typeId].totalCount += 1;

              statisticsMap[typeId].categoryMap[categoryId].transaction.amount += transaction.amount;
              statisticsMap[typeId].categoryMap[categoryId].transaction.count += 1;

              const type = typeMap[typeId];
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

            set({ statistics, calendarStatisticsMap }, false, "getStatistics");
          } catch (error) {
            console.error(error);
          }
        },
        getGoalsInProgress: async () => {
          try {
            const { data: goalsInProgress, error: goalErorr } = await supabase
              .from("goals")
              .select(
                "*, type: type_id (*), currency: currency_id (*), map:goal_category_map (category:categories (*))",
              )
              .eq("status", GOAL_STATUS.PROGRESS);

            if (goalErorr) throw goalErorr;

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
        name: STORE_NAME.HOME,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          statistics: state.statistics,
          calendarStatisticsMap: state.calendarStatisticsMap,
        }),
      },
    ),
  ),
);
