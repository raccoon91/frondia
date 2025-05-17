import { type FC, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingDot } from "@/components/ui/loading-dot";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { goalMacroFormSchema } from "@/schema/macro.schema";
import { MultiSelect } from "../ui/multi-select";

interface GoalMacroFormProps {
  isLoading: boolean;
  transactionTypes: TransactionType[];
  categories: Category[];
  currencies: Currency[];
  submitText: string;
  goalMacroForm: UseFormReturn<z.infer<typeof goalMacroFormSchema>, unknown, undefined>;
  onSubmitMacro: (formdata: z.infer<typeof goalMacroFormSchema>) => Promise<void>;
}

export const GoalMacroForm: FC<GoalMacroFormProps> = ({
  isLoading,
  transactionTypes,
  categories,
  currencies,
  submitText,
  goalMacroForm,
  onSubmitMacro,
}) => {
  const categoryOptions = useMemo(
    () =>
      categories
        ?.filter((category) => category.type_id.toString() === goalMacroForm.getValues("type_id"))
        ?.map((category) => ({
          value: `${category.id}`,
          label: category.name,
        })) ?? [],
    [categories, goalMacroForm.watch("type_id")],
  );

  return (
    <Form {...goalMacroForm}>
      <form
        className="overflow-hidden flex flex-col flex-1 gap-6 pb-6"
        onSubmit={goalMacroForm.handleSubmit(onSubmitMacro)}
      >
        <div className="overflow-auto flex flex-col gap-4 flex-1 px-4 pb-1">
          <FormField
            control={goalMacroForm.control}
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

          <FormField
            control={goalMacroForm.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Type</FormLabel>
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
            control={goalMacroForm.control}
            name="category_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>

                <MultiSelect
                  placeholder="Select Category"
                  disabled={!goalMacroForm.watch("type_id")}
                  options={categoryOptions}
                  values={field.value}
                  onSelectValue={field.onChange}
                />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={goalMacroForm.control}
              name="rule"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Rule</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                          <SelectValue placeholder="Rule" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="max-h-[240px]">
                        <SelectItem value="less">Less</SelectItem>
                        <SelectItem value="greater">Greater</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={goalMacroForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={goalMacroForm.control}
              name="currency_id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Currency</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                        <SelectValue placeholder="Select" />
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
          </div>

          <FormField
            control={goalMacroForm.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="max-h-[240px]">
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="relative mt-auto px-4">
          <Button type="submit" className="w-full" disabled={isLoading || !goalMacroForm.formState.isValid}>
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
