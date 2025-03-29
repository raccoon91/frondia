import { useEffect, useMemo, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { ToggleLeft, ToggleRight, Wrench } from "lucide-react";
import { z } from "zod";

import { MACRO_FILE_ROUTE } from "@/constants/route";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { macroFormSchema } from "@/schema/macro.schema";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { useMacroStore } from "@/stores/macro.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MacroCard } from "@/components/macro/macro-card";
import { MacroSheet } from "@/components/macro/macro-sheet";

const MacroPage = () => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedMacro, setSelectedMacro] = useState<Macro | null>(null);

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
  const {
    isLoading,
    activeStatus,
    allMacros,
    changeActiveStatus,
    getAllMacros,
    createMacro,
    toggleMacroActive,
    removeMacro,
  } = useMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      activeStatus: state.activeStatus,
      allMacros: state.allMacros,
      changeActiveStatus: state.changeActiveStatus,
      getAllMacros: state.getAllMacros,
      createMacro: state.createMacro,
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

  const handleCreateMacro = async (formdata: z.infer<typeof macroFormSchema>) => {
    await createMacro(formdata);

    getAllMacros();
  };

  const handleToggleMacroActive = async (macroId: number, active: boolean) => {
    await toggleMacroActive(macroId, active);

    getAllMacros();
  };

  const handleOpenDeleteModal = (macroId: number) => {
    const macro = allMacros.find((macro) => macro.id === macroId) ?? null;

    if (!macro) return;

    setIsOpenDeleteModal(true);
    setSelectedMacro(macro);
  };

  const handleCloseDeleteModal = (open?: boolean) => {
    if (open) return;

    setIsOpenDeleteModal(false);
    setSelectedMacro(null);
  };

  const handleDeleteMacro = async () => {
    if (selectedMacro) {
      await removeMacro(selectedMacro.id);
      await getAllMacros();
    }

    setIsOpenDeleteModal(false);
    setSelectedMacro(null);
  };

  return (
    <>
      <Dialog open={isOpenDeleteModal} onOpenChange={handleCloseDeleteModal}>
        <DialogContent className="w-sm">
          <DialogHeader>
            <DialogTitle>Delete Macro</DialogTitle>
          </DialogHeader>

          <p className="text-sm">
            Do you want to delete macro <span className="font-bold">{selectedMacro?.name}</span> ?
          </p>

          <DialogFooter>
            <Button size="sm" variant="destructive" onClick={handleDeleteMacro}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

            <MacroSheet
              isLoading={isLoading}
              currencies={currencies}
              transactionTypes={transactionTypes}
              categories={categories}
              onCreate={handleCreateMacro}
            >
              <Button disabled={isLoading} variant="outline" size="sm">
                <Wrench />
                <p>Macro</p>
              </Button>
            </MacroSheet>
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
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export const Route = createLazyFileRoute(MACRO_FILE_ROUTE)({
  component: MacroPage,
});
