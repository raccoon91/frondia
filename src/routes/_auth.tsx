import { createFileRoute, redirect } from "@tanstack/react-router";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { AUTH_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute(AUTH_FILE_ROUTE)({
  beforeLoad: async () => {
    const isSuccess = await useAuthStore.getState().getUser();

    if (isSuccess) throw redirect({ to: ROUTE.DASHBOARD });
  },
  component: AuthLayout,
});
