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
    changeTransaction,
    createTransaction,
  } = useTransactionStore(
    useShallow((state) => ({
      transactionDatasets: state.transactionDatasets,
      getCurrencies: state.getCurrencies,
      getTransactionTypes: state.getTransactionTypes,
      getCategories: state.getCategories,
      getTransactions: state.getTransactions,
      addTransaction: state.addTransaction,
      changeTransaction: state.changeTransaction,
      createTransaction: state.createTransaction,
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
      <div className="flex justify-end">
        <Button onClick={addTransaction}>Add</Button>
      </div>

      <TransactionTable data={transactionDatasets} onChange={changeTransaction} onCreate={createTransaction} />
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/transaction")({
  component: TransactionPage,
});
