import { useEffect, useMemo, useState } from "react";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { ToggleLeft, ToggleRight, Wrench } from "lucide-react";

import { MACRO_FILE_ROUTE, ROUTE } from "@/constants/route";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { useMacroStore } from "@/stores/macro.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { MacroCard } from "@/components/macro/macro-card";

const MacroPage = () => {
  const [selectedMacro, setSelectedMacro] = useState<Macro | null>(null);
  const [isOpenDeleteMacroDialog, setIsOpenDeleteMacroDialog] = useState(false);

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
  const { isLoading, activeStatus, allMacros, changeActiveStatus, getAllMacros, toggleMacroActive, removeMacro } =
    useMacroStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        activeStatus: state.activeStatus,
        allMacros: state.allMacros,
        changeActiveStatus: state.changeActiveStatus,
        getAllMacros: state.getAllMacros,
        toggleMacroActive: state.toggleMacroActive,
        removeMacro: state.removeMacro,
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

  const handleChangeActiveStatus = (value: string) => {
    changeActiveStatus(value);
    getAllMacros();
  };

  const handleToggleMacroActive = async (macroId: number, active: boolean) => {
    await toggleMacroActive(macroId, active);

    getAllMacros();
  };

  const handleOpenDeleteMacroDialog = (macro: Macro) => {
    if (!macro) return;

    setIsOpenDeleteMacroDialog(true);
    setSelectedMacro(macro);
  };

  const handleCloseDeleteMacroDialog = (open?: boolean) => {
    if (open) return;

    setIsOpenDeleteMacroDialog(false);
    setSelectedMacro(null);
  };

  const handleDeleteMacro = async () => {
    if (selectedMacro) {
      await removeMacro(selectedMacro.id);
      await getAllMacros();
    }

    handleCloseDeleteMacroDialog();
  };

  return (
    <>
      <DeleteDialog
        isOpen={isOpenDeleteMacroDialog}
        title="Delete Macro"
        onClose={handleCloseDeleteMacroDialog}
        onConfirm={handleDeleteMacro}
      >
        <p className="text-sm">
          Do you want to delete macro <span className="font-bold">{selectedMacro?.name}</span> ?
        </p>
      </DeleteDialog>

      <div className="grid grid-rows-[60px_auto] gap-6">
        <div className="flex items-center gap-2 px-6 border rounded-md bg-card text-card-foreground shadow-sm">
          <p className="font-bold">Macro</p>
        </div>

        <div className="grid grid-rows-[32px_auto] gap-4">
          <div className="flex justify-between gap-2">
            <Tabs defaultValue={activeStatus} onValueChange={handleChangeActiveStatus}>
              <TabsList>
                <TabsTrigger value={MACRO_ACTIVE_STATUS.ALL}>
                  <p className="font-bold">All</p>
                </TabsTrigger>
                <TabsTrigger value={MACRO_ACTIVE_STATUS.ACTIVE}>
                  <ToggleRight />
                </TabsTrigger>
                <TabsTrigger value={MACRO_ACTIVE_STATUS.INACTIVE}>
                  <ToggleLeft />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button disabled={isLoading} variant="outline" size="sm" asChild>
              <Link to={ROUTE.MACRO_CREATE}>
                <Wrench />
                <p>Macro</p>
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allMacros.map((macro) => (
                <MacroCard
                  key={macro.id}
                  isLoading={isLoading}
                  macro={macro}
                  currency={macro.currency_id ? currencyMap[macro.currency_id] : null}
                  type={macro.type_id ? typeMap[macro.type_id] : null}
                  category={macro.category_id ? categoryMap[macro.category_id] : null}
                  onToggleActive={handleToggleMacroActive}
                  onDelete={handleOpenDeleteMacroDialog}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export const Route = createLazyFileRoute(MACRO_FILE_ROUTE)({
  component: MacroPage,
});
