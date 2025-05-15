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
  currency: Nullable<Currency>;
  type: Nullable<TransactionType>;
  category: Nullable<Category>;
  onToggleActive: (transactionMacroId: number, active: boolean) => Promise<void>;
  onDelete: (transactionMacro: TransactionMacro) => void;
}

export const TransactionMacroCard: FC<TransactionMacroCardProps> = ({
  isLoading,
  transactionMacro,
  currency,
  type,
  category,
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
    <Card className="bg-background">
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

      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-4">
          <p className="min-w-[72px] text-sm">type</p>
          {type ? <Badge variant="secondary">{type.name}</Badge> : <Badge variant="outline">None</Badge>}
        </div>

        <div className="flex gap-4">
          <p className="min-w-[72px] text-sm">category</p>
          {category ? <Badge variant="secondary">{category.name}</Badge> : <Badge variant="outline">None</Badge>}
        </div>

        <p className="my-2 font-bold text-sm">{transactionMacro.memo}</p>

        <div className="flex justify-between">
          <div className="flex gap-1 text-sm">
            <p>{transactionMacro.amount?.toLocaleString("en-US")}</p>
            {currency ? <p>{currency.symbol}</p> : null}
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
