import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { STORE_NAME } from "@/constants/store";

interface MacroOptionStore {
  status: string;

  changeMacroStatus: (status: string) => void;
}

export const useMacroOptionStore = create<MacroOptionStore>()(
  devtools(
    persist(
      (set) => ({
        status: MACRO_ACTIVE_STATUS.ALL,

        changeMacroStatus: (status: string) => {
          set({ status: status });
        },
      }),
      {
        name: STORE_NAME.GOAL_MACRO,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          status: state.status,
        }),
      },
    ),
  ),
);
