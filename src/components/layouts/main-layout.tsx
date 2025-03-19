import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "./sidebar";

export const MainLayout = () => {
  return (
    <div className="overflow-hidden grid grid-cols-[48px_1fr] w-screen h-[100dvh]">
      <Sidebar />

      <div className="container mx-auto pt-32">
        <Outlet />
      </div>
    </div>
  );
};
