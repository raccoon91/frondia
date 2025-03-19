import { useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";

import { HOME_FILE_ROUTE } from "@/constants/route";
import { generateDatabaseSeed } from "@/lib/supabase/seed";
import { useHomeStore } from "@/stores/home.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MainPage = () => {
  const { statistics, getStatistics } = useHomeStore(
    useShallow((state) => ({
      statistics: state.statistics,
      getStatistics: state.getStatistics,
    })),
  );

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-start gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {Object.values(statistics).map(({ type, category }) => (
              <div key={type.id}>
                <p>{type.name}</p>

                {Object.values(category).map(({ category, transaction }) => (
                  <div key={category.id} className="flex justify-between">
                    <p>{category.name}</p>

                    <div className="flex gap-2">
                      <p>{transaction.amount}</p>
                      <p>{transaction.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={generateDatabaseSeed}>Generate Seed</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createLazyFileRoute(HOME_FILE_ROUTE)({
  component: MainPage,
});
