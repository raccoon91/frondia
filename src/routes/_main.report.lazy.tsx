import { createLazyFileRoute } from "@tanstack/react-router";

import { REPORT_FILE_ROUTE } from "@/constants/route";

const ReportPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
      <p>Report Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute(REPORT_FILE_ROUTE)({
  component: ReportPage,
});
