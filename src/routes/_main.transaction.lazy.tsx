import { createLazyFileRoute } from "@tanstack/react-router";

const TransactionPage = () => {
  return (
    <div>
      <p>Transaction Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/transaction")({
  component: TransactionPage,
});
