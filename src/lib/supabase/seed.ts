import { DEFAULT_CURRENCIES, DEFAULT_TRANSACTION_TYPES_AND_CATEGORIES } from "@/constants/seed";
import { supabase } from "./client";

export const generateCurrency = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: currencies, error: currencyError } = await supabase
      .from("currencies")
      .insert(DEFAULT_CURRENCIES)
      .select("*");

    if (currencyError) throw currencyError;

    console.log("currencies", currencies);
  } catch (error) {
    console.error(error);
  }
};

export const generateTypeAndCategory = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    for (const transactionSeed of DEFAULT_TRANSACTION_TYPES_AND_CATEGORIES) {
      const { data: transaction } = await supabase
        .from("transaction_types")
        .insert({ name: transactionSeed.name })
        .select("*")
        .maybeSingle();

      console.log("transaction", transaction);

      if (!transaction) continue;

      const categorySeeds = transactionSeed.categories.map((category) => ({
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
