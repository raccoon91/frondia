import { FC, memo } from "react";
import { CellContext } from "@tanstack/react-table";

import { TRANSACTION_STATUS } from "@/constants/transaction";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export const TransactionDate: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;
    const date = row.original.date ?? "";

    const handleChange = (date: Nullable<string>) => {
      table.options.meta?.changeInput(id, "date", date ?? "");
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return <DateTimePicker hideIcon defaultValue={date} onValueChange={handleChange} />;
    }

    return <p className="h-8 p-2 leading-4">{date}</p>;
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id &&
    prev.row.original.status === next.row.original.status &&
    prev.row.original.date === next.row.original.date,
);
