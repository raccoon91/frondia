import { useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";

import { HOME_FILE_ROUTE } from "@/constants/route";
import { generateCurrency, generateTypeAndCategory } from "@/lib/supabase/seed";
import { useHomeStore } from "@/stores/home.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

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
    <div className="grid grid-cols-[1fr_272px] items-start gap-8">
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
                  <div key={category.id} className="flex justify-between ml-4">
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

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar components={{ Caption: () => null }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button size="sm" variant="outline" onClick={generateCurrency}>
              Generate Currency
            </Button>
            <Button size="sm" variant="outline" onClick={generateTypeAndCategory}>
              Generate Type and Category
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(HOME_FILE_ROUTE)({
  component: MainPage,
});
