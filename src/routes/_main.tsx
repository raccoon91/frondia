import { createFileRoute, redirect } from "@tanstack/react-router";

import { MAIN_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";
import { MainLayout } from "@/components/layouts/main-layout";

export const Route = createFileRoute(MAIN_FILE_ROUTE)({
  beforeLoad: async () => {
    const isSuccess = await useAuthStore.getState().getUser();

    if (!isSuccess) throw redirect({ to: ROUTE.LOGIN });
  },
  component: MainLayout,
});
