import { supabase } from "@/db";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const expenseApi = {
  gets: async (
    type: IExpenseTeyps,
    {
      query,
      relation,
      date,
    }: {
      query?: string;
      relation?: string[];
      date?: {
        eq?: string;
        from?: string;
        to?: string;
      };
    }
  ) => {
    let queryString = "*";

    if (query) {
      queryString = query;
    } else if (relation) {
      relation.forEach(table => {
        queryString += ` ${table} (*)`;
      });
    }

    let res: PostgrestSingleResponse<IExpense[]>;

    if (date?.eq) {
      res = await supabase.from(type).select<string, IExpense>(queryString).eq("date", date.eq);
    } else if (date?.from && date?.to) {
      res = await supabase.from(type).select<string, IExpense>(queryString).gte("date", date.from).lte("date", date.to);
    } else {
      res = await supabase.from(type).select<string, IExpense>(queryString);
    }

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
};
