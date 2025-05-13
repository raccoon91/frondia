import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ToggleLeft, ToggleRight, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { MacroCard } from "@/components/macro/macro-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { MACRO_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useMacroStore } from "@/stores/macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { mapBy } from "@/utils/map-by";

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

  const currencyMap = useMemo(() => mapBy(currencies, "id"), [currencies]);
  const typeMap = useMemo(() => mapBy(transactionTypes, "id"), [transactionTypes]);
  const categoryMap = useMemo(() => mapBy(categories, "id"), [categories]);

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
            {allMacros?.length ? (
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
            ) : (
              <CardContent className="flex justify-center py-12">
                <p className="text-sm font-semibold">No Macro</p>
              </CardContent>
            )}
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
