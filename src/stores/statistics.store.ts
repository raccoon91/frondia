import { create } from "zustand";
import { reduce } from "lodash-es";
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

      const incomes = await expenseApi.gets("incomes", { date });
      const savings = await expenseApi.gets("savings", { date });
      const investments = await expenseApi.gets("investments", { date });
      const expenses = await expenseApi.gets("expenses", { date });

      const income = reduce(incomes, (acc, cur) => acc + cur.price, 0);
      const saving = reduce(savings, (acc, cur) => acc + cur.price, 0);
      const investment = reduce(investments, (acc, cur) => acc + cur.price, 0);
      const expense = reduce(expenses, (acc, cur) => acc + cur.price, 0);

      set({
        price: { income, saving, investment, totalIncome: income + saving + investment, expense },
      });
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
