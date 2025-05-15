import dayjs from "dayjs";

import { GOAL_STATUS } from "@/constants/goal";

export const parseGoalBystatus = (goals: Goal[], today: string) => {
  const result = {
    goalsInReady: [],
    goalsInProgress: [],
    goalsInDone: [],
    updated: [],
  };

  return (
    goals?.reduce<{
      goalsInReady: Goal[];
      goalsInProgress: Goal[];
      goalsInDone: Goal[];
      updated: Goal[];
    }>((acc, goal) => {
      if (goal.status === GOAL_STATUS.READY && (dayjs(goal.start).isSame(today) || dayjs(goal.start).isBefore(today))) {
        // change goal status to progress
        goal.status = GOAL_STATUS.PROGRESS;

        acc.updated.push(goal);
      } else if (goal.status === GOAL_STATUS.PROGRESS && dayjs(goal.end).isBefore(today)) {
        // change goal status to done
        goal.status = GOAL_STATUS.DONE;

        acc.updated.push(goal);
      }

      if (goal.status === GOAL_STATUS.READY) acc.goalsInReady.push(goal);
      if (goal.status === GOAL_STATUS.PROGRESS) acc.goalsInProgress.push(goal);
      if (goal.status === GOAL_STATUS.DONE) acc.goalsInDone.push(goal);

      return acc;
    }, result) ?? result
  );
};
