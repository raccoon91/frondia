import { DEFAULT_CATEGORY_MAP, DEFAULT_CURRENCIES, DEFAULT_TRANSACTION_TYPES } from "@/constants/seed";
import { supabase } from "./client";

export const generateCurrency = async () => {
  try {
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

export const generateTypes = async () => {
  try {
    const { data: types, error: typeError } = await supabase
      .from("transaction_types")
      .insert(DEFAULT_TRANSACTION_TYPES)
      .select("*");

    if (typeError) throw typeError;

    console.log("types", types);
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

    const { data: types, error: typeError } = await supabase.from("transaction_types").select("*");

    if (typeError) throw typeError;

    if (!types) return;

    for (const type of types) {
      const categorySeeds =
        DEFAULT_CATEGORY_MAP?.[type.name]?.map((category) => ({
          user_id: user.id,
          type_id: type.id,
          ...category,
        })) ?? [];

      const { data: categories } = await supabase.from("categories").insert(categorySeeds).select("*");

      console.log("categories", categories);
    }
  } catch (error) {
    console.error(error);
  }
};
