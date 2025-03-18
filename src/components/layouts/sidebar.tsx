import { Link } from "@tanstack/react-router";
import { ChartPie, Coins, Flame, Home } from "lucide-react";

import { ROUTE } from "@/constants/route";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Sidebar = () => {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center w-full gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={ROUTE.HOME}
              className="text-muted-foreground transition-transform hover:scale-125"
              activeProps={{ className: "text-primary scale-125" }}
            >
              <Home />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <p className="font-bold">Home</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={ROUTE.TRANSACTION}
              className="text-muted-foreground transition-transform hover:scale-125"
              activeProps={{ className: "text-primary scale-125" }}
            >
              <Coins />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <p className="font-bold">Transaction</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={ROUTE.GOAL}
              className="text-muted-foreground transition-transform hover:scale-125"
              activeProps={{ className: "text-primary scale-125" }}
            >
              <Flame />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <p className="font-bold">Goal</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={ROUTE.REPORT}
              className="text-muted-foreground transition-transform hover:scale-125"
              activeProps={{ className: "text-primary scale-125" }}
            >
              <ChartPie />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12}>
            <p className="font-bold">Report</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
