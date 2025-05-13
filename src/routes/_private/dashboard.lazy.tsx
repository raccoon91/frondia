import { createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { CalendarSection } from "@/components/dashboard/calendar-section";
import { GoalSection } from "@/components/dashboard/goal-section";
import { StatisticsSection } from "@/components/dashboard/statistics-section";
import { Button } from "@/components/ui/button";
import { DASHBOARD_FILE_ROUTE } from "@/constants/route";
import { useLocalStore } from "@/stores/common/local.store";
import { useSessionStore } from "@/stores/common/session.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const DashboardPage = () => {
  const { localCalendarType, setCalendarType } = useLocalStore(
    useShallow((state) => ({
      localCalendarType: state.localCalendarType,
      setCalendarType: state.setCalendarType,
    })),
  );
  const { sessionDate, movePrevMonth, moveNextMonth } = useSessionStore(
    useShallow((state) => ({
      sessionDate: state.sessionDate,
      movePrevMonth: state.movePrevMonth,
      moveNextMonth: state.moveNextMonth,
    })),
  );
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
    calendarCountByTypeMap,
    goalsInProgress,
    getTransactions,
    getStatistics,
    getCalendarStatistics,
    getGoalsInProgress,
  } = useDashboardStore(
    useShallow((state) => ({
      statistics: state.statistics,
      calendarStatisticsMap: state.calendarStatisticsMap,
      calendarCountByTypeMap: state.calendarCountByTypeMap,
      goalsInProgress: state.goalsInProgress,
      getTransactions: state.getTransactions,
      getStatistics: state.getStatistics,
      getCalendarStatistics: state.getCalendarStatistics,
      getGoalsInProgress: state.getGoalsInProgress,
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
    movePrevMonth();

    getTransactions().then(() => {
      getStatistics();
      getCalendarStatistics();
      getGoalsInProgress();
    });
  };

  const handleClickNextMonth = () => {
    moveNextMonth();

    getTransactions().then(() => {
      getStatistics();
      getCalendarStatistics();
      getGoalsInProgress();
    });
  };

  const handleClickCalendarType = (calendarType: number) => {
    setCalendarType(calendarType);
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

      <div className="grid grid-cols-[1fr_328px] items-start gap-6">
        <StatisticsSection statistics={statistics} />

        <div className="flex flex-col gap-6">
          <CalendarSection
            selectedType={localCalendarType}
            sessionDate={sessionDate}
            transactionTypes={transactionTypes}
            calendarCountByTypeMap={calendarCountByTypeMap}
            calendarStatisticsMap={calendarStatisticsMap}
            onClickCalendarType={handleClickCalendarType}
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
