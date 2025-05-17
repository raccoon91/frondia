import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { GoalMacroForm } from "@/components/macro/goal-macro-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GOAL_MACRO_CREATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { goalMacroFormDefaultValues, goalMacroFormSchema } from "@/schema/macro.schema";
import { useGoalMacroStore } from "@/stores/macro/goal-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const GoalMacroCreatePage = () => {
  const navigate = useNavigate();
  const [isOpenMacroCreateSheet, setIsOpenMacroCreateSheet] = useState(true);

  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      transactionTypes: state.transactionTypes,
      categories: state.categories,
      currencies: state.currencies,
    })),
  );
  const { isLoading, getAllGoalMacros, createGoalMacro } = useGoalMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getAllGoalMacros: state.getAllGoalMacros,
      createGoalMacro: state.createGoalMacro,
    })),
  );

  const goalMacroForm = useForm<z.infer<typeof goalMacroFormSchema>>({
    resolver: zodResolver(goalMacroFormSchema),
    defaultValues: goalMacroFormDefaultValues,
  });

  const handleCloseGoalMacroSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenMacroCreateSheet(false);

    navigate({ to: ROUTE.MACRO });
  };

  const handleCreateGoalMacro = async (formdata: z.infer<typeof goalMacroFormSchema>) => {
    await createGoalMacro(formdata);

    getAllGoalMacros();

    handleCloseGoalMacroSheet();
  };

  return (
    <Sheet open={isOpenMacroCreateSheet} onOpenChange={handleCloseGoalMacroSheet}>
      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Goal Macro</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <GoalMacroForm
          isLoading={isLoading}
          transactionTypes={transactionTypes}
          categories={categories}
          currencies={currencies}
          submitText="Create Goal Macro"
          goalMacroForm={goalMacroForm}
          onSubmitMacro={handleCreateGoalMacro}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(GOAL_MACRO_CREATE_FILE_ROUTE)({
  component: GoalMacroCreatePage,
});
