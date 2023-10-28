import { create } from "zustand";
import { expenseTypeApi } from "@/api";
import { toast } from "@/styles";

interface IExpenseTypeStore {
  expenseTypes: IExpenseType[];
  getExpenseTypes: () => Promise<void>;
}

export const useExpenseTypeStore = create<IExpenseTypeStore>(set => ({
  expenseTypes: [],
  getExpenseTypes: async () => {
    try {
      const expenseTypes = await expenseTypeApi.gets();

      set({ expenseTypes });
    } catch (error) {
      toast.error(error);
    }
  },
}));
