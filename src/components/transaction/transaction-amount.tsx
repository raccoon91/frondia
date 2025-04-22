import type { CellContext } from "@tanstack/react-table";
import { type ChangeEvent, type FC, memo } from "react";

import { TRANSACTION_STATUS } from "@/constants/transaction";

export const TransactionAmount: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;
    const amount = row.original.amount;
    const currency = row.original.currency;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      table.options.meta?.changeInput(id, "amount", e.target.value);
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return (
        <input
          type="number"
          className="w-full h-8 p-2 leading-4 border border-input-foreground rounded-sm outline-none"
          defaultValue={amount || ""}
          onChange={handleChange}
        />
      );
    }

    if (!currency) return <p className="h-8 p-2 leading-4">{amount}</p>;

    return (
      <p className="h-8 p-2 leading-4">{`${currency?.symbol ? `${currency?.symbol} ` : ""}${amount.toLocaleString("en-US")}`}</p>
    );
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id &&
    prev.row.original.status === next.row.original.status &&
    prev.row.original.amount === next.row.original.amount &&
    prev.row.original.currency?.id === next.row.original.currency?.id,
);
