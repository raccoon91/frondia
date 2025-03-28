import { Link } from "@tanstack/react-router";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MENUS } from "@/constants/menu";

export const Sidebar = () => {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center w-full gap-6">
        {MENUS.map((menu) => (
          <Tooltip key={menu.name}>
            <TooltipTrigger asChild>
              <Link
                to={menu.to}
                className="text-muted-foreground transition-transform hover:scale-125"
                activeProps={{ className: "text-primary scale-125" }}
              >
                <menu.icon />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              <p className="font-bold">{menu.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
