import { createLazyFileRoute } from "@tanstack/react-router";

import { TransactionTable } from "@/components/transaction/transaction-table";

const TransactionPage = () => {
  return (
    <div className="w-full h-full p-4">
      <TransactionTable />
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/transaction")({
  component: TransactionPage,
});
