import { ChartPie, Coins, Flame, PanelsRightBottom, Settings, Wrench } from "lucide-react";

import { ROUTE } from "./route";

export const MENUS = [
  {
    to: ROUTE.DASHBOARD,
    name: "Dashboard",
    icon: PanelsRightBottom,
  },
  {
    to: ROUTE.TRANSACTION,
    name: "Transaction",
    icon: Coins,
  },
  {
    to: ROUTE.GOAL,
    name: "Goal",
    icon: Flame,
  },
  {
    to: ROUTE.MACRO,
    name: "Macro",
    icon: Wrench,
  },
  {
    to: ROUTE.REPORT,
    name: "Report",
    icon: ChartPie,
  },
  {
    to: ROUTE.SETTING,
    name: "Setting",
    icon: Settings,
  },
];
