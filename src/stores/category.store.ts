import { create } from "zustand";
import { categoryApi } from "@/api";
import { toast } from "@/styles";

interface ICategoryStore {
  incomeCategories: ICategory[];
  expenseCategories: ICategory[];
  savingCategories: ICategory[];
  investmentCategories: ICategory[];
  getIncomeCategories: () => Promise<void>;
  getExpenseCategories: () => Promise<void>;
  getSavingCategories: () => Promise<void>;
  getInvestmentCategories: () => Promise<void>;
}

export const useCategoryStore = create<ICategoryStore>(set => ({
  incomeCategories: [],
  expenseCategories: [],
  savingCategories: [],
  investmentCategories: [],
  getIncomeCategories: async () => {
    try {
      const incomeCategories = await categoryApi.gets(7);

      set({ incomeCategories });
    } catch (error) {
      toast.error(error as string);
    }
  },
  getExpenseCategories: async () => {
    try {
      const expenseCategories = await categoryApi.gets(8);

      set({ expenseCategories });
    } catch (error) {
      toast.error(error as string);
    }
  },
  getSavingCategories: async () => {
    try {
      const savingCategories = await categoryApi.gets(9);

      set({ savingCategories });
    } catch (error) {
      toast.error(error as string);
    }
  },
  getInvestmentCategories: async () => {
    try {
      const investmentCategories = await categoryApi.gets(10);

      set({ investmentCategories });
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
