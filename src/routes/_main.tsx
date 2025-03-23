import { createFileRoute } from "@tanstack/react-router";

import { MAIN_FILE_ROUTE } from "@/constants/route";
import { MainLayout } from "@/components/layouts/main-layout";

export const Route = createFileRoute(MAIN_FILE_ROUTE)({
  component: MainLayout,
});
