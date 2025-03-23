import { Outlet } from "@tanstack/react-router";

export const MainLayout = () => {
  return (
    <div className="overflow-hidden w-screen h-[100dvh]">
      <div className="overflow-auto h-full">
        <Outlet />
      </div>
    </div>
  );
};
