// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const DEFAULT_CATEGORY_MAP = {
  income: [
    { name: "Salary", order: 1 },
    { name: "Bonus", order: 2 },
    { name: "Freelance Work", order: 3 },
    { name: "Investments", order: 4 },
    { name: "Gifts & Allowances", order: 5 },
    { name: "Other Income", order: 6 },
  ],
  expense: [
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
  savings: [
    { name: "Emergency Fund", order: 21 },
    { name: "Retirement Fund", order: 22 },
    { name: "Vacation Fund", order: 23 },
    { name: "Major Purchase Fund", order: 24 },
    { name: "Other Saving", order: 25 },
  ],
  investment: [
    { name: "Stocks", order: 26 },
    { name: "Crypto", order: 27 },
    { name: "Real Estate", order: 28 },
    { name: "Bonds", order: 29 },
    { name: "Mutual Funds", order: 30 },
    { name: "Business Investments", order: 31 },
    { name: "Other Investment", order: 32 },
  ],
};

Deno.serve(async (req) => {
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization") } },
    });

    const payload = await req.json();

    const user = payload.record;

    if (!user) throw new Error("User not exist");

    const { data: profile, error: profileError } = await supabase.from("profiles").insert({
      user_id: user.id,
      created_at: user.created_at,
    });

    if (profileError) throw profileError;

    user.profile = profile;

    const { data: types, error: typeError } = await supabase.from("transaction_types").select("*");

    if (typeError) throw typeError;

    if (!types) throw new Error("Transaction Type not exist");

    const categorySeeds = types.reduce((seed, type) => {
      DEFAULT_CATEGORY_MAP?.[type.name]?.forEach((category) => {
        seed.push({
          user_id: user.id,
          type_id: type.id,
          ...category,
        });
      });

      return seed;
    }, []);

    const { error: categoryError } = await supabase.from("categories").insert(categorySeeds).select("*");

    if (categoryError) throw categoryError;

    return new Response(JSON.stringify({ message: "create user profile", user }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(String(error?.message ?? error), {
      status: 500,
    });
  }
});
