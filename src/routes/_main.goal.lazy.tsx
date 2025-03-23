import { useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { z } from "zod";

import { GOAL_FILE_ROUTE } from "@/constants/route";
import { goalFormSchema } from "@/schema/goal.schema";
import { useGoalStore } from "@/stores/goal.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalSheet } from "@/components/goal/goal-sheet";
import { GoalCard } from "@/components/goal/goal-card";

const GoalPage = () => {
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

  const { goals, getGoals, createGoal } = useGoalStore(
    useShallow((state) => ({
      goals: state.goals,
      getGoals: state.getGoals,
      createGoal: state.createGoal,
    })),
  );

  useEffect(() => {
    getCurrencies();
    getTransactionTypes();
    getCategories();
    getGoals();
  }, []);

  const handleCreateGoal = async (formdata: z.infer<typeof goalFormSchema>) => {
    await createGoal(formdata);

    getGoals();
  };

  return (
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center px-6 border rounded-md bg-card text-card-foreground shadow-sm">
        <p className="font-bold">Goal</p>
      </div>

      <div className="grid grid-rows-[32px_auto] gap-4">
        <div className="flex justify-end gap-2">
          <GoalSheet
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
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}

              {/* <div className="overflow-hidden relative flex flex-col gap-2 p-4 border rounded-md bg-background shadow-sm">
                <div className="absolute top-0 right-0 py-1 px-2 rounded-bl-sm bg-indigo-300">
                  <p className="text-sm">Schedule</p>
                </div>

                <p className="font-bold">name</p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Investment</Badge>
                  <Badge variant="outline">Stock</Badge>
                  <Badge variant="outline">S&P500</Badge>
                </div>

                <div className="flex justify-between px-2">
                  <div className="flex gap-2">
                    <p className="text-sm">day</p>

                    <p className="text-sm">15:00</p>
                  </div>

                  <p className="text-sm">10000</p>
                </div>

                <div className="flex items-center justify-end gap-1 px-2 text-xs text-muted-foreground italic">
                  <p>{dayjs().format("YYYY-MM-DD")}</p>
                  <p>~</p>
                  <p>{dayjs().add(7, "day").format("YYYY-MM-DD")}</p>
                </div>
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Done</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(GOAL_FILE_ROUTE)({
  component: GoalPage,
});
