import { createFileRoute, redirect } from "@tanstack/react-router";

import { AUTH_FILE_ROUTE, ROUTE } from "@/constants/route";
import { supabase } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layouts/auth-layout";

export const Route = createFileRoute(AUTH_FILE_ROUTE)({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) throw redirect({ to: ROUTE.HOME });
  },
  component: AuthLayout,
});
