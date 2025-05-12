import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import { type FC, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMenu, CardTitle } from "@/components/ui/card";
import { GOAL_RULE } from "@/constants/goal";
import { ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  isLoading: boolean;
  goal: Goal;
  onDelete: (goal: Goal) => void;
}

export const GoalCard: FC<GoalCardProps> = ({ isLoading, goal, onDelete }) => {
  const [openCategory, setOpenCategory] = useState(false);

  const handleToggleCategory = () => {
    setOpenCategory((prev) => !prev);
  };

  const handleDeleteGoal = () => {
    onDelete(goal);
  };

  return (
    <Card className="overflow-hidden gap-4 pt-8 pb-4 bg-background">
      <div
        className={cn(
          "absolute top-0 left-0 py-0.5 px-2 rounded-br-sm",
          goal.rule === GOAL_RULE.LESS ? "bg-amber-300" : "bg-green-300",
        )}
      >
        <p className="text-xs">{goal?.rule ?? ""}</p>
      </div>

      <CardMenu className="top-0 right-0">
        <Button disabled={isLoading} size="icon" variant="ghost" className="w-8 h-8" onClick={handleDeleteGoal}>
          <Trash />
        </Button>
      </CardMenu>

      <CardHeader className="flex items-end justify-between px-4">
        <CardTitle>
          <Link to={ROUTE.GOAL_UPDATE} params={{ id: goal.id }} className="underline">
            {goal.name}
          </Link>
        </CardTitle>

        <p className="text-sm">
          {goal.amount.toLocaleString("en-US")} {goal.currency?.symbol}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-4">
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

        <div className="flex items-center justify-end">
          <div className="flex gap-1 text-xs text-muted-foreground italic">
            <p>{dayjs(goal.start).format("YYYY-MM-DD")}</p>
            <p>~</p>
            {goal.end ? <p>{dayjs(goal.end).format("YYYY-MM-DD")}</p> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
