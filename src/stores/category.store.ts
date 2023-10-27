import { create } from "zustand";
import { supabase } from "../db";

interface ICategoryStore {
  categories: ICategory[];
  getCategories: () => Promise<void>;
  getIncomeCategories: () => Promise<void>;
  getExpenseCategories: () => Promise<void>;
  getSavingCategories: () => Promise<void>;
  getInvestmentCategories: () => Promise<void>;
}

export const useCategoryStore = create<ICategoryStore>(set => ({
  categories: [],
  getCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*");

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getIncomeCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "income");

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getExpenseCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "expense");

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getSavingCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "saving");

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getInvestmentCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "investment");

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
}));
