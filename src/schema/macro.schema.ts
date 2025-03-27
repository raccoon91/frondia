import { z } from "zod";

export const macroFormSchema = z.object({
  name: z.string().nonempty(),
  type_id: z.string(),
  category_id: z.string(),
  currency_id: z.string(),
  amount: z.string(),
  memo: z.string().nonempty(),
  day: z.string(),
  hour: z.string(),
  minute: z.string(),
});
