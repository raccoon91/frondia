import { create } from "zustand";
import { cloneDeep, differenceWith, flatMap, isEqual, isNil } from "lodash-es";
import { expenseApi, scheduleApi } from "@/api";
import { toast } from "@/styles";
import { useAuthStore, useExpenseTypeStore } from ".";
import dayjs from "dayjs";

interface IScheduleStore {
  isEnableSave: boolean;
  originSchedules: Record<IExpenseTypes, ISchedule[]> | null;
  schedules: Record<IExpenseTypes, ISchedule[]> | null;
  getTodaySchedule: () => Promise<void>;
  getSchedules: () => Promise<void>;
  addSchdule: (type: IExpenseType) => void;
  setSchedules: (schedules: Record<IExpenseTypes, ISchedule[]>) => void;
  saveSchedules: () => Promise<void>;
}

export const useScheduleStore = create<IScheduleStore>((set, get) => ({
  isEnableSave: false,
  originSchedules: null,
  schedules: null,
  getTodaySchedule: async () => {
    try {
      const today = dayjs();
      const todaySchedule = sessionStorage.getItem(today.format("MM-DD"));

      if (todaySchedule) return;

      const query = "*, types ( * ), categories ( * )";
      const date = { eq: today.get("date") };

      const schedules = await scheduleApi.gets({ query, date });

      if (schedules.length) {
        const user = useAuthStore.getState().user;

        if (!user) {
          throw new Error("Unauthorized");
        }

        const res = await expenseApi.upsert(
          user,
          today.format("YYYY-MM-DD"),
          schedules.map(schedule => ({
            price: schedule.price,
            note: schedule.name,
            types: schedule.types,
            categories: schedule.categories,
          }))
        );

        if (res === 200) {
          sessionStorage.setItem(today.format("MM-DD"), "true");
        }
      }
    } catch (error) {
      toast.error(error);
    }
  },
  getSchedules: async () => {
    try {
      const query = "*, types ( * ), categories ( * )";

      const res = await scheduleApi.gets({ query });

      const expenseTypes = useExpenseTypeStore.getState().expenseTypes;

      const schedules =
        res?.reduce(
          (acc, cur) => {
            expenseTypes.forEach(expenseType => {
              if (cur.types?.type === expenseType.type) {
                acc[expenseType.type].push(cur);
              }
            });

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
        [type.name]: [
          ...schedules[type.name as IExpenseTypes],
          {
            date: null,
            name: "",
            price: 0,
            type_id: type.id,
            types: type,
            category_id: null,
          },
        ],
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
