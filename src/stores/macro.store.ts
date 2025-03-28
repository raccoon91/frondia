import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { z } from "zod";

import { STORE_NAME } from "@/constants/store";
import { macroFormSchema } from "@/schema/macro.schema";
import { supabase } from "@/lib/supabase/client";

interface MacroStore {
  isLoading: boolean;

  macros: Macro[];
  allMacros: Macro[];

  getMacros: () => Promise<void>;
  getAllMacros: () => Promise<void>;
  createMacro: (formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
  toggleMacroActive: (macroId: number, active: boolean) => Promise<void>;
}

export const useMacroStore = create<MacroStore>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,

        macros: [],
        allMacros: [],

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
            const { data, error } = await supabase.from("macros").select("*").order("created_at", { ascending: true });

            if (error) throw error;

            set({ allMacros: data ?? [] }, false, "getAllMacros");
          } catch (error) {
            console.error(error);
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
      }),
      {
        name: STORE_NAME.MACRO,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          macros: state.macros,
          allMacros: state.allMacros,
        }),
      },
    ),
  ),
);
