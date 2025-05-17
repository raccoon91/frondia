export const GOAL_STATUS = {
  READY: "ready",
  PROGRESS: "progress",
  DONE: "done",
  ACHIEVED: "achieved",
  FAILED: "failed",
};

export const GOAL_RULES = [
  { label: "LESS", value: "less" },
  { label: "GREATER", value: "greater" },
];

export const GOAL_RULE = GOAL_RULES.reduce<Record<string, string>>((acc, cur) => {
  acc[cur.label] = cur.value;

  return acc;
}, {});

export const GOAL_PERIODS = [
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Custom", value: "custom" },
];
