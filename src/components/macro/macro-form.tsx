import { type FC, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingDot } from "@/components/ui/loading-dot";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { macroFormSchema } from "@/schema/macro.schema";

interface MacroFormProps {
  isLoading: boolean;
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];
  submitText: string;
  macroForm: UseFormReturn<z.infer<typeof macroFormSchema>, unknown, undefined>;
  onSubmitMacro: (formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
}

export const MacroForm: FC<MacroFormProps> = ({
  isLoading,
  currencies,
  transactionTypes,
  categories,
  submitText,
  macroForm,
  onSubmitMacro,
}) => {
  const filteredCategories = useMemo(
    () => categories?.filter((category) => category.type_id.toString() === macroForm.getValues("type_id")) ?? [],
    [categories, macroForm.watch("type_id")],
  );

  return (
    <Form {...macroForm}>
      <form
        className="overflow-hidden flex flex-col flex-1 gap-6 pb-6"
        onSubmit={macroForm.handleSubmit(onSubmitMacro)}
      >
        <div className="overflow-auto flex flex-col gap-4 flex-1 px-4 pb-1">
          <FormField
            control={macroForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Name</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={macroForm.control}
              name="day"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Day</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={31} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={macroForm.control}
              name="hour"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Hour</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={23} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={macroForm.control}
              name="minute"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Minute</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={59} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={macroForm.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-[240px]">
                    {transactionTypes?.map((transactionType) => (
                      <SelectItem key={transactionType.id} value={`${transactionType.id}`}>
                        {transactionType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={macroForm.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} disabled={!macroForm.watch("type_id")} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-[240px]">
                    {filteredCategories?.map((category) => (
                      <SelectItem key={category.id} value={`${category.id}`}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={macroForm.control}
            name="currency_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-[240px]">
                    {currencies?.map((currency) => (
                      <SelectItem key={currency.id} value={`${currency.id}`}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={macroForm.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={macroForm.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required>Memo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="relative mt-auto px-4">
          <Button type="submit" className="w-full" disabled={isLoading || !macroForm.formState.isValid}>
            {submitText}
          </Button>

          {isLoading ? (
            <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center z-1">
              <LoadingDot />
            </div>
          ) : null}
        </div>
      </form>
    </Form>
  );
};
