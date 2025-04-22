import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { MacroForm } from "@/components/macro/macro-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MACRO_CREATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { macroFormDefaultValues, macroFormSchema } from "@/schema/macro.schema";
import { useMacroStore } from "@/stores/macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const MacroCreatePage = () => {
  const navigate = useNavigate();
  const [isOpenMacroCreateSheet, setIsOpenMacroCreateSheet] = useState(true);

  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      currencies: state.currencies,
      transactionTypes: state.transactionTypes,
      categories: state.categories,
    })),
  );
  const { isLoading, getAllMacros, createMacro } = useMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getAllMacros: state.getAllMacros,
      createMacro: state.createMacro,
    })),
  );

  const macroForm = useForm<z.infer<typeof macroFormSchema>>({
    resolver: zodResolver(macroFormSchema),
    defaultValues: macroFormDefaultValues,
  });

  const handleCloseMacroSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenMacroCreateSheet(false);

    navigate({ to: ROUTE.MACRO });
  };

  const handleCreateMacro = async (formdata: z.infer<typeof macroFormSchema>) => {
    await createMacro(formdata);

    getAllMacros();

    handleCloseMacroSheet();
  };

  return (
    <Sheet open={isOpenMacroCreateSheet} onOpenChange={handleCloseMacroSheet}>
      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Macro</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <MacroForm
          isLoading={isLoading}
          currencies={currencies}
          transactionTypes={transactionTypes}
          categories={categories}
          submitText="Create Macro"
          macroForm={macroForm}
          onSubmitMacro={handleCreateMacro}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(MACRO_CREATE_FILE_ROUTE)({
  component: MacroCreatePage,
});
