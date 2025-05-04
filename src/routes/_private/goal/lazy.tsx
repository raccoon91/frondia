import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Goal } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

import { GoalCard } from "@/components/goal/goal-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { GOAL_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useSessionStore } from "@/stores/common/session.store";
import { useGoalStore } from "@/stores/goal.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const GoalPage = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isOpenDeleteGoalDialog, setIsOpenDeleteGoalDialog] = useState(false);

  const sessionDate = useSessionStore((state) => state.sessionDate);
  const { getCurrencies, getTransactionTypes, getCategories } = useTransactionOptionStore(
    useShallow((state) => ({
      getCurrencies: state.getCurrencies,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
    })),
  );
  const { isLoading, goalsInReady, goalsInProgress, goalsInDone, getGoals, removeGoal, movePrevMonth, moveNextMonth } =
    useGoalStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        goalsInReady: state.goalsInReady,
        goalsInProgress: state.goalsInProgress,
        goalsInDone: state.goalsInDone,
        getGoals: state.getGoals,
        removeGoal: state.removeGoal,
        movePrevMonth: state.movePrevMonth,
        moveNextMonth: state.moveNextMonth,
      })),
    );

  useEffect(() => {
    Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    getGoals();
  }, []);

  const handleClickPrevMonth = () => {
    movePrevMonth(sessionDate);

    getGoals();
  };

  const handleClickNextMonth = () => {
    moveNextMonth(sessionDate);

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

          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ready</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                {goalsInReady.map((goal) => (
                  <GoalCard key={goal.id} isLoading={isLoading} goal={goal} onDelete={handleOpenDeleteGoalDialog} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {goalsInProgress.map((goal) => (
                  <GoalCard key={goal.id} isLoading={isLoading} goal={goal} onDelete={handleOpenDeleteGoalDialog} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Done</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {goalsInDone.map((goal) => (
                  <GoalCard key={goal.id} isLoading={isLoading} goal={goal} onDelete={handleOpenDeleteGoalDialog} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export const Route = createLazyFileRoute(GOAL_FILE_ROUTE)({
  component: GoalPage,
});
