import { Outlet } from "@tanstack/react-router";

export const AuthLayout = () => {
  return (
    <div className="overflow-hidden w-screen h-[100dvh]">
      <Outlet />
    </div>
  );
};
