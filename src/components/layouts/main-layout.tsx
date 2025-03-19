import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "./sidebar";

export const MainLayout = () => {
  return (
    <div className="grid grid-cols-[48px_1fr] w-screen h-[100dvh]">
      <Sidebar />

      <div className="overflow-auto flex h-full">
        <div className="container max-w-5xl flex-1 mx-auto pt-32 pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
