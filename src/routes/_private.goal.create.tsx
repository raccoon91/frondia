import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GOAL_CREATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { goalFormDefaultValues, goalFormSchema } from "@/schema/goal.schema";
import { useGoalStore } from "@/stores/goal.store";
import { useGoalRuleStore } from "@/stores/goal-rule.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GoalForm } from "@/components/goal/goal-form";

const GoalCreatePage = () => {
  const navigate = useNavigate();
  const [isOpenGoalCreateSheet, setIsOpenGoalCreateSheet] = useState(true);

  const { goalRules } = useGoalRuleStore(
    useShallow((state) => ({
      goalRules: state.goalRules,
    })),
  );
  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      currencies: state.currencies,
      transactionTypes: state.transactionTypes,
      categories: state.categories,
    })),
  );

  const { isLoading, getGoals, createGoal } = useGoalStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getGoals: state.getGoals,
      createGoal: state.createGoal,
    })),
  );

  const goalForm = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: goalFormDefaultValues,
  });

  const handleCloseGoalSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenGoalCreateSheet(false);

    navigate({ to: ROUTE.GOAL });
  };

  const handleCreateGoal = async (formdata: z.infer<typeof goalFormSchema>) => {
    await createGoal(formdata);

    getGoals();

    handleCloseGoalSheet();
  };

  return (
    <Sheet open={isOpenGoalCreateSheet} onOpenChange={handleCloseGoalSheet}>
      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Goal</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <GoalForm
          isLoading={isLoading}
          goalRules={goalRules}
          currencies={currencies}
          transactionTypes={transactionTypes}
          categories={categories}
          submitText="Create Goal"
          goalForm={goalForm}
          onSubmitGoal={handleCreateGoal}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(GOAL_CREATE_FILE_ROUTE)({
  component: GoalCreatePage,
});
