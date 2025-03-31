import { ChangeEvent, FC, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import dayjs, { ManipulateType } from "dayjs";
import { z } from "zod";

import { GOAL_DATE_UNIT_OPTIONS, GOAL_RULES, GOAL_STATUS } from "@/constants/goal";
import { goalFormSchema } from "@/schema/goal.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import { LoadingDot } from "@/components/ui/loading-dot";

interface GoalFormProps {
  isLoading: boolean;
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];
  submitText: string;
  goalForm: UseFormReturn<z.infer<typeof goalFormSchema>, any, undefined>;
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
            name="rule"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  <p>Rule</p>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                      <SelectValue placeholder="Select Rule" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-[240px]">
                    {GOAL_RULES?.map((rule) => (
                      <SelectItem key={rule.value} value={rule.value}>
                        {rule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

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
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-2">
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
                <FormItem className="flex-1">
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
                <FormItem className="flex-2">
                  <FormLabel className="gap-1">
                    <p>Period</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;

                        if (!value) {
                          goalForm.setValue("end", "");
                          goalForm.setValue("status", "");

                          field.onChange("");

                          return;
                        }

                        const unit = goalForm.getValues("date_unit");
                        const start = goalForm.getValues("start");

                        const ready = dayjs(value).isAfter(dayjs().format("YYYY-MM-DD 00:00"));

                        if (unit && start) {
                          const end = dayjs(start)
                            .add(Number(value), unit as ManipulateType)
                            .subtract(1, "day")
                            .format("YYYY-MM-DD 00:00");
                          const done = dayjs(end).isBefore(dayjs().format("YYYY-MM-DD 00:00"));

                          goalForm.setValue("end", end);
                          goalForm.setValue(
                            "status",
                            done ? GOAL_STATUS.DONE : ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS,
                          );
                        } else {
                          goalForm.setValue("status", ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS);
                        }

                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={goalForm.control}
              name="date_unit"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="gap-1">
                    <p>Date Unit</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value: string) => {
                      const period = goalForm.getValues("period");
                      const start = goalForm.getValues("start");

                      if (period && start) {
                        const end = dayjs(start)
                          .add(Number(period), value as ManipulateType)
                          .format("YYYY-MM-DD 00:00");

                        goalForm.setValue("end", end);
                      }

                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full py-1 px-3 border-input-foreground">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="max-h-[240px]">
                      {GOAL_DATE_UNIT_OPTIONS?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="start"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="gap-1">
                    <p>Start</p>
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      size="default"
                      hideIcon
                      disabled={!goalForm.watch("period") || !goalForm.watch("date_unit")}
                      value={field.value}
                      dateFormat="YYYY-MM-DD"
                      onValueChange={(value: Nullable<string>) => {
                        if (!value) {
                          goalForm.setValue("end", "");
                          goalForm.setValue("status", "");

                          field.onChange("");

                          return;
                        }

                        const period = goalForm.getValues("period");
                        const unit = goalForm.getValues("date_unit");

                        const ready = dayjs(value).isAfter(dayjs().format("YYYY-MM-DD 00:00"));

                        if (period && unit) {
                          const end = dayjs(value)
                            .add(Number(period), unit as ManipulateType)
                            .subtract(1, "day")
                            .format("YYYY-MM-DD 00:00");
                          const done = dayjs(end).isBefore(dayjs().format("YYYY-MM-DD 00:00"));

                          goalForm.setValue("end", end);
                          goalForm.setValue(
                            "status",
                            done ? GOAL_STATUS.DONE : ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS,
                          );
                        } else {
                          goalForm.setValue("status", ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS);
                        }

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
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input disabled value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""} />
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
