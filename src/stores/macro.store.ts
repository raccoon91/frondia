import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { z } from "zod";

import { STORE_NAME } from "@/constants/store";
import { macroFormSchema } from "@/schema/macro.schema";
import { supabase } from "@/lib/supabase/client";

interface MacroStore {
  isLoading: boolean;

  macros: Macro[];

  getMacros: () => Promise<void>;
  createMacro: (formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
}

export const useMacroStore = create<MacroStore>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,

        macros: [],

        getMacros: async () => {
          try {
            const { data, error } = await supabase.from("macros").select("*");

            if (error) throw error;

            set({ macros: data ?? [] }, false, "getMacros");
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
            });

            if (macroError) throw macroError;

            set({ isLoading: false }, false, "getMacros");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "createMacro");
          }
        },
      }),
      {
        name: STORE_NAME.MACRO,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          macros: state.macros,
        }),
      },
    ),
  ),
);
