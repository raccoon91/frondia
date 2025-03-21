import { createLazyFileRoute } from "@tanstack/react-router";

import { GOAL_FILE_ROUTE } from "@/constants/route";

const GoalPage = () => {
  return (
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center px-6 border rounded-md bg-card text-card-foreground shadow-sm">
        <p className="font-bold">Goal</p>
      </div>

      <div></div>
    </div>
  );
};

export const Route = createLazyFileRoute(GOAL_FILE_ROUTE)({
  component: GoalPage,
});
