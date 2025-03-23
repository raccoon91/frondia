import { createLazyFileRoute } from "@tanstack/react-router";

import { REPORT_FILE_ROUTE } from "@/constants/route";

const ReportPage = () => {
  return (
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center px-6 border rounded-md bg-card text-card-foreground shadow-sm">
        <p className="font-bold">Report</p>
      </div>

      <div></div>
    </div>
  );
};

export const Route = createLazyFileRoute(REPORT_FILE_ROUTE)({
  component: ReportPage,
});
