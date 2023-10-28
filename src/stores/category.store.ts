import { create } from "zustand";
import { categoryApi } from "@/api";
import { toast } from "@/styles";

interface ICategoryStore {
  category: {
    incomes: ICategory[];
    expenses: ICategory[];
    savings: ICategory[];
    investments: ICategory[];
  } | null;
  getCategories: () => Promise<void>;
}

export const useCategoryStore = create<ICategoryStore>(set => ({
  category: null,
  getCategories: async () => {
    try {
      const incomes = await categoryApi.gets(7);
      const expenses = await categoryApi.gets(8);
      const savings = await categoryApi.gets(9);
      const investments = await categoryApi.gets(10);

      set({ category: { incomes, expenses, savings, investments } });
    } catch (error) {
      toast.error(error);
    }
  },
}));
