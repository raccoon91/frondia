import dayjs from "dayjs";
import { type FC, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingDot } from "@/components/ui/loading-dot";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GOAL_STATUS } from "@/constants/goal";
import type { goalFormSchema } from "@/schema/goal.schema";

interface GoalFormProps {
  isLoading: boolean;
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];
  submitText: string;
  goalForm: UseFormReturn<z.infer<typeof goalFormSchema>, unknown, undefined>;
  onSubmitGoal: (formdata: z.infer<typeof goalFormSchema>) => Promise<void>;
}

export const GoalForm: FC<GoalFormProps> = ({
  isLoading,
  currencies,
  transactionTypes,
  categories,
  submitText,
  goalForm,
  onSubmitGoal,
}) => {
  const categoryOptions = useMemo(
    () =>
      categories
        ?.filter((category) => category.type_id.toString() === goalForm.getValues("type_id"))
        ?.map((category) => ({
          value: `${category.id}`,
          label: category.name,
        })) ?? [],
    [categories, goalForm.watch("type_id")],
  );

  return (
    <Form {...goalForm}>
      <form className="overflow-hidden flex flex-col flex-1 gap-6 pb-6" onSubmit={goalForm.handleSubmit(onSubmitGoal)}>
        <div className="overflow-auto flex flex-col gap-4 flex-1 px-4 pb-1">
          <FormField
            control={goalForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  <p>Name</p>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={goalForm.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  <p>Transaction Type</p>
                  <span className="text-destructive">*</span>
                </FormLabel>
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
            control={goalForm.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  <p>Category</p>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Select Category"
                    disabled={!goalForm.watch("type_id")}
                    options={categoryOptions}
                    values={field.value}
                    onSelectValue={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2 w-full">
            <FormField
              control={goalForm.control}
              name="rule"
              render={({ field }) => (
                <FormItem className="w-[100px]">
                  <FormLabel className="gap-1">
                    <p>Rule</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
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
                </FormItem>
              )}
            />

            <FormField
              control={goalForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-3">
                  <FormLabel className="gap-1">
                    <p>Amount</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={goalForm.control}
              name="currency_id"
              render={({ field }) => (
                <FormItem className="flex-2">
                  <FormLabel className="gap-1">
                    <p>Currency</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                        <SelectValue placeholder="Currency" />
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

          <div className="flex gap-2 w-full">
            <FormField
              control={goalForm.control}
              name="period"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="gap-1">
                    <p>Period</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value: string) => {
                      if (value === "month") {
                        goalForm.setValue("start", dayjs().startOf("month").format("YYYY-MM-DD"));
                        goalForm.setValue("end", dayjs().endOf("month").format("YYYY-MM-DD"));
                        goalForm.setValue("status", GOAL_STATUS.PROGRESS);
                      } else if (value === "week") {
                        goalForm.setValue("start", dayjs().startOf("week").format("YYYY-MM-DD"));
                        goalForm.setValue("end", dayjs().endOf("week").format("YYYY-MM-DD"));
                        goalForm.setValue("status", GOAL_STATUS.PROGRESS);
                      }

                      field.onChange(value);
                    }}
                  >
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
                </FormItem>
              )}
            />

            <FormField
              control={goalForm.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="gap-1">
                    <p>Start</p>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      size="default"
                      hideIcon
                      value={field.value}
                      dateFormat="YYYY-MM-DD"
                      disabled={goalForm.watch("period") !== "custom"}
                      onValueChange={(value: Nullable<string>) => {
                        if (!value) {
                          goalForm.setValue("status", "");
                          field.onChange("");

                          return;
                        }

                        const end = goalForm.getValues("end");
                        const ready = dayjs(value).isBefore(dayjs().format("YYYY-MM-DD 00:00"));
                        const done = end ? dayjs(end).isBefore(dayjs().format("YYYY-MM-DD 00:00")) : null;

                        goalForm.setValue(
                          "status",
                          done ? GOAL_STATUS.DONE : ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS,
                        );

                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={goalForm.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="gap-1">
                    <p>End</p>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      size="default"
                      hideIcon
                      value={field.value}
                      dateFormat="YYYY-MM-DD"
                      disabled={goalForm.watch("period") !== "custom"}
                      onValueChange={(value: Nullable<string>) => {
                        if (!value) {
                          goalForm.setValue("status", "");
                          field.onChange("");

                          return;
                        }

                        const start = goalForm.getValues("start");
                        const ready = start ? dayjs(start).isBefore(dayjs().format("YYYY-MM-DD 00:00")) : null;
                        const done = dayjs(value).isBefore(dayjs().format("YYYY-MM-DD 00:00"));

                        goalForm.setValue(
                          "status",
                          done ? GOAL_STATUS.DONE : ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS,
                        );

                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={goalForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  <p>Status</p>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="relative mt-auto px-4">
          <Button type="submit" className="w-full" disabled={isLoading || !goalForm.formState.isValid}>
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
