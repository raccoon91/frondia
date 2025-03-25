import { useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { z } from "zod";

import { GOAL_FILE_ROUTE } from "@/constants/route";
import { goalFormSchema } from "@/schema/goal.schema";
import { useLocalStore } from "@/stores/local.store";
import { useGoalStore } from "@/stores/goal.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalSheet } from "@/components/goal/goal-sheet";
import { GoalCard } from "@/components/goal/goal-card";

const GoalPage = () => {
  const localDate = useLocalStore((state) => state.localDate);
  const { currencies, transactionTypes, categories, getCurrencies, getTransactionTypes, getCategories } =
    useTransactionOptionStore(
      useShallow((state) => ({
        currencies: state.currencies,
        transactionTypes: state.transactionTypes,
        categories: state.categories,
        getCurrencies: state.getCurrencies,
        getTransactionTypes: state.getTransactionTypes,
        getCategories: state.getCategories,
      })),
    );

  const { isLoading, goalsInReady, goalsInProgress, goalsInDone, getGoals, createGoal, movePrevMonth, moveNextMonth } =
    useGoalStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        goalsInReady: state.goalsInReady,
        goalsInProgress: state.goalsInProgress,
        goalsInDone: state.goalsInDone,
        getGoals: state.getGoals,
        createGoal: state.createGoal,
        movePrevMonth: state.movePrevMonth,
        moveNextMonth: state.moveNextMonth,
      })),
    );

  useEffect(() => {
    Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    getGoals();
  }, []);

  const handleCreateGoal = async (formdata: z.infer<typeof goalFormSchema>) => {
    await createGoal(formdata);

    getGoals();
  };

  const handleClickPrevMonth = () => {
    movePrevMonth(localDate);

    getGoals();
  };

  const handleClickNextMonth = () => {
    moveNextMonth(localDate);

    getGoals();
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

      <div className="grid grid-rows-[32px_auto] gap-4">
        <div className="flex justify-end gap-2">
          <GoalSheet
            isLoading={isLoading}
            currencies={currencies}
            transactionTypes={transactionTypes}
            categories={categories}
            onCreate={handleCreateGoal}
          />

          {/* <ScheduleSheet /> */}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ready</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {goalsInReady.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {goalsInProgress.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Done</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {goalsInDone.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(GOAL_FILE_ROUTE)({
  component: GoalPage,
});
