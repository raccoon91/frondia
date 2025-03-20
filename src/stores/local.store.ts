import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface LocalStore {
  localTransactionType: Nullable<TransactionType>;
  localCurrency: Nullable<Currency>;

  setLocalStore: (state: {
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

        setLocalStore: ({
          localTransactionType,
          localCurrency,
        }: {
          localTransactionType: Nullable<TransactionType>;
          localCurrency: Nullable<Currency>;
        }) => {
          set({ localTransactionType, localCurrency });
        },
      }),
      {
        name: "local-store",
        partialize: (state) => ({
          localTransactionType: state.localTransactionType,
          localCurrency: state.localCurrency,
        }),
      },
    ),
  ),
);
