import { ChangeEvent, FC, useMemo, useState } from "react";
import { Goal } from "lucide-react";
import { useForm } from "react-hook-form";
import dayjs, { ManipulateType } from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GOAL_DATE_UNIT_OPTIONS, GOAL_RULES, GOAL_STATUS } from "@/constants/goal";
import { goalFormSchema } from "@/schema/goal.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { DatePicker } from "@/components/ui/date-picker";
import { LoadingDot } from "@/components/ui/loading-dot";

interface GoalSheetProps {
  isLoading: boolean;
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];
  onCreate: (formdata: z.infer<typeof goalFormSchema>) => Promise<void>;
}

export const GoalSheet: FC<GoalSheetProps> = ({ isLoading, currencies, transactionTypes, categories, onCreate }) => {
  const [isOpenGoalSheet, setIsOpenGoalSheet] = useState(false);

  const form = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      rule: "",
      name: "",
      type_id: "",
      categories: [],
      currency_id: "",
      amount: "",
      period: "",
      date_unit: "",
      start: "",
      end: "",
      status: "",
    },
  });

  const categoryOptions = useMemo(
    () =>
      categories
        ?.filter((category) => category.type_id.toString() === form.getValues("type_id"))
        ?.map((category) => ({
          value: `${category.id}`,
          label: category.name,
        })) ?? [],
    [categories, form.watch("type_id")],
  );

  const handleToggleSheet = (open: boolean) => {
    setIsOpenGoalSheet(open);
  };

  const handleSubmitGoal = async (formdata: z.infer<typeof goalFormSchema>) => {
    await onCreate(formdata);

    form.reset();

    setIsOpenGoalSheet(false);
  };

  return (
    <Sheet open={isOpenGoalSheet} onOpenChange={handleToggleSheet}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <Goal />
          <p>Goal</p>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Goal</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="overflow-hidden flex flex-col flex-1 gap-6 pb-6"
            onSubmit={form.handleSubmit(handleSubmitGoal)}
          >
            <div className="overflow-auto flex flex-col gap-4 flex-1 px-4">
              <FormField
                control={form.control}
                name="rule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select Category"
                        disabled={!form.watch("type_id")}
                        options={categoryOptions}
                        defaultValue={field.value}
                        onSelectValue={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex-2">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency_id"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Currency</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem className="flex-2">
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;

                            if (!value) {
                              form.setValue("end", "");
                              form.setValue("status", "");

                              field.onChange("");

                              return;
                            }

                            const unit = form.getValues("date_unit");
                            const start = form.getValues("start");

                            const ready = dayjs(value).isAfter(dayjs().format("YYYY-MM-DD"));

                            if (unit && start) {
                              const end = dayjs(start)
                                .add(Number(value), unit as ManipulateType)
                                .subtract(1, "day")
                                .toString();
                              const done = dayjs(end).isBefore(dayjs().format("YYYY-MM-DD"));

                              form.setValue("end", end);
                              form.setValue(
                                "status",
                                done ? GOAL_STATUS.DONE : ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS,
                              );
                            } else {
                              form.setValue("status", ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS);
                            }

                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_unit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date Unit</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value: string) => {
                          const period = form.getValues("period");
                          const start = form.getValues("start");

                          if (period && start) {
                            const end = dayjs(start)
                              .add(Number(period), value as ManipulateType)
                              .toString();

                            form.setValue("end", end);
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
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start</FormLabel>
                      <FormControl>
                        <DatePicker
                          size="default"
                          hideIcon
                          disabled={!form.watch("period") || !form.watch("date_unit")}
                          defaultValue={field.value}
                          dateFormat="YYYY-MM-DD"
                          onValueChange={(value: Nullable<string>) => {
                            if (!value) {
                              form.setValue("end", "");
                              form.setValue("status", "");

                              field.onChange("");

                              return;
                            }

                            const period = form.getValues("period");
                            const unit = form.getValues("date_unit");

                            const ready = dayjs(value).isAfter(dayjs().format("YYYY-MM-DD"));

                            if (period && unit) {
                              const end = dayjs(value)
                                .add(Number(period), unit as ManipulateType)
                                .subtract(1, "day")
                                .toString();
                              const done = dayjs(end).isBefore(dayjs().format("YYYY-MM-DD"));

                              form.setValue("end", end);
                              form.setValue(
                                "status",
                                done ? GOAL_STATUS.DONE : ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS,
                              );
                            } else {
                              form.setValue("status", ready ? GOAL_STATUS.READY : GOAL_STATUS.PROGRESS);
                            }

                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Input disabled value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="relative mt-auto px-4">
              <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isValid}>
                Create Goal
              </Button>

              {isLoading ? (
                <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center z-1">
                  <LoadingDot />
                </div>
              ) : null}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
