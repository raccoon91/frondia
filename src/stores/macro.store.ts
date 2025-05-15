import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { macroAPI } from "@/apis/macro.api";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { STORE_NAME } from "@/constants/store";
import type { macroFormSchema } from "@/schema/macro.schema";
import { log } from "@/utils/log";

interface MacroStore {
  isLoading: boolean;
  activeStatus: string;

  macros: Macro[];
  allMacros: Macro[];

  changeActiveStatus: (status: string) => void;

  getMacros: () => Promise<void>;
  getAllMacros: () => Promise<void>;
  getMacro: (macroId: number) => Promise<Nullish<Macro>>;
  createMacro: (formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
  updateMacro: (macro: Macro, formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
  toggleMacroActive: (macroId: number, active: boolean) => Promise<void>;
  removeMacro: (macroId: number) => Promise<void>;
}

export const useMacroStore = create<MacroStore>()(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,
        activeStatus: MACRO_ACTIVE_STATUS.ALL,

        macros: [],
        allMacros: [],

        changeActiveStatus: (status: string) => {
          set({ activeStatus: status });
        },

        getMacros: async () => {
          try {
            const data = await macroAPI.gets({ active: MACRO_ACTIVE_STATUS.ACTIVE });

            set({ macros: data ?? [] }, false, "getMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getAllMacros: async () => {
          try {
            const activeStatus = get().activeStatus;

            const data = await macroAPI.gets({ active: activeStatus });

            set({ allMacros: data ?? [] }, false, "getAllMacros");
          } catch (error) {
            log.error(error);
          }
        },
        getMacro: async (macroId: number) => {
          try {
            set({ isLoading: true }, false, "getMacro");

            const data = await macroAPI.get({ id: macroId });

            set({ isLoading: false }, false, "getMacro");

            return data;
          } catch (error) {
            set({ isLoading: false }, false, "getMacro");

            log.error(error);
          }
        },
        createMacro: async (formdata: z.infer<typeof macroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "createMacro");

            await macroAPI.create(formdata);

            set({ isLoading: false }, false, "createMacro");
          } catch (error) {
            set({ isLoading: false }, false, "createMacro");

            log.error(error);
          }
        },
        updateMacro: async (macro: Macro, formdata: z.infer<typeof macroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "updateMacro");

            await macroAPI.update(macro, formdata);

            set({ isLoading: false }, false, "updateMacro");
          } catch (error) {
            set({ isLoading: false }, false, "updateMacro");

            log.error(error);
          }
        },
        toggleMacroActive: async (macroId: number, active: boolean) => {
          try {
            set({ isLoading: true }, false, "toggleMacroActive");

            await macroAPI.toggle({ id: macroId, active });

            set({ isLoading: false }, false, "toggleMacroActive");
          } catch (error) {
            set({ isLoading: false }, false, "toggleMacroActive");

            log.error(error);
          }
        },
        removeMacro: async (macroId: number) => {
          try {
            set({ isLoading: true }, false, "removeMacro");

            await macroAPI.delete({ id: macroId });

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
          activeStatus: state.activeStatus,
          macros: state.macros,
          allMacros: state.allMacros,
        }),
      },
    ),
  ),
);
