import { createLazyFileRoute } from "@tanstack/react-router";

import { generateDatabaseSeed } from "@/lib/supabase/seed";
import { Button } from "@/components/ui/button";

const MainPage = () => {
  return (
    <div>
      <p>Main Page</p>

      <Button onClick={generateDatabaseSeed}>Generate Seed</Button>
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/")({
  component: MainPage,
});
