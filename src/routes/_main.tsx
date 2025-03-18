import { createFileRoute, redirect } from "@tanstack/react-router";

import { MAIN_FILE_ROUTE, ROUTE } from "@/constants/route";
import { supabase } from "@/lib/supabase";
import { MainLayout } from "@/components/layouts/main-layout";

export const Route = createFileRoute(MAIN_FILE_ROUTE)({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) throw redirect({ to: ROUTE.LOGIN });
  },
  component: MainLayout,
});
