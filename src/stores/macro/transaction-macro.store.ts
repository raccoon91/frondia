import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { transactionMacroAPI } from "@/apis/transaction-macro.api";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { STORE_NAME } from "@/constants/store";
import type { transactionMacroFormSchema } from "@/schema/macro.schema";
import { log } from "@/utils/log";
import { useMacroOptionStore } from "./macro-option.store";

interface TransactionMacroStore {
  isLoading: boolean;

  transactionMacros: TransactionMacro[];
  allTransactionMacros: TransactionMacro[];

  getTransactionMacros: () => Promise<void>;
  getAllTransactionMacros: () => Promise<void>;
  getTransactionMacro: (transactionMacroId: number) => Promise<Nullish<TransactionMacro>>;
  createTransactionMacro: (formdata: z.infer<typeof transactionMacroFormSchema>) => Promise<void>;
  updateTransactionMacro: (
    transactionMacro: TransactionMacro,
    formdata: z.infer<typeof transactionMacroFormSchema>,
  ) => Promise<void>;
  toggleTransactionMacroActive: (transactionMacroId: number, active: boolean) => Promise<void>;
  removeTransactionMacro: (transactionMacroId: number) => Promise<void>;
}

export const useTransactionMacroStore = create<TransactionMacroStore>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,

        transactionMacros: [],
        allTransactionMacros: [],

        getTransactionMacros: async () => {
          try {
            const data = await transactionMacroAPI.gets({ active: MACRO_ACTIVE_STATUS.ACTIVE });

            set({ transactionMacros: data ?? [] }, false, "getTransactionMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getAllTransactionMacros: async () => {
          try {
            const status = useMacroOptionStore.getState().status;

            const data = await transactionMacroAPI.gets({ active: status });

            set({ allTransactionMacros: data ?? [] }, false, "getAllTransactionMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getTransactionMacro: async (transactionMacroId: number) => {
          try {
            set({ isLoading: true }, false, "getTransactionMacro");

            const data = await transactionMacroAPI.get({ id: transactionMacroId });

            set({ isLoading: false }, false, "getTransactionMacro");

            return data;
          } catch (error) {
            set({ isLoading: false }, false, "getTransactionMacro");

            log.error(error);
          }
        },
        createTransactionMacro: async (formdata: z.infer<typeof transactionMacroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "createTransactionMacro");

            await transactionMacroAPI.create(formdata);

            set({ isLoading: false }, false, "createTransactionMacro");
          } catch (error) {
            set({ isLoading: false }, false, "createTransactionMacro");

            log.error(error);
          }
        },
        updateTransactionMacro: async (
          transactionMacro: TransactionMacro,
          formdata: z.infer<typeof transactionMacroFormSchema>,
        ) => {
          try {
            set({ isLoading: true }, false, "updateTransactionMacro");

            await transactionMacroAPI.update(transactionMacro, formdata);

            set({ isLoading: false }, false, "updateTransactionMacro");
          } catch (error) {
            set({ isLoading: false }, false, "updateTransactionMacro");

            log.error(error);
          }
        },
        toggleTransactionMacroActive: async (transactionMacroId: number, active: boolean) => {
          try {
            set({ isLoading: true }, false, "toggleTransactionMacroActive");

            await transactionMacroAPI.toggle({ id: transactionMacroId, active });

            set({ isLoading: false }, false, "toggleTransactionMacroActive");
          } catch (error) {
            set({ isLoading: false }, false, "toggleTransactionMacroActive");

            log.error(error);
          }
        },
        removeTransactionMacro: async (transactionMacroId: number) => {
          try {
            set({ isLoading: true }, false, "removeTransactionMacro");

            await transactionMacroAPI.delete({ id: transactionMacroId });

            set({ isLoading: false }, false, "removeTransactionMacro");
          } catch (error) {
            set({ isLoading: false }, false, "removeTransactionMacro");

            log.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.TRANSACTION_MACRO,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          transactionMacros: state.transactionMacros,
          allTransactionMacros: state.allTransactionMacros,
        }),
      },
    ),
  ),
);
