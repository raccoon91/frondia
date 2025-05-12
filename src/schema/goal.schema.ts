import { z } from "zod";

export const goalFormSchema = z.object({
  name: z.string().nonempty(),
  type_id: z.string().nonempty(),
  categories: z.string().nonempty().array(),
  rule: z.string().nonempty(),
  amount: z.number().or(z.string().nonempty()),
  currency_id: z.string().nonempty(),
  period: z.string().nonempty(),
  start: z.string().nonempty(),
  end: z.string().nonempty(),
  status: z.string().nonempty(),
});

export const goalFormDefaultValues = {
  name: "",
  type_id: "",
  categories: [],
  rule: "less",
  amount: "",
  currency_id: "",
  period: "month",
  start: "",
  end: "",
  status: "progress",
};
