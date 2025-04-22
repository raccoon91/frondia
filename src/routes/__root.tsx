import { Outlet, createRootRoute } from "@tanstack/react-router";
import { lazy } from "react";

import { Toaster } from "@/components/ui/sonner";
import GATracker from "@/lib/google-analytics";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />

      <Toaster position="top-right" />

      <TanStackRouterDevtools position="bottom-right" />

      <GATracker />
    </>
  ),
});
