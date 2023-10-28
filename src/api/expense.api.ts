import { supabase } from "@/db";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";

export const expenseApi = {
  gets: async ({
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
  }) => {
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
      res = await supabase.from("expenses").select<string, IExpense>(queryString).eq("date", date.eq);
    } else if (date?.from && date?.to) {
      res = await supabase
        .from("expenses")
        .select<string, IExpense>(queryString)
        .gte("date", date.from)
        .lte("date", date.to);
    } else {
      res = await supabase.from("expenses").select<string, IExpense>(queryString);
    }

    if (res.error) throw new Error(res.error.message);

    if (res.status === 204) throw new Error("No Content");

    return res.data ?? [];
  },
  upsert: async (user: User | null, date: string, expenses: Omit<IExpense, "type_id" | "category_id">[]) => {
    if (!user) return;

    const res = await supabase.from("expenses").upsert(
      expenses.map(expense => {
        const body: IExpense = {
          user_id: user.id,
          type_id: expense.types?.id ?? null,
          category_id: expense.categories?.id ?? null,
          price: expense.price,
          note: expense.note,
          date: date,
        };

        if (expense.id) {
          body.id = expense.id;
        }

        return body;
      })
    );

    if (res.error) throw new Error(res.error.message);

    return res.status;
  },
  delete: async (expenses: IExpense[]) => {
    for (const expense of expenses) {
      const res = await supabase.from("expenses").delete().eq("id", expense.id);

      if (res.error) throw new Error(res.error.message);
    }
  },
};
