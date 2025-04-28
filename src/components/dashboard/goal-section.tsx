import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { type FC, memo } from "react";

import { GoalProgress } from "@/components/dashboard/goal-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMenu, CardTitle } from "@/components/ui/card";
import { ROUTE } from "@/constants/route";

interface GoalSectionProps {
  goalsInProgress: GoalInProgress[];
}

export const GoalSection: FC<GoalSectionProps> = memo(({ goalsInProgress }) => {
  return (
    <Card>
      <CardMenu>
        <Button asChild size="icon" variant="ghost" className="w-8 h-8">
          <Link to={ROUTE.GOAL}>
            <Settings />
          </Link>
        </Button>
      </CardMenu>

      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {goalsInProgress?.length ? (
          goalsInProgress.map((goal) => <GoalProgress key={goal.id} goal={goal} />)
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link to={ROUTE.GOAL_CREATE}>Create Goal</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
});
