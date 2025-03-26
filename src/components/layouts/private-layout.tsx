import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "./sidebar";

export const PrivateLayout = () => {
  return (
    <div className="overflow-hidden grid grid-cols-[48px_1fr] w-screen h-[100dvh]">
      <Sidebar />

      <div className="overflow-x-hidden overflow-y-auto h-full">
        <div className="container max-w-7xl mx-auto px-8 pt-20 pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
