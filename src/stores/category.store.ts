import { create } from "zustand";
import { supabase } from "../db";
import { toast } from "../styles";

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
    } catch (error) {
      toast.error(error as string);
    }
  },
  getExpenseCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type_id", "8");

      set({ expenseCategories: data ?? [] });
    } catch (error) {
      toast.error(error as string);
    }
  },
  getSavingCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type_id", "9");

      set({ savingCategories: data ?? [] });
    } catch (error) {
      toast.error(error as string);
    }
  },
  getInvestmentCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type_id", "10");

      set({ investmentCategories: data ?? [] });
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
