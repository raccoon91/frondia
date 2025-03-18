import { createFileRoute, redirect } from "@tanstack/react-router";

import { MainLayout } from "@/components/layouts/main-layout";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_main")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) throw redirect({ to: "/login" });
  },
  component: MainLayout,
});
