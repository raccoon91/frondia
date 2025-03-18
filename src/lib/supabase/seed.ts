import { supabase } from ".";

const DEFAULT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "KRW", name: "Korean Won", symbol: "₩" },
  { code: "CAD", name: "Canadian Dollar	", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

const DEFAULT_TRANSACTION_TYPES_AND_CATEGORIES = [
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

export const generateDatabaseSeed = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: currencies } = await supabase.from("currencies").insert(DEFAULT_CURRENCIES).select("*");

    console.log("currencies", currencies);

    for (const transactionSeed of DEFAULT_TRANSACTION_TYPES_AND_CATEGORIES) {
      const { data: transaction } = await supabase
        .from("transaction_types")
        .insert({ user_id: user.id, name: transactionSeed.name })
        .select("*")
        .maybeSingle();

      console.log("transaction", transaction);

      if (!transaction) continue;

      const categorySeeds = transactionSeed.categories.map((category) => ({
        user_id: user.id,
        type_id: transaction.id,
        name: category.name,
      }));

      const { data: categories } = await supabase.from("categories").insert(categorySeeds).select("*");

      console.log("categories", categories);
    }
  } catch (error) {
    console.error(error);
  }
};
