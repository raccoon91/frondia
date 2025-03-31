import { z } from "zod";

export const goalFormSchema = z.object({
  name: z.string().nonempty(),
  rule_id: z.string().nonempty(),
  type_id: z.string().nonempty(),
  categories: z.string().nonempty().array(),
  currency_id: z.string().nonempty(),
  amount: z.number().or(z.string().nonempty()),
  period: z.number().or(z.string().nonempty()),
  date_unit: z.string().nonempty(),
  start: z.string().nonempty(),
  end: z.string().nonempty(),
  status: z.string().nonempty(),
});

export const goalFormDefaultValues = {
  name: "",
  rule_id: "",
  type_id: "",
  categories: [],
  currency_id: "",
  amount: "",
  period: "",
  date_unit: "",
  start: "",
  end: "",
  status: "",
};
