import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/shallow";

import { MacroForm } from "@/components/macro/macro-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MACRO_UPDATE_FILE_ROUTE, ROUTE } from "@/constants/route";
import { macroFormDefaultValues, macroFormSchema } from "@/schema/macro.schema";
import { useMacroStore } from "@/stores/macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const MacroUpdatePage = () => {
  const navigate = useNavigate();
  const params = useParams({ from: MACRO_UPDATE_FILE_ROUTE });
  const [isOpenMacroUpdateSheet, setIsOpenMacroUpdateSheet] = useState(true);
  const [macro, setMacro] = useState<Macro | null>(null);

  const { currencies, transactionTypes, categories } = useTransactionOptionStore(
    useShallow((state) => ({
      currencies: state.currencies,
      transactionTypes: state.transactionTypes,
      categories: state.categories,
    })),
  );
  const { isLoading, getAllMacros, getMacro, updateMacro } = useMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      getAllMacros: state.getAllMacros,
      getMacro: state.getMacro,
      updateMacro: state.updateMacro,
    })),
  );

  const macroForm = useForm<z.infer<typeof macroFormSchema>>({
    resolver: zodResolver(macroFormSchema),
    defaultValues: macroFormDefaultValues,
  });

  const getMacroDetail = useCallback(async () => {
    if (!params.id) return;

    const macro = await getMacro(params.id);

    if (!macro) return;

    setMacro(macro);

    Object.keys(macroFormDefaultValues).forEach((key) => {
      const formKey = key as keyof typeof macroFormDefaultValues;
      const formValue = typeof macro[formKey] === "number" ? macro[formKey].toString() : (macro[formKey] ?? "");

      macroForm.setValue(formKey, formValue);
    });
  }, [params]);

  useEffect(() => {
    getMacroDetail();
  }, [getMacroDetail]);

  const handleCloseMacroSheet = (open?: boolean) => {
    if (open) return;

    setIsOpenMacroUpdateSheet(false);
    setMacro(null);

    macroForm.reset();

    navigate({ to: ROUTE.MACRO });
  };

  const handleUpdateMacro = async (formdata: z.infer<typeof macroFormSchema>) => {
    if (!macro) return;

    await updateMacro(macro, formdata);

    getAllMacros();

    handleCloseMacroSheet();
  };

  return (
    <Sheet open={isOpenMacroUpdateSheet} onOpenChange={handleCloseMacroSheet}>
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
          submitText="Update Macro"
          macroForm={macroForm}
          onSubmitMacro={handleUpdateMacro}
        />
      </SheetContent>
    </Sheet>
  );
};

export const Route = createFileRoute(MACRO_UPDATE_FILE_ROUTE)({
  component: MacroUpdatePage,
});
