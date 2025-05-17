import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { TransactionMacroForm } from "@/components/macro/transaction-macro-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ROUTE, TRANSACTION_MACRO_UPDATE_FILE_ROUTE } from "@/constants/route";
import { transactionMacroFormDefaultValues, transactionMacroFormSchema } from "@/schema/macro.schema";
import { useTransactionMacroStore } from "@/stores/macro/transaction-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const TransactionMacroUpdatePage = () => {
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

  const transactionMacroForm = useForm<z.infer<typeof transactionMacroFormSchema>>({
    resolver: zodResolver(transactionMacroFormSchema),
    defaultValues: transactionMacroFormDefaultValues,
  });

  const getTransactionMacroDetail = useCallback(async () => {
    if (!params.id) return;

    const transactionMacro = await getTransactionMacro(params.id);

    if (!transactionMacro) return;

    setTransactionMacro(transactionMacro);

    Object.keys(transactionMacroFormDefaultValues).forEach((key) => {
      const formKey = key as keyof typeof transactionMacroFormDefaultValues;
      const formValue =
        typeof transactionMacro[formKey] === "number"
          ? transactionMacro[formKey].toString()
          : (transactionMacro[formKey] ?? "");

      transactionMacroForm.setValue(formKey, formValue);
    });
  }, [params]);

  useEffect(() => {
    getTransactionMacroDetail();
  }, [getTransactionMacroDetail]);

  const handleCloseTransactionMacroSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenMacroUpdateSheet(false);
    setTransactionMacro(null);

    transactionMacroForm.reset();

    navigate({ to: ROUTE.MACRO });
  };

  const handleUpdateTransactionMacro = async (formdata: z.infer<typeof transactionMacroFormSchema>) => {
    if (!transactionMacro) return;

    await updateTransactionMacro(transactionMacro, formdata);

    getAllTransactionMacros();

    handleCloseTransactionMacroSheet();
  };

  return (
    <Sheet open={isOpenMacroUpdateSheet} onOpenChange={handleCloseTransactionMacroSheet}>
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
          submitText="Update Transaction Macro"
          transactionMacroForm={transactionMacroForm}
          onSubmitMacro={handleUpdateTransactionMacro}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(TRANSACTION_MACRO_UPDATE_FILE_ROUTE)({
  component: TransactionMacroUpdatePage,
});
