import dayjs from "dayjs";
import { sortBy } from "lodash-es";
import { create } from "zustand";
import { supabase } from "../db";

interface IExpenseStore {
  expenses: IExpense[];
  getExpenses: () => Promise<void>;
  setExpenses: (expenses: IExpense[]) => void;
}

export const useExpenseStore = create<IExpenseStore>(set => ({
  expenses: [],
  getExpenses: async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const { data: incomes } = await supabase
        .from("incomes")
        .select<string, IExpense>("*, expense_types ( * ), categories ( * )")
        .eq("date", today);
      const { data: expenses } = await supabase
        .from("expenses")
        .select<string, IExpense>("*, expense_types ( * ), categories ( * )")
        .eq("date", today);
      const { data: investments } = await supabase
        .from("investments")
        .select<string, IExpense>("*, expense_types ( * ), categories ( * )")
        .eq("date", today);
      const { data: savings } = await supabase
        .from("savings")
        .select<string, IExpense>("*, expense_types ( * ), categories ( * )")
        .eq("date", today);

      const data: IExpense[] = sortBy(
        [...(incomes ?? []), ...(expenses ?? []), ...(investments ?? []), ...(savings ?? [])],
        "date"
      );

      console.log(data);

      set({ expenses: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  setExpenses: (expenses: IExpense[]) => {
    set({ expenses });
  },
}));
