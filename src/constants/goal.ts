export const GOAL_DATE_UNIT_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export const GOAL_RULES = [
  { value: "fixed_amount", label: "Fixed Amount", color: "bg-emerald-300" },
  { value: "spending_limit", label: "Spending Limit", color: "bg-rose-300" },
  { value: "count_amount", label: "Count Above", color: "bg-indigo-300" },
  { value: "count_limit", label: "Count Limit", color: "bg-amber-300" },
];

export const GOAL_STATUS = {
  READY: "ready",
  PROGRESS: "progress",
  DONE: "done",
};
