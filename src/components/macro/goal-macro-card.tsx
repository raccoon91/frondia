import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import { type FC, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardMenu, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ROUTE } from "@/constants/route";

interface GoalMacroCardProps {
  isLoading: boolean;
  goalMacro: GoalMacro;
  onToggleActive: (goalMacroId: number, active: boolean) => Promise<void>;
  onDelete: (goalMacro: GoalMacro) => void;
}

export const GoalMacroCard: FC<GoalMacroCardProps> = ({ isLoading, goalMacro, onToggleActive, onDelete }) => {
  const [openCategory, setOpenCategory] = useState(false);

  const handleMacroChecked = (checked: boolean) => {
    onToggleActive(goalMacro.id, checked);
  };

  const handleToggleCategory = () => {
    setOpenCategory((prev) => !prev);
  };

  const handleDeleteMarco = () => {
    onDelete(goalMacro);
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
            <Link to={ROUTE.GOAL_MACRO_UPDATE} params={{ id: goalMacro.id }} className="underline">
              {goalMacro.name}
            </Link>
          </CardTitle>
          <Switch disabled={isLoading} size="sm" checked={goalMacro.active} onCheckedChange={handleMacroChecked} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {goalMacro.type ? <Badge variant="secondary">{goalMacro.type?.name}</Badge> : null}

            {goalMacro.categories?.length ? (
              <Badge variant="outline" onClick={handleToggleCategory}>
                {goalMacro.categories.length} category {openCategory ? <ChevronUp /> : <ChevronDown />}
              </Badge>
            ) : (
              <Badge>No category</Badge>
            )}
          </div>

          {openCategory ? (
            <div className="flex flex-wrap gap-2">
              {goalMacro.categories?.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 text-sm">
            <p>{goalMacro.rule}</p>
            <p>{goalMacro.amount?.toLocaleString("en-US")}</p>
            {goalMacro.currency ? <p>{goalMacro.currency.symbol}</p> : null}
          </div>

          <p className="text-muted-foreground text-xs">{goalMacro.period}</p>
        </div>
      </CardContent>
    </Card>
  );
};
