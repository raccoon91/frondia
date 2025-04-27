import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";

interface LocalStore {
  localCurrency: Nullable<Currency>;
  localTransactionType: Nullable<TransactionType>;

  setCurrencyOption: (localCurrency: Nullable<Currency>) => void;
  setTransactionOption: (localTransactionType: Nullable<TransactionType>) => void;
}

export const useLocalStore = create<LocalStore>()(
  devtools(
    persist(
      (set) => ({
        localCurrency: null,
        localTransactionType: null,

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
          localCurrency: state.localCurrency,
          localTransactionType: state.localTransactionType,
        }),
      },
    ),
  ),
);
