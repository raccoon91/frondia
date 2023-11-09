import { create } from "zustand";
import { goalApi } from "@/api";
import { toast } from "@/styles";
import { useAuthStore } from ".";

interface IGoalStore {
  goals: IGoal[];
  getGoals: () => Promise<void>;
  postGoal: (goal: Omit<IGoal, "user_id">) => Promise<number | void>;
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
  postGoal: async goal => {
    try {
      const user = useAuthStore.getState().user;

      if (!user) return;

      const res = await goalApi.create({
        ...goal,
        user_id: user.id,
      });

      return res;
    } catch (error) {
      toast.error(error);
    }
  },
}));
