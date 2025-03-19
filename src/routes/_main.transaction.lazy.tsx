import { useCallback, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";

import { TRANSACTION_FILE_ROUTE } from "@/constants/route";
import { useTransactionStore } from "@/stores/transaction.store";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/transaction/transaction-table";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";

const TransactionPage = () => {
  const { getCurrencies, getTransactionTypes, getCategories } = useTransactionOptionStore(
    useShallow((state) => ({
      getCurrencies: state.getCurrencies,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
    })),
  );
  const {
    transactionDatasets,
    getTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    cancelEditTransaction,
    checkTransaction,
    changeTransaction,
    upsertTransaction,
  } = useTransactionStore(
    useShallow((state) => ({
      transactionDatasets: state.transactionDatasets,
      getTransactions: state.getTransactions,
      addTransaction: state.addTransaction,
      deleteTransaction: state.deleteTransaction,
      editTransaction: state.editTransaction,
      cancelEditTransaction: state.cancelEditTransaction,
      checkTransaction: state.checkTransaction,
      changeTransaction: state.changeTransaction,
      upsertTransaction: state.upsertTransaction,
    })),
  );

  const getData = useCallback(async () => {
    await Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    await getTransactions();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-4 mx-auto">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={addTransaction}>
          Add
        </Button>

        <Button size="sm" variant="outline" onClick={deleteTransaction}>
          Delete
        </Button>
      </div>

      <TransactionTable
        data={transactionDatasets}
        onCheck={checkTransaction}
        onChange={changeTransaction}
        onEdit={editTransaction}
        onCancel={cancelEditTransaction}
        onSave={upsertTransaction}
      />
    </div>
  );
};

export const Route = createLazyFileRoute(TRANSACTION_FILE_ROUTE)({
  component: TransactionPage,
});
