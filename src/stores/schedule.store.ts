import { create } from "zustand";
import { cloneDeep, differenceWith, flatMap, isEqual, isNil } from "lodash-es";
import { scheduleApi } from "@/api";
import { toast } from "@/styles";
import { useAuthStore } from ".";

interface IScheduleStore {
  isEnableSave: boolean;
  originSchedules: Record<IExpenseTypes, ISchedule[]> | null;
  schedules: Record<IExpenseTypes, ISchedule[]> | null;
  getSchedules: () => Promise<void>;
  addSchdule: (type: IExpenseTypes) => void;
  setSchedules: (schedules: Record<IExpenseTypes, ISchedule[]>) => void;
  saveSchedules: () => Promise<void>;
}

export const useScheduleStore = create<IScheduleStore>((set, get) => ({
  isEnableSave: false,
  originSchedules: null,
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

      set({ originSchedules: cloneDeep(schedules), schedules });
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
  setSchedules(schedules) {
    const originSchedules = get().originSchedules;

    set({ schedules, isEnableSave: !isEqual(originSchedules, schedules) });
  },
  saveSchedules: async () => {
    try {
      const user = useAuthStore.getState().user;

      if (!user) {
        throw new Error("Unauthorized");
      }

      const originSchedules = flatMap(Object.values(get().originSchedules ?? {}));
      const schedules = flatMap(Object.values(get().schedules ?? {}));

      const differenceSchedules = differenceWith(schedules, originSchedules, isEqual);

      const filteredSchedules = differenceSchedules?.filter(
        schedule => !isNil(schedule?.date) && schedule.name && schedule.price
      );

      await scheduleApi.upsert(user, filteredSchedules);

      const getSchedules = get().getSchedules;

      await getSchedules();
    } catch (error) {
      toast.error(error);
    }
  },
}));
