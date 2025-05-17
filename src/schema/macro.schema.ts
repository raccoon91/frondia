import { z } from "zod";

export const transactionMacroFormSchema = z.object({
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

export const goalMacroFormSchema = z.object({
  name: z.string().nonempty(),
  type_id: z.string().default(""),
  category_ids: z.array(z.string()).default([]),
  currency_id: z.string().default(""),
  rule: z.string().nonempty(),
  amount: z.string().default(""),
  period: z.string().nonempty(),
});

export const transactionMacroFormDefaultValues = {
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

export const goalMacroFormDefaultValues = {
  name: "",
  type_id: "",
  category_ids: [],
  currency_id: "",
  rule: "",
  amount: "",
  period: "",
};
