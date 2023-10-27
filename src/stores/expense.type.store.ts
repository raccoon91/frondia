import { create } from "zustand";
import { supabase } from "../db";
import { toast } from "../styles";

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
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
