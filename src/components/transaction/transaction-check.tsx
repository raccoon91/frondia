import type { CellContext } from "@tanstack/react-table";
import { type FC, memo } from "react";

import { Checkbox } from "@/components/ui/checkbox";

export const TransactionCheck: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const checked = row.original.checked ?? false;

    const handleCheck = (checked: boolean) => {
      table.options.meta?.check(id, checked);
    };

    return (
      <div className="flex items-center justify-center">
        <Checkbox checked={checked} onCheckedChange={handleCheck} />
      </div>
    );
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id && prev.row.original.checked === next.row.original.checked,
);
