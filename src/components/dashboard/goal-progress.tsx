import type { FC } from "react";

import { Progress } from "@/components/ui/progress";
import { GOAL_RULE } from "@/constants/goal";
import { cn } from "@/lib/utils";

interface GoalProgressProps {
  goal: GoalInProgress;
}

export const GoalProgress: FC<GoalProgressProps> = ({ goal }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn("w-2 h-2 rounded-full", goal?.rule === GOAL_RULE.LESS ? "bg-amber-300" : "bg-green-300")}
          />
          <p className="text-xs">{goal.name}</p>
        </div>

        {goal.remain > 0 ? (
          <p className="text-xs">D - {goal.remain}</p>
        ) : goal.remain === 0 ? (
          <p className="text-xs">D - day</p>
        ) : (
          <p className="text-xs">D + {goal.remain}</p>
        )}
      </div>

      <Progress size="sm" variant={goal.result === "success" ? "primary" : "destructive"} value={goal.value} />
    </div>
  );
};
