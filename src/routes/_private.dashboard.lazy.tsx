import { Fragment, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShallow } from "zustand/shallow";
import dayjs from "dayjs";

import { DASHBOARD_FILE_ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { useLocalStore } from "@/stores/local.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { GoalProgress } from "@/components/dashboard/goal-progress";

const DashboardPage = () => {
  const localDate = useLocalStore((state) => state.localDate);
  const { transactionTypes, getTransactionTypes, getCategories } = useTransactionOptionStore(
    useShallow((state) => ({
      transactionTypes: state.transactionTypes,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
    })),
  );
  const {
    statistics,
    calendarStatisticsMap,
    calendarStatisticsByTypeMap,
    goalsInProgress,
    getTransactions,
    getStatistics,
    getCalendarStatistics,
    getGoalsInProgress,
    movePrevMonth,
    moveNextMonth,
  } = useDashboardStore(
    useShallow((state) => ({
      statistics: state.statistics,
      calendarStatisticsMap: state.calendarStatisticsMap,
      calendarStatisticsByTypeMap: state.calendarStatisticsByTypeMap,
      goalsInProgress: state.goalsInProgress,
      getTransactions: state.getTransactions,
      getStatistics: state.getStatistics,
      getCalendarStatistics: state.getCalendarStatistics,
      getGoalsInProgress: state.getGoalsInProgress,
      movePrevMonth: state.movePrevMonth,
      moveNextMonth: state.moveNextMonth,
    })),
  );

  useEffect(() => {
    Promise.all([getTransactionTypes(), getCategories(), getTransactions()]).then(() => {
      getStatistics();
      getCalendarStatistics();
      getGoalsInProgress();
    });
  }, []);

  const handleClickPrevMonth = () => {
    movePrevMonth(localDate);

    getTransactions().then(() => {
      getStatistics();
      getCalendarStatistics();
      getGoalsInProgress();
    });
  };

  const handleClickNextMonth = () => {
    moveNextMonth(localDate);

    getTransactions().then(() => {
      getStatistics();
      getCalendarStatistics();
      getGoalsInProgress();
    });
  };

  return (
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center gap-2 px-6 border rounded-md bg-card text-card-foreground shadow-sm">
        <Button variant="ghost" className="w-8 h-8" onClick={handleClickPrevMonth}>
          <ChevronLeft />
        </Button>
        <p className="font-bold">{localDate}</p>
        <Button variant="ghost" className="w-8 h-8" onClick={handleClickNextMonth}>
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_272px] items-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="-mt-4">
              <tbody>
                {statistics.map(({ type, totalAmount, categories }) => (
                  <Fragment key={type.id}>
                    <tr>
                      <td className="text-left pt-4">
                        <p className="text-sm font-bold">{type.name}</p>
                      </td>
                      <td className="text-right pt-4">
                        <p className="text-sm font-bold">{`Total : ${totalAmount.toLocaleString("en-US")}`}</p>
                      </td>
                      <td className="pt-4">
                        <p className="text-sm font-bold text-right pl-4">Amount</p>
                      </td>
                      <td className="pt-4">
                        <p className="text-sm font-bold text-right pl-4">Count</p>
                      </td>
                    </tr>

                    {categories?.map(({ category, transaction }) => (
                      <tr key={category.id}>
                        <td className="w-[1%] whitespace-nowrap pt-1">
                          <p className="text-sm pl-6 pr-4">{category.name}</p>
                        </td>

                        <td className="pt-1">
                          <Progress value={(transaction.amount / totalAmount) * 100} />
                        </td>

                        <td className="w-[1%] whitespace-nowrap pt-1">
                          <p className="text-sm text-right pl-4">{transaction.amount.toLocaleString("en-US")}</p>
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
              <Calendar
                month={dayjs(localDate).toDate()}
                components={{
                  Caption: () => null,
                  DayContent: ({ date }) => {
                    const fullDate = dayjs(date).format("YYYY-MM-DD");
                    const displayDate = dayjs(date).get("date");
                    const calendarMap = calendarStatisticsMap[fullDate];

                    return (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <p>{displayDate}</p>

                        {Object.values(calendarMap ?? {}).map(({ type }) => (
                          <div
                            key={type.id}
                            style={{
                              top: type.config?.top,
                              right: type.config?.right,
                              bottom: type.config?.bottom,
                              left: type.config?.left,
                            }}
                            className={cn(
                              "absolute flex items-center justify-center min-w-1.5 min-h-1.5 rounded-sm z-1",
                              type.config?.color ?? "",
                            )}
                          />
                        ))}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {transactionTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-1">
                  <div key={type.id} className={cn("w-3 h-1.5 rounded-sm", type.config?.color ?? "")} />
                  <p className="text-xs">{type.name}</p>
                  <p className="text-xs">{calendarStatisticsByTypeMap?.[type.id]?.count ?? "--"}</p>
                </div>
              ))}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {goalsInProgress.map((goal) => (
                <GoalProgress key={goal.id} goal={goal} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(DASHBOARD_FILE_ROUTE)({
  component: DashboardPage,
});
