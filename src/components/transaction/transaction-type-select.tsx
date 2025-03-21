import { FC, memo } from "react";
import { CellContext } from "@tanstack/react-table";

import { TRANSACTION_STATUS } from "@/constants/status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TransactionTypeSelect: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;
    const transactionTypes = row.original.transactionTypes;
    const transactionType = row.original.transactionType;

    const handleChange = (value: string) => {
      table.options.meta?.changeInput(id, "transactionType", value);
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return (
        <Select defaultValue={transactionType ? `${transactionType?.id}` : undefined} onValueChange={handleChange}>
          <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>

          <SelectContent className="max-h-[240px]">
            {transactionTypes?.map((transactionType) => (
              <SelectItem key={transactionType.id} value={`${transactionType.id}`}>
                {transactionType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return <p className="h-8 p-2 leading-4 truncate">{transactionType?.name}</p>;
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id &&
    prev.row.original.status === next.row.original.status &&
    prev.row.original.transactionType?.id === next.row.original.transactionType?.id &&
    prev.row.original.transactionTypes?.length === next.row.original.transactionTypes?.length,
);
