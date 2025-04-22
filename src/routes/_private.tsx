import { createFileRoute, redirect } from "@tanstack/react-router";

import { PrivateLayout } from "@/components/layouts/private-layout";
import { PRIVATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute(PRIVATE_FILE_ROUTE)({
  beforeLoad: async () => {
    const isSuccess = await useAuthStore.getState().getUser();

    if (!isSuccess) throw redirect({ to: ROUTE.LOGIN });
  },
  component: PrivateLayout,
});
