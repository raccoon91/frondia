import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GOAL_UPDATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { goalFormDefaultValues, goalFormSchema } from "@/schema/goal.schema";
import { useGoalStore } from "@/stores/goal.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GoalForm } from "@/components/goal/goal-form";

const GoalUpdatePage = () => {
  const navigate = useNavigate();
  const params = useParams({ from: GOAL_UPDATE_FILE_ROUTE });
  const [isOpenGoalUpdateSheet, setIsOpenGoalUpdateSheet] = useState(true);
  const [goal, setGoal] = useState<Goal | null>(null);

  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      currencies: state.currencies,
      transactionTypes: state.transactionTypes,
      categories: state.categories,
    })),
  );

  const { isLoading, getGoals, getGoal, updateGoal } = useGoalStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getGoals: state.getGoals,
      getGoal: state.getGoal,
      updateGoal: state.updateGoal,
    })),
  );

  const goalForm = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: goalFormDefaultValues,
  });

  const getGoalDetail = useCallback(async () => {
    if (!params.id) return;

    const goal = await getGoal(params.id);

    if (!goal) return;

    setGoal(goal);

    Object.keys(goalFormDefaultValues).forEach((key) => {
      const formKey = key as keyof typeof goalFormDefaultValues;
      const formValue =
        formKey === "categories"
          ? (goal.map?.map((map) => map.category.id.toString()) ?? [])
          : typeof goal[formKey] === "number"
            ? goal[formKey].toString()
            : (goal[formKey] ?? "");

      goalForm.setValue(formKey, formValue);
    });
  }, [params]);

  useEffect(() => {
    getGoalDetail();
  }, [getGoalDetail]);

  const handleCloseGoalSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenGoalUpdateSheet(false);
    setGoal(null);

    goalForm.reset();

    navigate({ to: ROUTE.GOAL });
  };

  const handleUpdateGoal = async (formdata: z.infer<typeof goalFormSchema>) => {
    if (!goal) return;

    await updateGoal(goal, formdata);

    getGoals();

    handleCloseGoalSheet();
  };

  return (
    <Sheet open={isOpenGoalUpdateSheet} onOpenChange={handleCloseGoalSheet}>
      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Goal</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <GoalForm
          isLoading={isLoading}
          currencies={currencies}
          transactionTypes={transactionTypes}
          categories={categories}
          submitText="Update Goal"
          goalForm={goalForm}
          onSubmitGoal={handleUpdateGoal}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(GOAL_UPDATE_FILE_ROUTE)({
  component: GoalUpdatePage,
});
