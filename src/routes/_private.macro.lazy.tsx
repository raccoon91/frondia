import { useEffect, useMemo } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { Wrench } from "lucide-react";
import { z } from "zod";

import { MACRO_FILE_ROUTE } from "@/constants/route";
import { macroFormSchema } from "@/schema/macro.schema";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { useMacroStore } from "@/stores/macro.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MacroCard } from "@/components/macro/macro-card";
import { MacroSheet } from "@/components/macro/macro-sheet";

const MacroPage = () => {
  const { currencies, transactionTypes, categories, getCurrencies, getTransactionTypes, getCategories } =
    useTransactionOptionStore(
      useShallow((state) => ({
        currencies: state.currencies,
        transactionTypes: state.transactionTypes,
        categories: state.categories,
        getCurrencies: state.getCurrencies,
        getTransactionTypes: state.getTransactionTypes,
        getCategories: state.getCategories,
      })),
    );
  const { isLoading, allMacros, getAllMacros, createMacro, toggleMacroActive } = useMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      allMacros: state.allMacros,
      getAllMacros: state.getAllMacros,
      createMacro: state.createMacro,
      toggleMacroActive: state.toggleMacroActive,
    })),
  );

  const currencyMap = useMemo(
    () =>
      currencies?.reduce<Record<string, Currency>>((currencyMap, currency) => {
        currencyMap[currency.id] = currency;
        return currencyMap;
      }, {}) ?? {},
    [currencies],
  );
  const typeMap = useMemo(
    () =>
      transactionTypes?.reduce<Record<string, TransactionType>>((typeMap, type) => {
        typeMap[type.id] = type;
        return typeMap;
      }, {}) ?? {},
    [transactionTypes],
  );
  const categoryMap = useMemo(
    () =>
      categories?.reduce<Record<string, Category>>((categoryMap, category) => {
        categoryMap[category.id] = category;
        return categoryMap;
      }, {}) ?? {},
    [categories],
  );

  useEffect(() => {
    Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    getAllMacros();
  }, []);

  const handleCreateMacro = async (formdata: z.infer<typeof macroFormSchema>) => {
    await createMacro(formdata);

    getAllMacros();
  };

  const handleToggleMacroActive = async (macroId: number, active: boolean) => {
    await toggleMacroActive(macroId, active);

    getAllMacros();
  };

  return (
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center gap-2 px-6 border rounded-md bg-card text-card-foreground shadow-sm">
        <p className="font-bold">Macro</p>
      </div>

      <div className="grid grid-rows-[32px_auto] gap-4">
        <div className="flex justify-end gap-2">
          <MacroSheet
            isLoading={isLoading}
            currencies={currencies}
            transactionTypes={transactionTypes}
            categories={categories}
            onCreate={handleCreateMacro}
          >
            <Button variant="outline" size="sm">
              <Wrench />
              <p>Macro</p>
            </Button>
          </MacroSheet>
        </div>

        <Card>
          <CardContent className="flex flex-wrap gap-2">
            {allMacros.map((macro) => (
              <MacroCard
                key={macro.id}
                macro={macro}
                currency={macro.currency_id ? currencyMap[macro.currency_id] : null}
                type={macro.type_id ? typeMap[macro.type_id] : null}
                category={macro.category_id ? categoryMap[macro.category_id] : null}
                onToggleActive={handleToggleMacroActive}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(MACRO_FILE_ROUTE)({
  component: MacroPage,
});
