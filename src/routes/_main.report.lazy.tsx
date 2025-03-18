import { createLazyFileRoute } from "@tanstack/react-router";

const ReportPage = () => {
  return (
    <div>
      <p>Report Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/report")({
  component: ReportPage,
});
