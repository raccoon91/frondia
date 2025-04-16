import { Fragment, useEffect } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useShallow } from "zustand/shallow";
import dayjs from "dayjs";

import { DASHBOARD_FILE_ROUTE, ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { useLocalStore } from "@/stores/local.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardMenu, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { MultiProgress } from "@/components/ui/multi-progress";
import { GoalProgress } from "@/components/dashboard/goal-progress";

const DashboardPage = () => {
  const localDate = useLocalStore((state) => state.localDate);
  const { transactionTypes, getTransactionTypes, getCategories, getCurrencies } = useTransactionOptionStore(
    useShallow((state) => ({
      transactionTypes: state.transactionTypes,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
      getCurrencies: state.getCurrencies,
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
    Promise.all([getTransactionTypes(), getCategories(), getCurrencies(), getTransactions()]).then(() => {
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
            {statistics?.length ? (
              <table className="-mt-4">
                <tbody>
                  {statistics.map(({ type, totalUsd, totalSummaries, categories }) => (
                    <Fragment key={type.id}>
                      <tr>
                        <td className="text-left pt-4 align-top">
                          <p className="text-sm font-bold">{type.name}</p>
                        </td>
                        <td className="text-right pt-4 space-x-2">
                          {totalSummaries?.map(({ currency, totalAmount }) => (
                            <span
                              key={currency.id}
                              className="text-sm font-bold"
                            >{`${currency.code} : ${totalAmount.toLocaleString("en-US")}`}</span>
                          ))}
                        </td>
                        <td className="pt-4 align-top">
                          <p className="text-sm font-bold text-right pl-4">Amount</p>
                        </td>
                        <td className="pt-4 align-top">
                          <p className="text-sm font-bold text-right pl-4">Count</p>
                        </td>
                      </tr>

                      {categories?.map(({ category, currencies }) => (
                        <tr key={category.id}>
                          <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                            <p className="text-sm pl-6 pr-4">{category.name}</p>
                          </td>

                          <td className="pt-1 align-top">
                            <MultiProgress
                              values={currencies?.map(({ transaction }) => (transaction.usd / totalUsd) * 100)}
                            />
                          </td>

                          <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                            {currencies?.map(({ currency, transaction }) => (
                              <p
                                key={currency.id}
                                className="text-sm text-right pl-4"
                              >{`${currency.symbol} ${transaction.amount.toLocaleString("en-US")}`}</p>
                            ))}
                          </td>

                          <td className="w-[1%] whitespace-nowrap pt-1 align-top">
                            {currencies?.map(({ currency, transaction }) => (
                              <p key={currency.id} className="text-sm text-right pl-4">
                                {transaction.count.toLocaleString("en-US")}
                              </p>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center py-12">
                <Button asChild size="sm" variant="ghost" className="font-semibold">
                  <Link to={ROUTE.TRANSACTION}>
                    Add your transaction
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
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
            <CardMenu>
              <Button asChild size="icon" variant="ghost" className="w-8 h-8">
                <Link to={ROUTE.GOAL}>
                  <Settings />
                </Link>
              </Button>
            </CardMenu>

            <CardHeader>
              <CardTitle>Goals</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {goalsInProgress?.length ? (
                goalsInProgress.map((goal) => <GoalProgress key={goal.id} goal={goal} />)
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link to={ROUTE.GOAL_CREATE}>Create Goal</Link>
                </Button>
              )}
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
