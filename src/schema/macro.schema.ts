import { z } from "zod";

export const macroFormSchema = z.object({
  name: z.string(),
  type_id: z.string(),
  category_id: z.string(),
  currency_id: z.string(),
  amount: z.string(),
  memo: z.string(),
});
