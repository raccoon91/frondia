import { lazy } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

const GATracker =
  process.env.NODE_ENV === "development"
    ? () => null
    : lazy(() =>
        import("@/lib/google-analytics").then((res) => ({
          default: res.default,
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
