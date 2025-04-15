import { FC, memo } from "react";
import { CellContext } from "@tanstack/react-table";

import { TRANSACTION_STATUS } from "@/constants/transaction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TransactionCategorySelect: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;
    const transactionType = row.original.transactionType;
    const categories = row.original.categories;
    const category = row.original.category;

    const handleChange = (value: string) => {
      table.options.meta?.changeInput(id, "category", value);
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return (
        <Select
          disabled={!transactionType}
          defaultValue={category ? `${category?.id}` : undefined}
          onValueChange={handleChange}
        >
          <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent className="max-h-[240px]">
            {categories?.map((category) => (
              <SelectItem key={category.id} value={`${category.id}`}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <p className="h-8 p-2 leading-4 truncate" title={category?.name ?? undefined}>
        {category?.name}
      </p>
    );
  },
  (prev, next) => {
    return (
      prev.row.original.id === next.row.original.id &&
      prev.row.original.status === next.row.original.status &&
      prev.row.original.category !== undefined &&
      next.row.original.category !== undefined &&
      prev.row.original.category?.id === next.row.original.category?.id &&
      prev.row.original.categories?.length === next.row.original.categories?.length
    );
  },
);
