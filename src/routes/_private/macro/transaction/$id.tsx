import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { TransactionMacroForm } from "@/components/macro/transaction-macro-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ROUTE, TRANSACTION_MACRO_UPDATE_FILE_ROUTE } from "@/constants/route";
import { macroFormDefaultValues, macroFormSchema } from "@/schema/macro.schema";
import { useTransactionMacroStore } from "@/stores/transaction-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const MacroUpdatePage = () => {
  const navigate = useNavigate();
  const params = useParams({ from: TRANSACTION_MACRO_UPDATE_FILE_ROUTE });
  const [isOpenMacroUpdateSheet, setIsOpenMacroUpdateSheet] = useState(true);
  const [transactionMacro, setTransactionMacro] = useState<TransactionMacro | null>(null);

  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      currencies: state.currencies,
      transactionTypes: state.transactionTypes,
      categories: state.categories,
    })),
  );
  const { isLoading, getAllTransactionMacros, getTransactionMacro, updateTransactionMacro } = useTransactionMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getAllTransactionMacros: state.getAllTransactionMacros,
      getTransactionMacro: state.getTransactionMacro,
      updateTransactionMacro: state.updateTransactionMacro,
    })),
  );

  const transactionMacroForm = useForm<z.infer<typeof macroFormSchema>>({
    resolver: zodResolver(macroFormSchema),
    defaultValues: macroFormDefaultValues,
  });

  const getMacroDetail = useCallback(async () => {
    if (!params.id) return;

    const transactionMacro = await getTransactionMacro(params.id);

    if (!transactionMacro) return;

    setTransactionMacro(transactionMacro);

    Object.keys(macroFormDefaultValues).forEach((key) => {
      const formKey = key as keyof typeof macroFormDefaultValues;
      const formValue =
        typeof transactionMacro[formKey] === "number"
          ? transactionMacro[formKey].toString()
          : (transactionMacro[formKey] ?? "");

      transactionMacroForm.setValue(formKey, formValue);
    });
  }, [params]);

  useEffect(() => {
    getMacroDetail();
  }, [getMacroDetail]);

  const handleCloseMacroSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenMacroUpdateSheet(false);
    setTransactionMacro(null);

    transactionMacroForm.reset();

    navigate({ to: ROUTE.MACRO });
  };

  const handleUpdateMacro = async (formdata: z.infer<typeof macroFormSchema>) => {
    if (!transactionMacro) return;

    await updateTransactionMacro(transactionMacro, formdata);

    getAllTransactionMacros();

    handleCloseMacroSheet();
  };

  return (
    <Sheet open={isOpenMacroUpdateSheet} onOpenChange={handleCloseMacroSheet}>
      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Transaction Macro</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <TransactionMacroForm
          isLoading={isLoading}
          currencies={currencies}
          transactionTypes={transactionTypes}
          categories={categories}
          submitText="Update Macro"
          transactionMacroForm={transactionMacroForm}
          onSubmitMacro={handleUpdateMacro}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(TRANSACTION_MACRO_UPDATE_FILE_ROUTE)({
  component: MacroUpdatePage,
});
