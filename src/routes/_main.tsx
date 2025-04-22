import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/components/layouts/main-layout";
import { MAIN_FILE_ROUTE } from "@/constants/route";

export const Route = createFileRoute(MAIN_FILE_ROUTE)({
  component: MainLayout,
});
