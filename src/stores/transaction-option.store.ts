import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase/client";

interface TransactionOptionStore {
  selectedCurrencyId: string;
  selectedTransactionTypeId: string;
  selectedCategoryId: string;

  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];

  changeCurrency: (currencyId: string) => void;
  changeTransactionType: (transactionTypeId: string) => void;
  changeCategory: (categoryId: string) => void;

  getCurrencies: () => Promise<void>;
  getTransactionTypes: () => Promise<void>;
  getCategories: () => Promise<void>;
}

export const useTransactionOptionStore = create<TransactionOptionStore>()(
  devtools(
    persist(
      (set) => ({
        selectedCurrencyId: "",
        selectedTransactionTypeId: "",
        selectedCategoryId: "",

        currencies: [],
        transactionTypes: [],
        categories: [],

        changeCurrency: (currencyId: string) => {
          set({ selectedCurrencyId: currencyId });
        },
        changeTransactionType: (transactionTypeId: string) => {
          set({ selectedTransactionTypeId: transactionTypeId });
        },
        changeCategory: (categoryId: string) => {
          set({ selectedCategoryId: categoryId });
        },

        getCurrencies: async () => {
          try {
            const { data, error } = await supabase.from("currencies").select("*");

            if (error) throw error;

            set({ currencies: data ?? [] }, false, "getCurrencies");
          } catch (error) {
            console.error(error);
          }
        },
        getTransactionTypes: async () => {
          try {
            const { data, error } = await supabase
              .from("transaction_types")
              .select("*")
              .order("order", { ascending: true });

            if (error) throw error;

            set({ transactionTypes: data ?? [] }, false, "getTransactionTypes");
          } catch (error) {
            console.error(error);
          }
        },
        getCategories: async () => {
          try {
            const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true });

            if (error) throw error;

            set({ categories: data ?? [] }, false, "getCategories");
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: "transaction-option-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          currencies: state.currencies,
          transactionTypes: state.transactionTypes,
          categories: state.categories,
        }),
      },
    ),
  ),
);
