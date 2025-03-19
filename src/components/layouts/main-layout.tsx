import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "./sidebar";

export const MainLayout = () => {
  return (
    <div className="grid grid-cols-[48px_1fr] w-screen h-[100dvh]">
      <Sidebar />

      <div className="overflow-auto h-full">
        <div className="container mx-auto pt-32 pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
