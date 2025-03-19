import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase/client";

interface TransactionOptionStore {
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];

  getCurrencies: () => Promise<void>;
  getTransactionTypes: () => Promise<void>;
  getCategories: () => Promise<void>;
}

export const useTransactionOptionStore = create<TransactionOptionStore>()(
  devtools(
    persist(
      (set) => ({
        currencies: [],
        transactionTypes: [],
        categories: [],

        getCurrencies: async () => {
          try {
            const { data } = await supabase.from("currencies").select("*");

            set({ currencies: data ?? [] }, false, "getCurrencies");
          } catch (error) {
            console.error(error);
          }
        },
        getTransactionTypes: async () => {
          try {
            const { data } = await supabase.from("transaction_types").select("*");

            set({ transactionTypes: data ?? [] }, false, "getTransactionTypes");
          } catch (error) {
            console.error(error);
          }
        },
        getCategories: async () => {
          try {
            const { data } = await supabase.from("categories").select("*");

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
