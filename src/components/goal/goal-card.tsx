import { FC, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: FC<GoalCardProps> = ({ goal }) => {
  const [openCategory, setOpenCategory] = useState(false);

  const handleToggleCategory = () => {
    setOpenCategory((prev) => !prev);
  };

  return (
    <div className="overflow-hidden relative flex flex-col gap-2 p-4 border rounded-md bg-background shadow-sm">
      <div className="absolute top-0 right-0 py-1 px-2 rounded-bl-sm bg-emerald-300">
        <p className="text-sm">Goal</p>
      </div>

      <p className="font-bold">{goal.name}</p>

      <div className="flex justify-between">
        <p className="text-sm">
          {goal.period} {goal.date_unit}
        </p>
        <p className="text-sm">
          {goal.amount.toLocaleString("en-US")} {goal.currency?.symbol}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Badge variant="secondary">{goal.type?.name}</Badge>

          {goal.map?.length ? (
            <Badge variant="outline" onClick={handleToggleCategory}>
              {goal.map.length} category {openCategory ? <ChevronUp /> : <ChevronDown />}
            </Badge>
          ) : (
            <Badge>No category</Badge>
          )}
        </div>

        {openCategory ? (
          <div className="flex flex-wrap gap-2">
            {goal.map?.map((map) => (
              <Badge key={map.category.id} variant="outline">
                {map.category.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-1 px-2 text-xs text-muted-foreground italic">
        <p>{dayjs(goal.start).format("YYYY-MM-DD")}</p>
        <p>~</p>
        {goal.end ? <p>{dayjs(goal.end).format("YYYY-MM-DD")}</p> : null}
      </div>
    </div>
  );
};
