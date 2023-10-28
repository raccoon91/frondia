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

    const { update, create } = expenses.reduce(
      (acc, cur) => {
        if (!cur.types?.id || !cur.categories?.id) return acc;

        const body = {
          user_id: user.id,
          type_id: cur.types.id,
          category_id: cur.categories.id,
          price: cur.price,
          note: cur.note,
          date: date,
        };

        if (cur.id) {
          acc.update.push({
            id: cur.id,
            ...body,
          });
        } else {
          acc.create.push(body);
        }

        return acc;
      },
      { update: [] as IExpense[], create: [] as IExpense[] }
    );

    const updateRes = await supabase.from("expenses").upsert(update);

    if (updateRes.error) throw new Error(updateRes.error.message);

    const createRes = await supabase.from("expenses").insert(create);

    if (createRes.error) throw new Error(createRes.error.message);

    return 200;
  },
  delete: async (expenses: IExpense[]) => {
    for (const expense of expenses) {
      const res = await supabase.from("expenses").delete().eq("id", expense.id);

      if (res.error) throw new Error(res.error.message);
    }
  },
};
