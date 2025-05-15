import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ToggleLeft, ToggleRight, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { TransactionMacroCard } from "@/components/macro/transaction-macro-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TRANSACTION_MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { MACRO_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useTransactionMacroStore } from "@/stores/transaction-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { mapBy } from "@/utils/map-by";

const MacroPage = () => {
  const [selectedMacro, setSelectedMacro] = useState<TransactionMacro | null>(null);
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
  const {
    isLoading,
    status,
    allTransactionMacros,
    changeMacroStatus,
    getAllTransactionMacros,
    toggleTransactionMacroActive,
    removeTransactionMacro,
  } = useTransactionMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      status: state.status,
      allTransactionMacros: state.allTransactionMacros,
      changeMacroStatus: state.changeMacroStatus,
      getAllTransactionMacros: state.getAllTransactionMacros,
      toggleTransactionMacroActive: state.toggleTransactionMacroActive,
      removeTransactionMacro: state.removeTransactionMacro,
    })),
  );

  const currencyMap = useMemo(() => mapBy(currencies, "id"), [currencies]);
  const typeMap = useMemo(() => mapBy(transactionTypes, "id"), [transactionTypes]);
  const categoryMap = useMemo(() => mapBy(categories, "id"), [categories]);

  useEffect(() => {
    Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    getAllTransactionMacros();
  }, []);

  const handleChangeActiveStatus = (value: string) => {
    changeMacroStatus(value);
    getAllTransactionMacros();
  };

  const handleToggleMacroActive = async (macroId: number, active: boolean) => {
    await toggleTransactionMacroActive(macroId, active);

    getAllTransactionMacros();
  };

  const handleOpenDeleteMacroDialog = (macro: TransactionMacro) => {
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
      await removeTransactionMacro(selectedMacro.id);
      await getAllTransactionMacros();
    }

    handleCloseDeleteMacroDialog();
  };

  return (
    <>
      <DeleteDialog
        isOpen={isOpenDeleteMacroDialog}
        title="Delete Transaction Macro"
        onClose={handleCloseDeleteMacroDialog}
        onConfirm={handleDeleteMacro}
      >
        <p className="text-sm">
          Do you want to delete transaction macro <span className="font-bold">{selectedMacro?.name}</span> ?
        </p>
      </DeleteDialog>

      <div className="grid grid-rows-[60px_auto] gap-6">
        <div className="flex items-center gap-2 px-6 border rounded-md bg-card text-card-foreground shadow-sm">
          <p className="font-bold">Macro</p>
        </div>

        <div className="grid grid-rows-[32px_auto] gap-4">
          <div className="flex justify-between gap-2">
            <Tabs defaultValue={status} onValueChange={handleChangeActiveStatus}>
              <TabsList>
                <TabsTrigger value={TRANSACTION_MACRO_ACTIVE_STATUS.ALL}>
                  <p className="font-bold">All</p>
                </TabsTrigger>
                <TabsTrigger value={TRANSACTION_MACRO_ACTIVE_STATUS.ACTIVE}>
                  <ToggleRight />
                </TabsTrigger>
                <TabsTrigger value={TRANSACTION_MACRO_ACTIVE_STATUS.INACTIVE}>
                  <ToggleLeft />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button disabled={isLoading} variant="outline" size="sm" asChild>
              <Link to={ROUTE.TRANSACTION_MACRO_CREATE}>
                <Wrench />
                <p>Transaction</p>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              {allTransactionMacros?.length ? (
                <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {allTransactionMacros.map((transactionMacro) => (
                    <TransactionMacroCard
                      key={transactionMacro.id}
                      isLoading={isLoading}
                      transactionMacro={transactionMacro}
                      currency={transactionMacro.currency_id ? currencyMap[transactionMacro.currency_id] : null}
                      type={transactionMacro.type_id ? typeMap[transactionMacro.type_id] : null}
                      category={transactionMacro.category_id ? categoryMap[transactionMacro.category_id] : null}
                      onToggleActive={handleToggleMacroActive}
                      onDelete={handleOpenDeleteMacroDialog}
                    />
                  ))}
                </CardContent>
              ) : (
                <CardContent className="flex justify-center py-12">
                  <p className="text-sm font-semibold">No Transaction Macro</p>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardContent className="flex justify-center py-12">
                <p className="text-sm font-semibold">No Goal Macro</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export const Route = createLazyFileRoute(MACRO_FILE_ROUTE)({
  component: MacroPage,
});
