import { FC } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface MacroCardProps {
  macro: Macro;
  currency: Nullable<Currency>;
  type: Nullable<TransactionType>;
  category: Nullable<Category>;
  onToggleActive: (macroId: number, active: boolean) => Promise<void>;
}

export const MacroCard: FC<MacroCardProps> = ({ macro, currency, type, category, onToggleActive }) => {
  const handleMacroChecked = (checked: boolean) => {
    onToggleActive(macro.id, checked);
  };

  return (
    <Card className="min-w-xs bg-background">
      <CardHeader>
        <div className="flex items-center justify-start gap-2">
          <CardTitle>{macro.name}</CardTitle>
          <Switch size="sm" checked={macro.active} onCheckedChange={handleMacroChecked} />
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

        <p className="my-2 font-bold text-sm">{macro.memo}</p>

        <div className="flex justify-between">
          <div className="flex gap-1 text-sm">
            <p>{macro.amount?.toLocaleString("en-US")}</p>
            {currency ? <p>{currency.symbol}</p> : null}
          </div>

          <div className="flex items-center justify-end gap-2 text-muted-foreground text-xs">
            {macro.day || macro.hour || macro.minute ? (
              <>
                <p>{macro.day ? macro.day.toString().padStart(2, "0") : "--"}</p>

                <div className="flex gap-0.5">
                  <p>{macro.hour ? macro.hour.toString().padStart(2, "0") : "--"}</p>
                  <p>:</p>
                  <p>{macro.minute ? macro.minute.toString().padStart(2, "0") : "--"}</p>
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
