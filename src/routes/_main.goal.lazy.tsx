import { createLazyFileRoute } from "@tanstack/react-router";

import { GOAL_FILE_ROUTE } from "@/constants/route";

const GoalPage = () => {
  return (
    <div>
      <p>Goal Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute(GOAL_FILE_ROUTE)({
  component: GoalPage,
});
