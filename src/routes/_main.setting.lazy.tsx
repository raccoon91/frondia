import { createLazyFileRoute } from "@tanstack/react-router";

import { SETTING_FILE_ROUTE } from "@/constants/route";

const SettingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
      <p>Setting Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute(SETTING_FILE_ROUTE)({
  component: SettingPage,
});
