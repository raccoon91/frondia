import { lazy } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";

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
    </>
  ),
});
