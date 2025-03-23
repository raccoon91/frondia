import { FC } from "react";
import { Progress } from "../ui/progress";

interface GoalProgressProps {
  goal: GoalInProgress;
}

export const GoalProgress: FC<GoalProgressProps> = ({ goal }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs">{goal.name}</p>

        {goal.remain > 0 ? (
          <p className="text-xs">D - {goal.remain}</p>
        ) : goal.remain === 0 ? (
          <p className="text-xs">D - day</p>
        ) : (
          <p className="text-xs">D + {goal.remain}</p>
        )}
      </div>

      <Progress size="sm" variant="success" value={(goal.totalAmount / goal.amount) * 100} />
    </div>
  );
};
