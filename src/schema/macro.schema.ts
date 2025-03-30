import { z } from "zod";

export const macroFormSchema = z.object({
  name: z.string().nonempty(),
  type_id: z.string().default(""),
  category_id: z.string().default(""),
  currency_id: z.string().default(""),
  amount: z.string().default(""),
  memo: z.string().nonempty(),
  day: z.string().default(""),
  hour: z.string().default(""),
  minute: z.string().default(""),
});

export const macroFormDefaultValues = {
  name: "",
  type_id: "",
  category_id: "",
  currency_id: "",
  amount: "",
  memo: "",
  day: "",
  hour: "",
  minute: "",
};
