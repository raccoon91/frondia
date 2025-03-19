export const DEFAULT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "KRW", name: "Korean Won", symbol: "₩" },
  { code: "CAD", name: "Canadian Dollar	", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

export const DEFAULT_TRANSACTION_TYPES_AND_CATEGORIES = [
  {
    name: "income",
    order: 1,
    categories: [
      { name: "Salary", order: 1 },
      { name: "Bonus", order: 2 },
      { name: "Freelance Work", order: 3 },
      { name: "Investments", order: 4 },
      { name: "Gifts & Allowances", order: 5 },
      { name: "Other Income", order: 6 },
    ],
  },
  {
    name: "expense",
    order: 2,
    categories: [
      { name: "Food & Dining", order: 7 },
      { name: "Transportation", order: 8 },
      { name: "Shopping", order: 9 },
      { name: "Entertainment", order: 10 },
      { name: "Health & Fitness", order: 11 },
      { name: "Housing", order: 12 },
      { name: "Utilities", order: 13 },
      { name: "Education", order: 14 },
      { name: "Subscriptions & Memberships", order: 15 },
      { name: "Insurance", order: 16 },
      { name: "Debt Payments", order: 17 },
      { name: "Gifts & Donations", order: 18 },
      { name: "Pets", order: 19 },
      { name: "Other Expense", order: 20 },
    ],
  },
  {
    name: "savings",
    order: 3,
    categories: [
      { name: "Emergency Fund", order: 21 },
      { name: "Retirement Fund", order: 22 },
      { name: "Vacation Fund", order: 23 },
      { name: "Major Purchase Fund", order: 24 },
      { name: "Other Saving", order: 25 },
    ],
  },
  {
    name: "investment",
    order: 4,
    categories: [
      { name: "Stocks", order: 26 },
      { name: "Crypto", order: 27 },
      { name: "Real Estate", order: 28 },
      { name: "Bonds", order: 29 },
      { name: "Mutual Funds", order: 30 },
      { name: "Business Investments", order: 31 },
      { name: "Other Investment", order: 32 },
    ],
  },
];
