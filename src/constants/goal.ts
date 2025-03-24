export const GOAL_DATE_UNIT_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export const GOAL_RULE = {
  FIXED_AMOUNT: "fixed_amount",
  SPENDING_LIMIT: "spending_limit",
  COUNT_AMOUNT: "count_amount",
  COUNT_LIMIT: "count_limit",
};

export const GOAL_RULES = [
  { value: GOAL_RULE.FIXED_AMOUNT, label: "Fixed Amount", bg: "bg-emerald-300" },
  { value: GOAL_RULE.SPENDING_LIMIT, label: "Spending Limit", bg: "bg-rose-300" },
  { value: GOAL_RULE.COUNT_AMOUNT, label: "Count Above", bg: "bg-indigo-300" },
  { value: GOAL_RULE.COUNT_LIMIT, label: "Count Limit", bg: "bg-amber-300" },
];

export const GOAL_STATUS = {
  READY: "ready",
  PROGRESS: "progress",
  DONE: "done",
};
