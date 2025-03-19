export const DEFAULT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "KRW", name: "Korean Won", symbol: "₩" },
  { code: "CAD", name: "Canadian Dollar	", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

export const DEFAULT_TRANSACTION_TYPES_AND_CATEGORIES = [
  { name: "income", categories: [{ name: "Salary" }, { name: "Bonus" }] },
  {
    name: "expense",
    categories: [
      { name: "Food & Dining" },
      { name: "Transportation" },
      { name: "Shopping" },
      { name: "Entertainment" },
      { name: "Health & Fitness" },
    ],
  },
  { name: "savings", categories: [{ name: "Emergency Fund" }] },
  { name: "investment", categories: [{ name: "Stocks" }, { name: "Crypto" }] },
];
