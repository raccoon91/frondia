import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Goal, Settings } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

import { GoalCard } from "@/components/goal/goal-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMenu, CardTitle } from "@/components/ui/card";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { GOAL_FILE_ROUTE, ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/common/session.store";
import { useGoalStore } from "@/stores/goal.store";
import { useGoalMacroStore } from "@/stores/macro/goal-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const GoalPage = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isOpenDeleteGoalDialog, setIsOpenDeleteGoalDialog] = useState(false);

  const { sessionDate, movePrevMonth, moveNextMonth } = useSessionStore(
    useShallow((state) => ({
      sessionDate: state.sessionDate,
      movePrevMonth: state.movePrevMonth,
      moveNextMonth: state.moveNextMonth,
    })),
  );
  const { getCurrencies, getTransactionTypes, getCategories } = useTransactionOptionStore(
    useShallow((state) => ({
      getCurrencies: state.getCurrencies,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
    })),
  );
  const { goalMacros, getGoalMacros } = useGoalMacroStore(
    useShallow((state) => ({
      goalMacros: state.goalMacros,
      getGoalMacros: state.getGoalMacros,
    })),
  );
  const { isLoading, goalsInReady, goalsInProgress, goalsInDone, getGoals, removeGoal } = useGoalStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      goalsInReady: state.goalsInReady,
      goalsInProgress: state.goalsInProgress,
      goalsInDone: state.goalsInDone,
      getGoals: state.getGoals,
      removeGoal: state.removeGoal,
    })),
  );

  useEffect(() => {
    Promise.all([getCurrencies(), getTransactionTypes(), getCategories(), getGoalMacros()]);
    getGoals();
  }, []);

  const handleClickPrevMonth = () => {
    movePrevMonth();

    getGoals();
  };

  const handleClickNextMonth = () => {
    moveNextMonth();

    getGoals();
  };

  const handleOpenDeleteGoalDialog = (goal: Goal) => {
    if (!goal) return;

    setIsOpenDeleteGoalDialog(true);
    setSelectedGoal(goal);
  };

  const handleCloseDeleteGoalDialog = (open?: boolean) => {
    if (open) return;

    setIsOpenDeleteGoalDialog(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = async () => {
    if (selectedGoal) {
      await removeGoal(selectedGoal.id);
      await getGoals();
    }

    handleCloseDeleteGoalDialog();
  };

  const handleClickGoalMacro = (e: MouseEvent<HTMLDivElement>) => {
    const dataset = e.currentTarget.dataset;
    const macroId = dataset.macroId;

    if (!macroId) return;

    const macro = goalMacros.find((macro) => macro.id.toString() === macroId);

    if (!macro) return;

    console.log(macro);
  };

  return (
    <>
      <DeleteDialog
        isOpen={isOpenDeleteGoalDialog}
        title="Delete Goal"
        onClose={handleCloseDeleteGoalDialog}
        onConfirm={handleDeleteGoal}
      >
        <p className="text-sm">
          Do you want to delete goal <span className="font-bold">{selectedGoal?.name}</span> ?
        </p>
      </DeleteDialog>

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
          <div className="grid grid-rows-[32px_auto] gap-4">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to={ROUTE.GOAL_CREATE}>
                  <Goal />
                  <p>Goal</p>
                </Link>
              </Button>

              {/* <ScheduleSheet /> */}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="gap-4 py-4">
                <CardHeader>
                  <CardTitle>Ready</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-2 px-4">
                  {goalsInReady.map((goal) => (
                    <GoalCard key={goal.id} isLoading={isLoading} goal={goal} onDelete={handleOpenDeleteGoalDialog} />
                  ))}
                </CardContent>
              </Card>

              <Card className="gap-4 py-4">
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 px-4">
                  {goalsInProgress.map((goal) => (
                    <GoalCard key={goal.id} isLoading={isLoading} goal={goal} onDelete={handleOpenDeleteGoalDialog} />
                  ))}
                </CardContent>
              </Card>

              <Card className="gap-4 py-4">
                <CardHeader>
                  <CardTitle>Done</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 px-4">
                  {goalsInDone.map((goal) => (
                    <GoalCard key={goal.id} isLoading={isLoading} goal={goal} onDelete={handleOpenDeleteGoalDialog} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="pt-8 pb-4 gap-4">
            <CardMenu>
              <Button asChild size="icon" variant="ghost" className="w-8 h-8">
                <Link to={ROUTE.MACRO}>
                  <Settings />
                </Link>
              </Button>
            </CardMenu>

            <CardContent className="flex flex-col gap-2 px-4">
              {goalMacros?.length ? (
                goalMacros.map((macro) => (
                  <div
                    key={macro.id}
                    data-macro-id={macro.id}
                    className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
                    onClick={handleClickGoalMacro}
                  >
                    <p className="text-sm">{macro.name}</p>
                  </div>
                ))
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link to={ROUTE.TRANSACTION_MACRO_CREATE}>Create Macro</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export const Route = createLazyFileRoute(GOAL_FILE_ROUTE)({
  component: GoalPage,
});
