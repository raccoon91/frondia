import { useCallback, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";

import { TransactionTable } from "@/components/transaction/transaction-table";
import { useTransactionStore } from "@/stores/transaction.store";
import { Button } from "@/components/ui/button";

const TransactionPage = () => {
  const {
    transactionDatasets,
    getCurrencies,
    getTransactionTypes,
    getCategories,
    getTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    checkTransaction,
    changeTransaction,
    upsertTransaction,
  } = useTransactionStore(
    useShallow((state) => ({
      transactionDatasets: state.transactionDatasets,
      getCurrencies: state.getCurrencies,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
      getTransactions: state.getTransactions,
      addTransaction: state.addTransaction,
      deleteTransaction: state.deleteTransaction,
      editTransaction: state.editTransaction,
      checkTransaction: state.checkTransaction,
      changeTransaction: state.changeTransaction,
      upsertTransaction: state.upsertTransaction,
    })),
  );

  const getData = useCallback(async () => {
    await getCurrencies();
    await getTransactionTypes();
    await getCategories();
    await getTransactions();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex justify-end gap-2">
        <Button onClick={addTransaction}>Add</Button>

        <Button variant="destructive" onClick={deleteTransaction}>
          Delete
        </Button>
      </div>

      <TransactionTable
        data={transactionDatasets}
        onCheck={checkTransaction}
        onChange={changeTransaction}
        onEdit={editTransaction}
        onSave={upsertTransaction}
      />
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/transaction")({
  component: TransactionPage,
});
