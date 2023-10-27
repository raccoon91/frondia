import { create } from "zustand";
import { supabase } from "../db";

interface IExpenseTypeStore {
  expenseTypes: IExpenseType[];
  getExpenseTypes: () => Promise<void>;
}

export const useExpenseTypeStore = create<IExpenseTypeStore>(set => ({
  expenseTypes: [],
  getExpenseTypes: async () => {
    try {
      const { data } = await supabase.from("types").select("*");

      set({ expenseTypes: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
}));
