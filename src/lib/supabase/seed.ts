import type { User } from "@supabase/supabase-js";

import {
  DEFAULT_CATEGORY_MAP,
  DEFAULT_CURRENCIES,
  DEFAULT_GOAL_RULES,
  DEFAULT_TRANSACTION_TYPES,
} from "@/constants/seed";
import { supabase } from "./client";

export const generateCurrencies = async () => {
  try {
    const { data: currencies, error: currencyError } = await supabase
      .from("currencies")
      .insert(DEFAULT_CURRENCIES)
      .select("*");

    if (currencyError) throw currencyError;

    return currencies;
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

    return types;
  } catch (error) {
    console.error(error);
  }
};

export const generateCategories = async (user?: User) => {
  try {
    if (!user) return;

    const { data: types, error: typeError } = await supabase.from("transaction_types").select("*");

    if (typeError) throw typeError;

    if (!types) return;

    const categorySeeds = types.reduce<{ name: string; order: number; user_id: string; type_id: number }[]>(
      (seed, type) => {
        DEFAULT_CATEGORY_MAP?.[type.name]?.forEach((category) => {
          seed.push({
            user_id: user.id,
            type_id: type.id,
            ...category,
          });
        });

        return seed;
      },
      [],
    );

    const { data: categories } = await supabase.from("categories").insert(categorySeeds).select("*");

    return categories;
  } catch (error) {
    console.error(error);
  }
};

export const generateGoalRules = async () => {
  try {
    const { data: rules, error } = await supabase.from("goal_rules").insert(DEFAULT_GOAL_RULES).select("*");

    if (error) throw error;

    return rules;
  } catch (error) {
    console.error(error);
  }
};
