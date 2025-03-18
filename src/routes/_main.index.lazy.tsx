import { createLazyFileRoute } from "@tanstack/react-router";

import { HOME_FILE_ROUTE } from "@/constants/route";
import { generateDatabaseSeed } from "@/lib/supabase/seed";
import { Button } from "@/components/ui/button";

const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
      <p>Main Page</p>

      <Button onClick={generateDatabaseSeed}>Generate Seed</Button>
    </div>
  );
};

export const Route = createLazyFileRoute(HOME_FILE_ROUTE)({
  component: MainPage,
});
