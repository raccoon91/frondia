import { create } from "zustand";
import { supabase } from "../db";

interface IGoalStore {
  goals: any[];
  getGoalsData: () => Promise<void>;
}

export const useGoalStore = create<IGoalStore>(set => ({
  goals: [],
  getGoalsData: async () => {
    try {
      const { data } = await supabase.from("goals").select("*");

      console.log(data);

      set({ goals: data ?? [] });
    } catch (err) {
      console.error(err);
    }
  },
}));
