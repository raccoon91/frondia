import { createFileRoute, redirect } from "@tanstack/react-router";

import { supabase } from "@/lib/supabase";
import { AuthLayout } from "@/components/layouts/auth-layout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});
