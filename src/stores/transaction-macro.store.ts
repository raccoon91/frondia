import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { transactionMacroAPI } from "@/apis/transaction-macro.api";
import { TRANSACTION_MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { STORE_NAME } from "@/constants/store";
import type { macroFormSchema } from "@/schema/macro.schema";
import { log } from "@/utils/log";

interface TransactionMacroStore {
  isLoading: boolean;
  status: string;

  transactionMacros: TransactionMacro[];
  allTransactionMacros: TransactionMacro[];

  changeMacroStatus: (status: string) => void;

  getTransactionMacros: () => Promise<void>;
  getAllTransactionMacros: () => Promise<void>;
  getTransactionMacro: (macroId: number) => Promise<Nullish<TransactionMacro>>;
  createTransactionMacro: (formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
  updateTransactionMacro: (macro: TransactionMacro, formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
  toggleTransactionMacroActive: (macroId: number, active: boolean) => Promise<void>;
  removeTransactionMacro: (macroId: number) => Promise<void>;
}

export const useTransactionMacroStore = create<TransactionMacroStore>()(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        status: TRANSACTION_MACRO_ACTIVE_STATUS.ALL,

        transactionMacros: [],
        allTransactionMacros: [],

        changeMacroStatus: (status: string) => {
          set({ status: status });
        },

        getTransactionMacros: async () => {
          try {
            const data = await transactionMacroAPI.gets({ active: TRANSACTION_MACRO_ACTIVE_STATUS.ACTIVE });

            set({ transactionMacros: data ?? [] }, false, "getMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getAllTransactionMacros: async () => {
          try {
            const status = get().status;

            const data = await transactionMacroAPI.gets({ active: status });

            set({ allTransactionMacros: data ?? [] }, false, "getAllMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getTransactionMacro: async (macroId: number) => {
          try {
            set({ isLoading: true }, false, "getMacro");

            const data = await transactionMacroAPI.get({ id: macroId });

            set({ isLoading: false }, false, "getMacro");

            return data;
          } catch (error) {
            set({ isLoading: false }, false, "getMacro");

            log.error(error);
          }
        },
        createTransactionMacro: async (formdata: z.infer<typeof macroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "createMacro");

            await transactionMacroAPI.create(formdata);

            set({ isLoading: false }, false, "createMacro");
          } catch (error) {
            set({ isLoading: false }, false, "createMacro");

            log.error(error);
          }
        },
        updateTransactionMacro: async (macro: TransactionMacro, formdata: z.infer<typeof macroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "updateMacro");

            await transactionMacroAPI.update(macro, formdata);

            set({ isLoading: false }, false, "updateMacro");
          } catch (error) {
            set({ isLoading: false }, false, "updateMacro");

            log.error(error);
          }
        },
        toggleTransactionMacroActive: async (macroId: number, active: boolean) => {
          try {
            set({ isLoading: true }, false, "toggleMacroActive");

            await transactionMacroAPI.toggle({ id: macroId, active });

            set({ isLoading: false }, false, "toggleMacroActive");
          } catch (error) {
            set({ isLoading: false }, false, "toggleMacroActive");

            log.error(error);
          }
        },
        removeTransactionMacro: async (macroId: number) => {
          try {
            set({ isLoading: true }, false, "removeMacro");

            await transactionMacroAPI.delete({ id: macroId });

            set({ isLoading: false }, false, "removeMacro");
          } catch (error) {
            set({ isLoading: false }, false, "removeMacro");

            log.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.MACRO,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          status: state.status,
          transactionMacros: state.transactionMacros,
          allTransactionMacros: state.allTransactionMacros,
        }),
      },
    ),
  ),
);
