import { create } from "zustand";
import { scheduleApi } from "@/api";
import { toast } from "@/styles";

interface IScheduleStore {
  schedules: {
    incomes: ISchedule[];
    expenses: ISchedule[];
    savings: ISchedule[];
    investments: ISchedule[];
  } | null;
  getSchedules: () => Promise<void>;
  addSchdule: (type: string) => void;
}

export const useScheduleStore = create<IScheduleStore>((set, get) => ({
  schedules: null,
  getSchedules: async () => {
    try {
      const res = await scheduleApi.gets();

      const schedules =
        res?.reduce(
          (acc, cur) => {
            if (cur.type === "incomes") {
              acc.incomes.push(cur);
            } else if (cur.type === "expenses") {
              acc.expenses.push(cur);
            } else if (cur.type === "savings") {
              acc.savings.push(cur);
            } else if (cur.type === "investments") {
              acc.investments.push(cur);
            }

            return acc;
          },
          {
            incomes: [] as ISchedule[],
            expenses: [] as ISchedule[],
            savings: [] as ISchedule[],
            investments: [] as ISchedule[],
          }
        ) ?? null;

      set({ schedules });
    } catch (error) {
      toast.error(error);
    }
  },
  addSchdule(type: string) {
    const schedules = get().schedules;

    if (!schedules) return;

    set({
      schedules: {
        ...schedules,
        [type]: [
          ...schedules[type],
          {
            date: null,
            name: "",
            price: 0,
            type,
          },
        ],
      },
    });
  },
}));
