import { createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { Button } from "@/components/ui/button";
import { DASHBOARD_FILE_ROUTE } from "@/constants/route";
import { useSessionStore } from "@/stores/common/session.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { StatisticsSection } from "@/components/dashboard/statistics-section";
import { CalendarSection } from "@/components/dashboard/calendar-section";
import { GoalSection } from "@/components/dashboard/goal-section";

const DashboardPage = () => {
  const sessionDate = useSessionStore((state) => state.sessionDate);
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
    movePrevMonth(sessionDate);

    getTransactions().then(() => {
      getStatistics();
      getCalendarStatistics();
      getGoalsInProgress();
    });
  };

  const handleClickNextMonth = () => {
    moveNextMonth(sessionDate);

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
        <p className="font-bold">{sessionDate}</p>
        <Button variant="ghost" className="w-8 h-8" onClick={handleClickNextMonth}>
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_272px] items-start gap-6">
        <StatisticsSection statistics={statistics} />

        <div className="flex flex-col gap-6">
          <CalendarSection
            sessionDate={sessionDate}
            transactionTypes={transactionTypes}
            calendarStatisticsByTypeMap={calendarStatisticsByTypeMap}
            calendarStatisticsMap={calendarStatisticsMap}
          />

          <GoalSection goalsInProgress={goalsInProgress} />
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(DASHBOARD_FILE_ROUTE)({
  component: DashboardPage,
});
