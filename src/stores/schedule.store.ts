import { create } from "zustand";
import { scheduleApi } from "@/api";
import { toast } from "@/styles";

interface IScheduleStore {
  schedules: Record<IExpenseTypes, ISchedule[]> | null;
  getSchedules: () => Promise<void>;
  addSchdule: (type: IExpenseTypes) => void;
  changeSchedule: (index: number, type: IExpenseTypes, data: { name: string; value: string | number }) => void;
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
            incomes: [],
            expenses: [],
            savings: [],
            investments: [],
          } as Record<IExpenseTypes, ISchedule[]>
        ) ?? null;

      set({ schedules });
    } catch (error) {
      toast.error(error);
    }
  },
  addSchdule(type) {
    const schedules = get().schedules;

    if (!schedules) return;

    set({
      schedules: {
        ...schedules,
        [type]: [...schedules[type], { date: null, name: "", price: 0, type }],
      },
    });
  },
  changeSchedule(index, type, data) {
    const schedules = get().schedules;

    if (!schedules) return;

    const schedule = schedules[type];
    const filteredSchedule = schedule.map((scheduleData, scheduleIndex) => {
      if (scheduleIndex === index) {
        return { ...scheduleData, [data.name]: data.value };
      }

      return scheduleData;
    });

    set({ schedules: { ...schedules, [type]: filteredSchedule } });
  },
}));
