import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";

interface LocalStore {
  localCalendarType: Nullable<number>;
  localCurrency: Nullable<Currency>;
  localTransactionType: Nullable<TransactionType>;

  setCalendarType: (localCalendarType: Nullable<number>) => void;
  setCurrencyOption: (localCurrency: Nullable<Currency>) => void;
  setTransactionOption: (localTransactionType: Nullable<TransactionType>) => void;
}

export const useLocalStore = create<LocalStore>()(
  devtools(
    persist(
      (set) => ({
        localCalendarType: null,

        localCurrency: null,
        localTransactionType: null,

        setCalendarType: (localCalendarType: Nullable<number>) => {
          set({ localCalendarType }, false, "setCalendarType");
        },
        setCurrencyOption: (localCurrency: Nullable<Currency>) => {
          set({ localCurrency }, false, "setCurrencyOption");
        },
        setTransactionOption: (localTransactionType: Nullable<TransactionType>) => {
          set({ localTransactionType }, false, "setTransactionOption");
        },
      }),
      {
        name: STORE_NAME.LOCAL,
        partialize: (state) => ({
          localCalendarType: state.localCalendarType,
          localCurrency: state.localCurrency,
          localTransactionType: state.localTransactionType,
        }),
      },
    ),
  ),
);
