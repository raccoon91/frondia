import dayjs from "dayjs";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";

interface SessionStore {
  sessionDate: string;

  setSessionDate: (date: string) => void;

  movePrevMonth: () => void;
  moveNextMonth: () => void;
}

export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set, get) => ({
        sessionDate: dayjs().format("YYYY-MM"),

        setSessionDate: (date: string) => {
          set({ sessionDate: date }, false, "setSessionDate");
        },

        movePrevMonth: () => {
          const date = get().sessionDate;

          set({ sessionDate: dayjs(date).subtract(1, "month").format("YYYY-MM") }, false, "movePrevMonth");
        },
        moveNextMonth: () => {
          const date = get().sessionDate;

          set({ sessionDate: dayjs(date).add(1, "month").format("YYYY-MM") }, false, "moveNextMonth");
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
