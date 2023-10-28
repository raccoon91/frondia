import dayjs from "dayjs";
import { create } from "zustand";
import { expenseApi } from "@/api";
import { toast } from "@/styles";

interface IHomeStore {
  incomePrice: number | null;
  savingPrice: number | null;
  investmentPrice: number | null;
  totalIncomePrice: number | null;
  expensePrice: number | null;
  getMonthlyExpense: () => Promise<void>;
}

export const useHomeStore = create<IHomeStore>(set => ({
  incomePrice: null,
  savingPrice: null,
  investmentPrice: null,
  totalIncomePrice: null,
  expensePrice: null,
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

      const incomePrice =
        incomes?.reduce((acc, cur) => {
          if (cur.price === null || cur.price === undefined) return acc;

          acc += Number(cur.price);

          return acc;
        }, 0) ?? 0;
      const savingPrice =
        savings?.reduce((acc, cur) => {
          if (cur.price === null || cur.price === undefined) return acc;

          acc += Number(cur.price);

          return acc;
        }, 0) ?? 0;
      const investmentPrice =
        investments?.reduce((acc, cur) => {
          if (cur.price === null || cur.price === undefined) return acc;

          acc += Number(cur.price);

          return acc;
        }, 0) ?? 0;
      const expensePrice =
        expenses?.reduce((acc, cur) => {
          if (cur.price === null || cur.price === undefined) return acc;

          acc += Number(cur.price);

          return acc;
        }, 0) ?? 0;

      set({
        incomePrice,
        savingPrice,
        investmentPrice,
        totalIncomePrice: incomePrice + savingPrice + investmentPrice,
        expensePrice,
      });
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
