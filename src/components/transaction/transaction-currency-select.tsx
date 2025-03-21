import { FC, memo } from "react";
import { CellContext } from "@tanstack/react-table";

import { TRANSACTION_STATUS } from "@/constants/status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TransactionCurrencySelect: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;
    const currencies = row.original.currencies;
    const currency = row.original.currency;

    const handleChange = (value: string) => {
      table.options.meta?.changeInput(id, "currency", value);
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return (
        <Select defaultValue={currency ? `${currency?.id}` : undefined} onValueChange={handleChange}>
          <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>

          <SelectContent className="max-h-[240px]">
            {currencies?.map((currency) => (
              <SelectItem key={currency.id} value={`${currency.id}`}>
                {currency.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return <p className="h-8 p-2 leading-4">{currency?.code}</p>;
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id &&
    prev.row.original.status === next.row.original.status &&
    prev.row.original.currency?.id === next.row.original.currency?.id &&
    prev.row.original.currencies?.length === next.row.original.currencies?.length,
);
