import { create } from "zustand";
import { supabase } from "../db";

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
      const { data } = await supabase.from("categories").select("*").eq("type_id", "7");

      set({ incomeCategories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getExpenseCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type_id", "8");

      set({ expenseCategories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getSavingCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type_id", "9");

      set({ savingCategories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getInvestmentCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type_id", "10");

      set({ investmentCategories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
}));
