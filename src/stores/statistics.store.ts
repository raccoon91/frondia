import { create } from "zustand";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";

interface IStatisticsStore {
  price: {
    income: number | null;
    saving: number | null;
    investment: number | null;
    totalIncome: number | null;
    expense: number | null;
  } | null;
  getMonthlyExpense: () => Promise<void>;
}

export const useStatisticsStore = create<IStatisticsStore>(set => ({
  price: null,
  getMonthlyExpense: async () => {
    try {
      const date = {
        from: dayjs().startOf("month").format("YYYY-MM-DD"),
        to: dayjs().endOf("month").format("YYYY-MM-DD"),
      };

      const expenses = await expenseApi.gets({ date });

      const price = expenses.reduce(
        (acc, cur) => {
          if (!cur.price) return acc;

          if (cur.type_id === 7) {
            acc.income += cur.price;
            acc.totalIncome += cur.price;
          } else if (cur.type_id === 8) {
            acc.expense += cur.price;
          } else if (cur.type_id === 9) {
            acc.saving += cur.price;
            acc.totalIncome += cur.price;
          } else if (cur.type_id === 10) {
            acc.investment += cur.price;
            acc.totalIncome += cur.price;
          }

          return acc;
        },
        { income: 0, saving: 0, investment: 0, totalIncome: 0, expense: 0 }
      );

      set({ price });
    } catch (error) {
      toast.error(error);
    }
  },
}));
