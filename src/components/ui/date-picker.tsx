"use client";

import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button, type buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface DatePickerProps extends VariantProps<typeof buttonVariants> {
  hideIcon?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  dateFormat?: string;
  className?: string;
  onValueChange?: (date: Nullable<string>) => void;
}

export function DatePicker({
  hideIcon,
  disabled,
  defaultValue,
  value,
  dateFormat,
  className,
  onValueChange,
  ...props
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue ? dayjs(defaultValue).toDate() : undefined);

  React.useEffect(() => {
    if (!value) return;

    setDate(dayjs(value).toDate());
  }, [value]);

  const handleChangeDate = (value?: Date) => {
    if (!value) {
      setDate(undefined);
      onValueChange?.(null);

      return;
    }

    const newDate = dayjs(value);

    setDate(newDate.toDate());
    onValueChange?.(newDate.format("YYYY-MM-DD HH:mm"));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal py-1 px-3",
            className,
            !date && "text-muted-foreground",
          )}
          {...props}
        >
          {!hideIcon ? <CalendarIcon /> : null}

          {date ? dayjs(date).format(dateFormat ? dateFormat : "YYYY-MM-DD HH:mm") : <span>Date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex gap-2 w-auto p-0" align="start">
        <Calendar initialFocus mode="single" selected={date} onSelect={handleChangeDate} />
      </PopoverContent>
    </Popover>
  );
}
