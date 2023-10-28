import dayjs from "dayjs";
import { create } from "zustand";
import { supabase } from "@/db";
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
      const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
      const endDate = dayjs().endOf("month").format("YYYY-MM-DD");

      const { data: incomes } = await supabase
        .from("incomes")
        .select<string, IExpense>("*")
        .gte("date", startDate)
        .lte("date", endDate);
      const { data: savings } = await supabase
        .from("savings")
        .select<string, IExpense>("*")
        .gte("date", startDate)
        .lte("date", endDate);
      const { data: investments } = await supabase
        .from("investments")
        .select<string, IExpense>("*")
        .gte("date", startDate)
        .lte("date", endDate);
      const { data: expenses } = await supabase
        .from("expenses")
        .select<string, IExpense>("*")
        .gte("date", startDate)
        .lte("date", endDate);

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
