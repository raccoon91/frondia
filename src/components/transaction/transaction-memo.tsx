import { ChangeEvent, FC, memo } from "react";
import { CellContext } from "@tanstack/react-table";

import { TRANSACTION_STATUS } from "@/constants/status";

export const TransactionMemo: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;
    const memo = row.original.memo;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      table.options.meta?.changeInput(id, "memo", e.target.value);
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return (
        <input
          className="w-full h-8 p-2 leading-4 border border-input-foreground rounded-sm outline-none"
          defaultValue={memo ?? ""}
          onChange={handleChange}
        />
      );
    }

    return <p className="h-8 p-2 leading-4">{memo}</p>;
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id &&
    prev.row.original.status === next.row.original.status &&
    prev.row.original.memo === next.row.original.memo,
);
