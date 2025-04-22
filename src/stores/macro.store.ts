import type { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { STORE_NAME } from "@/constants/store";
import { supabase } from "@/lib/supabase/client";
import type { macroFormSchema } from "@/schema/macro.schema";

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
            const { data, error } = await supabase.from("macros").select("*").eq("active", true);

            if (error) throw error;

            set({ macros: data ?? [] }, false, "getMacros");
          } catch (error) {
            console.error(error);
          }
        },
        getAllMacros: async () => {
          try {
            const activeStatus = get().activeStatus;

            const builder = supabase.from("macros").select("*");

            if (activeStatus === MACRO_ACTIVE_STATUS.ACTIVE) {
              builder.eq("active", true);
            } else if (activeStatus === MACRO_ACTIVE_STATUS.INACTIVE) {
              builder.eq("active", false);
            }

            const { data, error } = await builder.order("created_at", { ascending: true });

            if (error) throw error;

            set({ allMacros: data ?? [] }, false, "getAllMacros");
          } catch (error) {
            console.error(error);
          }
        },
        getMacro: async (macroId: number) => {
          try {
            set({ isLoading: true }, false, "getMacro");

            const { data, error } = await supabase.from("macros").select("*").eq("id", macroId).maybeSingle();

            if (error) throw error;

            set({ isLoading: false }, false, "getMacro");

            return data;
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "getMacro");
          }
        },
        createMacro: async (formdata: z.infer<typeof macroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "createMacro");

            const { data, error } = await supabase.auth.getUser();

            if (error) throw error;

            if (!data?.user) throw new Error("User not exist");

            const { error: macroError } = await supabase.from("macros").insert({
              user_id: data.user.id,
              name: formdata.name,
              type_id: formdata.type_id ? Number(formdata.type_id) : null,
              category_id: formdata.category_id ? Number(formdata.category_id) : null,
              currency_id: formdata.currency_id ? Number(formdata.currency_id) : null,
              amount: formdata.amount ? Number(formdata.amount) : null,
              memo: formdata.memo,
              day: formdata.day ? Number(formdata.day) : null,
              hour: formdata.hour ? Number(formdata.hour) : null,
              minute: formdata.minute ? Number(formdata.minute) : null,
              active: true,
            });

            if (macroError) throw macroError;

            set({ isLoading: false }, false, "createMacro");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "createMacro");
          }
        },
        updateMacro: async (macro: Macro, formdata: z.infer<typeof macroFormSchema>) => {
          try {
            set({ isLoading: true }, false, "updateMacro");

            const { error: macroError } = await supabase
              .from("macros")
              .update({
                user_id: macro.user_id,
                name: formdata.name,
                type_id: formdata.type_id ? Number(formdata.type_id) : null,
                category_id: formdata.category_id ? Number(formdata.category_id) : null,
                currency_id: formdata.currency_id ? Number(formdata.currency_id) : null,
                amount: formdata.amount ? Number(formdata.amount) : null,
                memo: formdata.memo,
                day: formdata.day ? Number(formdata.day) : null,
                hour: formdata.hour ? Number(formdata.hour) : null,
                minute: formdata.minute ? Number(formdata.minute) : null,
                active: macro.active,
              })
              .eq("id", macro.id);

            if (macroError) throw macroError;

            set({ isLoading: false }, false, "updateMacro");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "updateMacro");
          }
        },
        toggleMacroActive: async (macroId: number, active: boolean) => {
          try {
            set({ isLoading: true }, false, "toggleMacroActive");

            const { error } = await supabase.from("macros").update({ active }).eq("id", macroId);

            if (error) throw error;

            set({ isLoading: false }, false, "toggleMacroActive");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "toggleMacroActive");
          }
        },
        removeMacro: async (macroId: number) => {
          try {
            set({ isLoading: true }, false, "removeMacro");

            const { error } = await supabase.from("macros").delete().eq("id", macroId);

            if (error) throw error;

            set({ isLoading: false }, false, "removeMacro");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "removeMacro");
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
