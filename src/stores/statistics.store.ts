import { create } from "zustand";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";

export type IStatisticsCategory = Record<string, { value: number; color: string | null }>;

interface IStatisticsStore {
  isFetched: boolean;
  isLoaded: boolean;
  price: {
    income: number;
    saving: number;
    investment: number;
    expense: number;
    totalIncome: number;
    remain: number;
  } | null;
  category: Record<IExpenseTypes, IStatisticsCategory> | null;
  getMonthlyExpense: () => Promise<void>;
}

export const useStatisticsStore = create<IStatisticsStore>(set => ({
  isFetched: false,
  isLoaded: false,
  price: null,
  category: null,
  getMonthlyExpense: async () => {
    try {
      set({ isLoaded: false });

      const date = {
        from: dayjs().startOf("month").format("YYYY-MM-DD"),
        to: dayjs().endOf("month").format("YYYY-MM-DD"),
      };

      const expenses = await expenseApi.gets({ query: "*, types ( * ), categories ( * )", date });

      const { price, category } = expenses.reduce(
        (acc, cur) => {
          if (!cur.price) return acc;

          if (cur.types?.name === "수입") {
            acc.price.income += cur.price;
            acc.price.totalIncome += cur.price;
            acc.price.remain += cur.price;
          } else if (cur.types?.name === "지출") {
            acc.price.expense += cur.price;
            acc.price.remain -= cur.price;
          } else if (cur.types?.name === "저축") {
            acc.price.saving += cur.price;
            acc.price.totalIncome += cur.price;
            acc.price.remain -= cur.price;
          } else if (cur.types?.name === "투자") {
            acc.price.investment += cur.price;
            acc.price.totalIncome += cur.price;
            acc.price.remain -= cur.price;
          }

          if (!cur.types?.name || !cur.categories?.name) return acc;

          if (!acc.category[cur.types.type]) acc.category[cur.types.type] = {};

          if (!acc.category[cur.types.type]?.[cur.categories.name])
            acc.category[cur.types.type][cur.categories.name] = { value: 0, color: cur.categories.color };

          acc.category[cur.types.type][cur.categories.name].value += cur.price;

          return acc;
        },
        {
          price: { income: 0, saving: 0, investment: 0, expense: 0, totalIncome: 0, remain: 0 },
          category: {} as Record<IExpenseTypes, IStatisticsCategory>,
        }
      );

      set({ isFetched: true, isLoaded: true, price, category });
    } catch (error) {
      toast.error(error);
    }
  },
}));
