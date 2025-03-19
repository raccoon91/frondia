import { createLazyFileRoute } from "@tanstack/react-router";

import { REPORT_FILE_ROUTE } from "@/constants/route";

const ReportPage = () => {
  return (
    <div>
      <p>Report Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute(REPORT_FILE_ROUTE)({
  component: ReportPage,
});
