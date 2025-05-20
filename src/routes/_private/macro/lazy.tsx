import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { Coins, Flame, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

import { GoalMacroCard } from "@/components/macro/goal-macro-card";
import { TransactionMacroCard } from "@/components/macro/transaction-macro-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MACRO_ACTIVE_STATUS } from "@/constants/macro";
import { MACRO_FILE_ROUTE, ROUTE } from "@/constants/route";
import { useGoalMacroStore } from "@/stores/macro/goal-macro.store";
import { useMacroOptionStore } from "@/stores/macro/macro-option.store";
import { useTransactionMacroStore } from "@/stores/macro/transaction-macro.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { mapBy } from "@/utils/map-by";

const MacroPage = () => {
  const [selectedTransactionMacro, setSelectedTransactionMacro] = useState<TransactionMacro | null>(null);
  const [selectedGoalMacro, setSelectedGoalMacro] = useState<GoalMacro | null>(null);
  const [isOpenDeleteTransactionMacroDialog, setIsOpenDeleteTransactionMacroDialog] = useState(false);
  const [isOpenDeleteGoalMacroDialog, setIsOpenDeleteGoalMacroDialog] = useState(false);

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
  const { status, changeMacroStatus } = useMacroOptionStore(
    useShallow((state) => ({
      status: state.status,
      changeMacroStatus: state.changeMacroStatus,
    })),
  );
  const {
    isLoading: isTransactionLoading,
    allTransactionMacros,
    getAllTransactionMacros,
    toggleTransactionMacroActive,
    removeTransactionMacro,
  } = useTransactionMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      allTransactionMacros: state.allTransactionMacros,
      getAllTransactionMacros: state.getAllTransactionMacros,
      toggleTransactionMacroActive: state.toggleTransactionMacroActive,
      removeTransactionMacro: state.removeTransactionMacro,
    })),
  );
  const {
    isLoading: isGoalLoading,
    allGoalMacros,
    getAllGoalMacros,
    toggleGoalMacroActive,
    removeGoalMacro,
  } = useGoalMacroStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      allGoalMacros: state.allGoalMacros,
      getAllGoalMacros: state.getAllGoalMacros,
      toggleGoalMacroActive: state.toggleGoalMacroActive,
      removeGoalMacro: state.removeGoalMacro,
    })),
  );

  const currencyMap = useMemo(() => mapBy(currencies, "id"), [currencies]);
  const typeMap = useMemo(() => mapBy(transactionTypes, "id"), [transactionTypes]);
  const categoryMap = useMemo(() => mapBy(categories, "id"), [categories]);

  const transactionMacrosWithJoin = useMemo(() => {
    return allTransactionMacros.map((transactionMacro) => ({
      ...transactionMacro,
      currency: transactionMacro.currency_id ? currencyMap[transactionMacro.currency_id] : null,
      type: transactionMacro.type_id ? typeMap[transactionMacro.type_id] : null,
      category: transactionMacro.category_id ? categoryMap[transactionMacro.category_id] : null,
    }));
  }, [allTransactionMacros, currencyMap, typeMap, categoryMap]);

  const goalMacrosWithJoin = useMemo(() => {
    return allGoalMacros.map((goalMacro) => ({
      ...goalMacro,
      currency: goalMacro.currency_id ? currencyMap[goalMacro.currency_id] : null,
      type: goalMacro.type_id ? typeMap[goalMacro.type_id] : null,
      categories: Array.isArray(goalMacro.category_ids)
        ? goalMacro.category_ids?.map((categoryId) => categoryMap[categoryId as string])
        : null,
    }));
  }, [allGoalMacros, currencyMap, typeMap, categoryMap]);

  useEffect(() => {
    Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    getAllTransactionMacros();
    getAllGoalMacros();
  }, []);

  const handleChangeActiveStatus = (value: string) => {
    changeMacroStatus(value);
    getAllTransactionMacros();
    getAllGoalMacros();
  };

  const handleToggleTransactionMacroActive = async (transactionMacroId: number, active: boolean) => {
    await toggleTransactionMacroActive(transactionMacroId, active);

    getAllTransactionMacros();
  };

  const handleToggleGoalMacroActive = async (goalMacroId: number, active: boolean) => {
    await toggleGoalMacroActive(goalMacroId, active);

    getAllGoalMacros();
  };

  const handleOpenDeleteTransactionMacroDialog = (transactionMacro: TransactionMacro) => {
    if (!transactionMacro) return;

    setIsOpenDeleteTransactionMacroDialog(true);
    setSelectedTransactionMacro(transactionMacro);
  };

  const handleCloseDeleteTransactionMacroDialog = (open?: boolean) => {
    if (open) return;

    setIsOpenDeleteTransactionMacroDialog(false);
    setSelectedTransactionMacro(null);
  };

  const handleDeleteTransactionMacro = async () => {
    if (selectedTransactionMacro) {
      await removeTransactionMacro(selectedTransactionMacro.id);
      await getAllTransactionMacros();
    }

    handleCloseDeleteTransactionMacroDialog();
  };

  const handleOpenDeleteGoalMacroDialog = (goalMacro: GoalMacro) => {
    if (!goalMacro) return;

    setIsOpenDeleteGoalMacroDialog(true);
    setSelectedGoalMacro(goalMacro);
  };

  const handleCloseDeleteGoalMacroDialog = (open?: boolean) => {
    if (open) return;

    setIsOpenDeleteGoalMacroDialog(false);
    setSelectedGoalMacro(null);
  };

  const handleDeleteGoalMacro = async () => {
    if (selectedGoalMacro) {
      await removeGoalMacro(selectedGoalMacro.id);
      await getAllGoalMacros();
    }

    handleCloseDeleteGoalMacroDialog();
  };

  return (
    <>
      <DeleteDialog
        isOpen={isOpenDeleteTransactionMacroDialog}
        title="Delete Transaction Macro"
        onClose={handleCloseDeleteTransactionMacroDialog}
        onConfirm={handleDeleteTransactionMacro}
      >
        <p className="text-sm">
          Do you want to delete transaction macro <span className="font-bold">{selectedTransactionMacro?.name}</span> ?
        </p>
      </DeleteDialog>

      <DeleteDialog
        isOpen={isOpenDeleteGoalMacroDialog}
        title="Delete Goal Macro"
        onClose={handleCloseDeleteGoalMacroDialog}
        onConfirm={handleDeleteGoalMacro}
      >
        <p className="text-sm">
          Do you want to delete goal macro <span className="font-bold">{selectedGoalMacro?.name}</span> ?
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

            <div className="flex gap-2">
              <Button disabled={isTransactionLoading} variant="outline" size="sm" asChild>
                <Link to={ROUTE.TRANSACTION_MACRO_CREATE}>
                  <Coins />
                  <p>Transaction</p>
                </Link>
              </Button>

              <Button disabled={isGoalLoading} variant="outline" size="sm" asChild>
                <Link to={ROUTE.GOAL_MACRO_CREATE}>
                  <Flame />
                  <p>Goal</p>
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="gap-4 py-4">
              <CardHeader>
                <CardTitle>Transaction Macro</CardTitle>
              </CardHeader>

              {transactionMacrosWithJoin?.length ? (
                <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4">
                  {transactionMacrosWithJoin.map((transactionMacro) => (
                    <TransactionMacroCard
                      key={transactionMacro.id}
                      isLoading={isTransactionLoading}
                      transactionMacro={transactionMacro}
                      onToggleActive={handleToggleTransactionMacroActive}
                      onDelete={handleOpenDeleteTransactionMacroDialog}
                    />
                  ))}
                </CardContent>
              ) : (
                <CardContent className="flex justify-center py-12 px-4">
                  <p className="text-sm font-semibold">No Transaction Macro</p>
                </CardContent>
              )}
            </Card>

            <Card className="gap-4 py-4">
              <CardHeader>
                <CardTitle>Goal Macro</CardTitle>
              </CardHeader>

              {goalMacrosWithJoin?.length ? (
                <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4">
                  {goalMacrosWithJoin.map((goalMacro) => (
                    <GoalMacroCard
                      key={goalMacro.id}
                      isLoading={isGoalLoading}
                      goalMacro={goalMacro}
                      onToggleActive={handleToggleGoalMacroActive}
                      onDelete={handleOpenDeleteGoalMacroDialog}
                    />
                  ))}
                </CardContent>
              ) : (
                <CardContent className="flex justify-center py-12 px-4">
                  <p className="text-sm font-semibold">No Goal Macro</p>
                </CardContent>
              )}
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
