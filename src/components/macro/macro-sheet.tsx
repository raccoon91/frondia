import { FC, PropsWithChildren, useMemo, useState } from "react";
import { Wrench } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { macroFormSchema } from "@/schema/macro.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingDot } from "@/components/ui/loading-dot";

interface MacroSheetProps {
  isLoading: boolean;
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];
  onCreate: (formdata: z.infer<typeof macroFormSchema>) => Promise<void>;
}

export const MacroSheet: FC<PropsWithChildren<MacroSheetProps>> = ({
  isLoading,
  currencies,
  transactionTypes,
  categories,
  onCreate,
  children,
}) => {
  const [isOpenMacroSheet, setIsOpenMacroSheet] = useState(false);

  const form = useForm<z.infer<typeof macroFormSchema>>({
    resolver: zodResolver(macroFormSchema),
  });

  const filteredCategories = useMemo(
    () => categories?.filter((category) => category.type_id.toString() === form.getValues("type_id")) ?? [],
    [categories, form.watch("type_id")],
  );

  const handleToggleSheet = (open: boolean) => {
    setIsOpenMacroSheet(open);
  };

  const handleSubmitMacro = async (formdata: z.infer<typeof macroFormSchema>) => {
    await onCreate(formdata);

    form.reset();

    setIsOpenMacroSheet(false);
  };

  return (
    <Sheet open={isOpenMacroSheet} onOpenChange={handleToggleSheet}>
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <Button disabled={isLoading} size="icon" variant="outline" className="w-8 h-8">
            <Wrench />
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-2 w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Macro</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="overflow-hidden flex flex-col flex-1 gap-6 pb-6"
            onSubmit={form.handleSubmit(handleSubmitMacro)}
          >
            <div className="overflow-auto flex flex-col gap-4 flex-1 px-4">
              <FormField
                control={form.control}
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

              <div className="flex gap-2">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select defaultValue={field.value} disabled={!form.watch("type_id")} onValueChange={field.onChange}>
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
                control={form.control}
                name="currency_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
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
                control={form.control}
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
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">
                      <p>Memo</p>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="relative mt-auto px-4">
              <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isValid}>
                Create Macro
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
