import { createLazyFileRoute } from "@tanstack/react-router";

const GoalPage = () => {
  return (
    <div>
      <p>Goal Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/goal")({
  component: GoalPage,
});
