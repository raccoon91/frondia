import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { supabase } from "@/lib/supabase";

interface HomeStore {
  statistics: Statistics;

  getStatistics: () => Promise<void>;
}

export const useHomeStore = create<HomeStore>()(
  devtools(
    persist(
      (set) => ({
        statistics: {},

        getStatistics: async () => {
          try {
            const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD HH:mm");

            const { data: types, error: typeErorr } = await supabase
              .from("transaction_types")
              .select("*")
              .order("order", { ascending: true });

            if (typeErorr) throw typeErorr;

            const { data: categories, error: categoryError } = await supabase
              .from("categories")
              .select("*")
              .order("order", { ascending: true });

            if (categoryError) throw categoryError;

            const statistics: Statistics = {};

            types?.forEach((type) => {
              statistics[type.id] = { type, category: {} };
            });

            categories?.forEach((category) => {
              if (!statistics?.[category.type_id]?.category) return;

              statistics[category.type_id].category[category.id] = {
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

              if (!statistics?.[typeId]?.category?.[categoryId]?.transaction) return;

              statistics[typeId].category[categoryId].transaction.amount += transaction.amount;
              statistics[typeId].category[categoryId].transaction.count += 1;
            });

            set({ statistics }, false, "getStatistics");
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: "home-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          statistics: state.statistics,
        }),
      },
    ),
  ),
);
