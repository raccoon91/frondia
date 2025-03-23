import { createFileRoute, redirect } from "@tanstack/react-router";

import { AUTH_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useAuthStore } from "@/stores/auth.store";
import { AuthLayout } from "@/components/layouts/auth-layout";

export const Route = createFileRoute(AUTH_FILE_ROUTE)({
  beforeLoad: async () => {
    const isSuccess = await useAuthStore.getState().getUser();

    if (isSuccess) throw redirect({ to: ROUTE.DASHBOARD });
  },
  component: AuthLayout,
});
