import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";
import { supabase } from "@/lib/supabase/client";
import { log } from "@/utils/log";

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
          set({ selectedCurrencyId: currencyId }, false, "changeCurrency");
        },
        changeTransactionType: (transactionTypeId: string) => {
          set({ selectedTransactionTypeId: transactionTypeId }, false, "changeTransactionType");
        },
        changeCategory: (categoryId: string) => {
          set({ selectedCategoryId: categoryId }, false, "changeCategory");
        },

        getCurrencies: async () => {
          try {
            const { data, error } = await supabase.from("currencies").select("*");

            if (error) throw error;

            set({ currencies: data ?? [] }, false, "getCurrencies");
          } catch (error) {
            log.error(error);
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
            log.error(error);
          }
        },
        getCategories: async () => {
          try {
            const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true });

            if (error) throw error;

            set({ categories: data ?? [] }, false, "getCategories");
          } catch (error) {
            log.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.TRANSACTION_OPTION,
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
