import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { STORE_NAME } from "@/constants/store";

interface LocalStore {
  localDate: string;

  localTransactionType: Nullable<TransactionType>;
  localCurrency: Nullable<Currency>;

  setDate: (date: string) => void;

  setTransactionOption: (state: {
    localTransactionType: Nullable<TransactionType>;
    localCurrency: Nullable<Currency>;
  }) => void;
}

export const useLocalStore = create<LocalStore>()(
  devtools(
    persist(
      (set) => ({
        localDate: dayjs().format("YYYY-MM"),

        localTransactionType: null,
        localCurrency: null,

        setDate: (date: string) => {
          set({ localDate: date }, false, "setDate");
        },

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
          localDate: state.localDate,
          localTransactionType: state.localTransactionType,
          localCurrency: state.localCurrency,
        }),
      },
    ),
  ),
);
