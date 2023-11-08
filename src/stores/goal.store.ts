import { create } from "zustand";
import { goalApi } from "@/api";
import { toast } from "@/styles";

interface IGoalStore {
  goals: IGoal[];
  getGoals: () => Promise<void>;
  postGoal: (goal: IGoal) => Promise<void>;
}

export const useGoalStore = create<IGoalStore>(set => ({
  goals: [],
  getGoals: async () => {
    try {
      const goals = await goalApi.gets();

      set({ goals });
    } catch (error) {
      toast.error(error);
    }
  },
  postGoal: async (goal: IGoal) => {
    try {
      await goalApi.create(goal);
    } catch (error) {
      toast.error(error);
    }
  },
}));
