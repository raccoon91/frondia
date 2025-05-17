import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { GoalMacroForm } from "@/components/macro/goal-macro-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GOAL_MACRO_UPDATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { goalMacroFormDefaultValues, goalMacroFormSchema } from "@/schema/macro.schema";
import { useGoalMacroStore } from "@/stores/macro/goal-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const GoalMacroUpdatePage = () => {
  const navigate = useNavigate();
  const params = useParams({ from: GOAL_MACRO_UPDATE_FILE_ROUTE });
  const [isOpenMacroUpdateSheet, setIsOpenMacroUpdateSheet] = useState(true);
  const [goalMacro, setGoalMacro] = useState<GoalMacro | null>(null);

  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      transactionTypes: state.transactionTypes,
      categories: state.categories,
      currencies: state.currencies,
    })),
  );
  const { isLoading, getAllGoalMacros, getGoalMacro, updateGoalMacro } = useGoalMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getAllGoalMacros: state.getAllGoalMacros,
      getGoalMacro: state.getGoalMacro,
      updateGoalMacro: state.updateGoalMacro,
    })),
  );

  const goalMacroForm = useForm<z.infer<typeof goalMacroFormSchema>>({
    resolver: zodResolver(goalMacroFormSchema),
    defaultValues: goalMacroFormDefaultValues,
  });

  const getGoalMacroDetail = useCallback(async () => {
    if (!params.id) return;

    const goalMacro = await getGoalMacro(params.id);

    if (!goalMacro) return;

    setGoalMacro(goalMacro);

    Object.keys(goalMacroFormDefaultValues).forEach((key) => {
      const formKey = key as keyof typeof goalMacroFormDefaultValues;
      const formValue =
        typeof goalMacro[formKey] === "number" ? goalMacro[formKey].toString() : (goalMacro[formKey] ?? "");

      goalMacroForm.setValue(formKey, formValue as string | string[]);
    });
  }, [params]);

  useEffect(() => {
    getGoalMacroDetail();
  }, [getGoalMacroDetail]);

  const handleCloseGoalMacroSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenMacroUpdateSheet(false);
    setGoalMacro(null);

    goalMacroForm.reset();

    navigate({ to: ROUTE.MACRO });
  };

  const handleUpdateGoalMacro = async (formdata: z.infer<typeof goalMacroFormSchema>) => {
    if (!goalMacro) return;

    await updateGoalMacro(goalMacro, formdata);

    getAllGoalMacros();

    handleCloseGoalMacroSheet();
  };

  return (
    <Sheet open={isOpenMacroUpdateSheet} onOpenChange={handleCloseGoalMacroSheet}>
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
          submitText="Update Goal Macro"
          goalMacroForm={goalMacroForm}
          onSubmitMacro={handleUpdateGoalMacro}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(GOAL_MACRO_UPDATE_FILE_ROUTE)({
  component: GoalMacroUpdatePage,
});
