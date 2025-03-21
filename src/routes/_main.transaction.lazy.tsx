import { MouseEvent, useCallback, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import { CircleX, Coins, Save, Search, Trash, X } from "lucide-react";

import { TRANSACTION_FILE_ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { useTransactionStore } from "@/stores/transaction.store";
import { useTransactionOptionStore } from "@/stores/transaction-option.store";
import { Button, buttonVariants } from "@/components/ui/button";
import { TransactionTable } from "@/components/transaction/transaction-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TransactionPage = () => {
  const {
    selectedTransactionTypeId,
    selectedCategoryId,
    selectedCurrencyId,
    changeTransactionType,
    changeCategory,
    changeCurrency,
  } = useTransactionOptionStore(
    useShallow((state) => ({
      selectedTransactionTypeId: state.selectedTransactionTypeId,
      selectedCategoryId: state.selectedCategoryId,
      selectedCurrencyId: state.selectedCurrencyId,
      changeTransactionType: state.changeTransactionType,
      changeCategory: state.changeCategory,
      changeCurrency: state.changeCurrency,
    })),
  );
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
    transactionDatasets,
    getTransactions,
    addTransaction,
    saveAllTransaction,
    cancelAllTransaction,
    deleteTransaction,
  } = useTransactionStore(
    useShallow((state) => ({
      transactionDatasets: state.transactionDatasets,
      getTransactions: state.getTransactions,
      addTransaction: state.addTransaction,
      saveAllTransaction: state.saveAllTransaction,
      cancelAllTransaction: state.cancelAllTransaction,
      deleteTransaction: state.deleteTransaction,
    })),
  );
  const { editTransaction, cancelEditTransaction, checkTransaction, changeTransaction, saveTransaction } =
    useTransactionStore(
      useShallow((state) => ({
        editTransaction: state.editTransaction,
        cancelEditTransaction: state.cancelEditTransaction,
        checkTransaction: state.checkTransaction,
        changeTransaction: state.changeTransaction,
        saveTransaction: state.saveTransaction,
      })),
    );

  const getData = useCallback(async () => {
    await Promise.all([getCurrencies(), getTransactionTypes(), getCategories()]);
    await getTransactions();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const handleChangeTransactionType = (transactionTypeId: string) => {
    changeTransactionType(transactionTypeId);
  };

  const handleClearTransactionType = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    changeTransactionType("");
  };

  const handleChangeCategory = (cateogryId: string) => {
    changeCategory(cateogryId);
  };

  const handleClearCategory = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    changeCategory("");
  };

  const handleChangeCurrency = (currencyId: string) => {
    changeCurrency(currencyId);
  };

  const handleClearCurrency = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    changeCurrency("");
  };

  const handleReloadTransaction = () => {
    getTransactions();
  };

  return (
    <div className="grid grid-rows-[60px_auto] gap-6">
      <div className="flex items-center gap-6 px-6 border rounded-md bg-card text-card-foreground shadow-sm"></div>

      <div className="grid grid-rows-[32px_auto] gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-[160px]">
              <Select value={selectedTransactionTypeId} onValueChange={handleChangeTransactionType}>
                <div className="relative">
                  <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>

                  {selectedTransactionTypeId ? (
                    <div
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute top-1/2 right-1 transform -translate-y-1/2 w-6 h-6 bg-background z-1",
                      )}
                      onClick={handleClearTransactionType}
                    >
                      <X />
                    </div>
                  ) : null}
                </div>

                <SelectContent className="max-h-[240px]">
                  {transactionTypes?.map((type) => (
                    <SelectItem key={type.id} value={`${type.id}`}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[160px]">
              <Select value={selectedCategoryId} onValueChange={handleChangeCategory}>
                <div className="relative">
                  <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  {selectedCategoryId ? (
                    <div
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute top-1/2 right-1 transform -translate-y-1/2 w-6 h-6 bg-background z-1",
                      )}
                      onClick={handleClearCategory}
                    >
                      <X />
                    </div>
                  ) : null}
                </div>

                <SelectContent className="max-h-[240px]">
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={`${category.id}`}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[120px]">
              <Select value={selectedCurrencyId} onValueChange={handleChangeCurrency}>
                <div className="relative">
                  <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  {selectedCurrencyId ? (
                    <div
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute top-1/2 right-1 transform -translate-y-1/2 w-6 h-6 bg-background z-1",
                      )}
                      onClick={handleClearCurrency}
                    >
                      <X />
                    </div>
                  ) : null}
                </div>

                <SelectContent className="max-h-[240px]">
                  {currencies?.map((currency) => (
                    <SelectItem key={currency.id} value={`${currency.id}`}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button size="sm" variant="outline" className="rounded-sm" onClick={handleReloadTransaction}>
              <Search />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="w-8 h-8" onClick={addTransaction}>
              <Coins />
            </Button>

            <Button size="icon" variant="outline" className="w-8 h-8" onClick={saveAllTransaction}>
              <Save />
            </Button>

            <Button size="icon" variant="outline" className="w-8 h-8" onClick={cancelAllTransaction}>
              <CircleX />
            </Button>

            <Button size="icon" variant="outline" className="w-8 h-8" onClick={deleteTransaction}>
              <Trash />
            </Button>
          </div>
        </div>

        <TransactionTable
          data={transactionDatasets}
          onCheck={checkTransaction}
          onChange={changeTransaction}
          onEdit={editTransaction}
          onCancel={cancelEditTransaction}
          onSave={saveTransaction}
        />
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute(TRANSACTION_FILE_ROUTE)({
  component: TransactionPage,
});
