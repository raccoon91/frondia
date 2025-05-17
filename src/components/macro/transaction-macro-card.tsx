import { Link } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import type { FC } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMenu, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ROUTE } from "@/constants/route";

interface TransactionMacroCardProps {
  isLoading: boolean;
  transactionMacro: TransactionMacro;
  onToggleActive: (transactionMacroId: number, active: boolean) => Promise<void>;
  onDelete: (transactionMacro: TransactionMacro) => void;
}

export const TransactionMacroCard: FC<TransactionMacroCardProps> = ({
  isLoading,
  transactionMacro,
  onToggleActive,
  onDelete,
}) => {
  const handleMacroChecked = (checked: boolean) => {
    onToggleActive(transactionMacro.id, checked);
  };

  const handleDeleteMarco = () => {
    onDelete(transactionMacro);
  };

  return (
    <Card className="bg-background gap-4">
      <CardMenu className="top-2 right-2">
        <Button disabled={isLoading} size="icon" variant="ghost" className="w-8 h-8" onClick={handleDeleteMarco}>
          <Trash />
        </Button>
      </CardMenu>

      <CardHeader>
        <div className="flex items-center justify-start gap-2">
          <CardTitle>
            <Link to={ROUTE.TRANSACTION_MACRO_UPDATE} params={{ id: transactionMacro.id }} className="underline">
              {transactionMacro.name}
            </Link>
          </CardTitle>
          <Switch
            disabled={isLoading}
            size="sm"
            checked={transactionMacro.active}
            onCheckedChange={handleMacroChecked}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex gap-2">
          {transactionMacro.type ? <Badge variant="secondary">{transactionMacro.type?.name}</Badge> : null}

          {transactionMacro.category ? <Badge variant="outline">{transactionMacro.category?.name}</Badge> : null}
        </div>

        <p className="font-bold text-sm">{transactionMacro.memo}</p>

        <div className="flex justify-between">
          <div className="flex gap-1 text-sm">
            <p>{transactionMacro.amount?.toLocaleString("en-US")}</p>
            {transactionMacro.currency ? <p>{transactionMacro.currency.symbol}</p> : null}
          </div>

          <div className="flex items-center justify-end gap-2 text-muted-foreground text-xs">
            {transactionMacro.day || transactionMacro.hour || transactionMacro.minute ? (
              <>
                <p>{transactionMacro.day ? transactionMacro.day.toString().padStart(2, "0") : "--"}</p>

                <div className="flex gap-0.5">
                  <p>{transactionMacro.hour ? transactionMacro.hour.toString().padStart(2, "0") : "--"}</p>
                  <p>:</p>
                  <p>{transactionMacro.minute ? transactionMacro.minute.toString().padStart(2, "0") : "--"}</p>
                </div>
              </>
            ) : (
              <p>Now</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
