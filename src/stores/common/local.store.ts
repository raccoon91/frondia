import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";

interface LocalStore {
  localTransactionType: Nullable<TransactionType>;
  localCurrency: Nullable<Currency>;

  setTransactionOption: (state: {
    localTransactionType: Nullable<TransactionType>;
    localCurrency: Nullable<Currency>;
  }) => void;
}

export const useLocalStore = create<LocalStore>()(
  devtools(
    persist(
      (set) => ({
        localTransactionType: null,
        localCurrency: null,

        setTransactionOption: ({
          localTransactionType,
          localCurrency,
        }: {
          localTransactionType: Nullable<TransactionType>;
          localCurrency: Nullable<Currency>;
        }) => {
          set({ localTransactionType, localCurrency }, false, "setTransactionOption");
        },
      }),
      {
        name: STORE_NAME.LOCAL,
        partialize: (state) => ({
          localTransactionType: state.localTransactionType,
          localCurrency: state.localCurrency,
        }),
      },
    ),
  ),
);
