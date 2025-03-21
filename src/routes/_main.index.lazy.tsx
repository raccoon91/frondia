import { Fragment, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";

import { HOME_FILE_ROUTE } from "@/constants/route";
import { generateCurrency, generateTypeAndCategory } from "@/lib/supabase/seed";
import { useHomeStore } from "@/stores/home.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";

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
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center gap-6 px-6 border rounded-md bg-card text-card-foreground shadow-sm"></div>

      <div className="grid grid-cols-[1fr_272px] items-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="-mt-4">
              <tbody>
                {Object.values(statistics)
                  .filter(({ totalCount }) => totalCount)
                  .map(({ type, totalAmount, category }) => (
                    <Fragment key={type.id}>
                      <tr>
                        <td className="text-left pt-4">
                          <p className="text-sm font-bold">{type.name}</p>
                        </td>
                        <td className="text-right pt-4">
                          <p className="text-sm font-bold">{`Total : ${totalAmount.toLocaleString("en-US")}`}</p>
                        </td>
                        <td className="pt-4">
                          <p className="text-sm font-bold text-right pl-4">count</p>
                        </td>
                      </tr>

                      {Object.values(category)
                        .filter(({ transaction }) => transaction.count)
                        .map(({ category, transaction }) => (
                          <tr key={category.id}>
                            <td className="w-[1%] whitespace-nowrap pt-1">
                              <p className="text-sm pl-6 pr-4">{category.name}</p>
                            </td>

                            <td className="relative pt-1">
                              <Progress value={(transaction.amount / totalAmount) * 100} />

                              <div className="absolute top-1 right-0">
                                <p className="text-sm">{transaction.amount.toLocaleString("en-US")}</p>
                              </div>
                            </td>

                            <td className="w-[1%] whitespace-nowrap pt-1">
                              <p className="text-sm text-right pl-4">{transaction.count.toLocaleString("en-US")}</p>
                            </td>
                          </tr>
                        ))}
                    </Fragment>
                  ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
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
    </div>
  );
};

export const Route = createLazyFileRoute(HOME_FILE_ROUTE)({
  component: MainPage,
});
