import dayjs from "dayjs";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";

interface SessionStore {
  sessionDate: string;

  setSessionDate: (date: string) => void;
}

export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set) => ({
        sessionDate: dayjs().format("YYYY-MM"),

        setSessionDate: (date: string) => {
          set({ sessionDate: date }, false, "setSessionDate");
        },
      }),
      {
        name: STORE_NAME.SESSION,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          sessionDate: state.sessionDate,
        }),
      },
    ),
  ),
);
