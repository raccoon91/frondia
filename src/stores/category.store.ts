import { create } from "zustand";
import { supabase } from "../db";

interface ICategoryStore {
  categories: any[];
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

      console.log(data);

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getIncomeCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "income");

      console.log(data);

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getExpenseCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "expense");

      console.log(data);

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getSavingCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "saving");

      console.log(data);

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
  getInvestmentCategories: async () => {
    try {
      const { data } = await supabase.from("categories").select("*").eq("type", "investment");

      console.log(data);

      set({ categories: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
}));
