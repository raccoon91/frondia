import { FC, memo } from "react";
import { CellContext } from "@tanstack/react-table";
import { Edit, Save, X } from "lucide-react";

import { TRANSACTION_STATUS } from "@/constants/status";
import { Button } from "@/components/ui/button";

export const TransactionActions: FC<CellContext<TransactionData, unknown>> = memo(
  ({ row, table }) => {
    const id = row.original.id;
    const status = row.original.status;

    const handleClickEdit = () => {
      table.options.meta?.clickEdit(id);
    };

    const handleClickCancel = () => {
      table.options.meta?.clickCancel(id);
    };

    const handleClickSave = () => {
      table.options.meta?.clickSave(id);
    };

    if (status === TRANSACTION_STATUS.NEW || status === TRANSACTION_STATUS.EDIT) {
      return (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleClickSave}>
            <Save />
          </Button>

          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleClickCancel}>
            <X />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-end">
        <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleClickEdit}>
          <Edit />
        </Button>
      </div>
    );
  },
  (prev, next) =>
    prev.row.original.id === next.row.original.id && prev.row.original.status === next.row.original.status,
);
