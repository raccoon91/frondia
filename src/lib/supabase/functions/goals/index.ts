// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { name } = await req.json();

    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const { data: currencies, error: currencyError } = await supabase.from("currencies").select("*");

    if (currencyError) throw currencyError;

    const { data: goals, error: goalError } = await supabase.from("goals").select("*");

    if (goalError) throw goalError;

    return new Response(
      JSON.stringify({
        message: `Function: ${name}`,
        currencies,
        goals,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(String(error?.message ?? error), { status: 500 });
  }
});
