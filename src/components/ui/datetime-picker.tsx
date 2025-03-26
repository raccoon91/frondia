"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateTimePickerProps {
  hideIcon?: boolean;
  defaultValue?: string;
  onValueChange?: (date: Nullable<string>) => void;
}

export function DateTimePicker({ hideIcon, defaultValue, onValueChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue ? dayjs(defaultValue).toDate() : undefined);

  const handleChangeDate = (value?: Date) => {
    if (!value) {
      setDate(undefined);
      onValueChange?.(null);

      return;
    }

    let newDate = dayjs(value);

    if (date) {
      newDate = newDate.set("hour", dayjs(date).get("hour")).set("minute", dayjs(date).get("minute"));
    }

    setDate(newDate.toDate());
    onValueChange?.(newDate.format("YYYY-MM-DD HH:mm"));
  };

  const handleClickHour = (e: React.MouseEvent<HTMLDivElement>) => {
    const dataset = e.currentTarget.dataset;

    const hour = dataset["hour"];

    if (!hour) return;

    const newDate = dayjs(date).set("hour", Number(hour));

    setDate(newDate.toDate());
    onValueChange?.(newDate.format("YYYY-MM-DD HH:mm"));
  };

  const handleClickMinute = (e: React.MouseEvent<HTMLDivElement>) => {
    const dataset = e.currentTarget.dataset;

    const minute = dataset["minute"];

    if (!minute) return;

    const newDate = dayjs(date).set("minute", Number(minute));

    setDate(newDate.toDate());
    onValueChange?.(newDate.format("YYYY-MM-DD HH:mm"));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn("w-full justify-start text-left font-normal px-2", !date && "text-muted-foreground")}
        >
          {!hideIcon ? <CalendarIcon /> : null}
          {date ? dayjs(date).format("YYYY-MM-DD HH:mm") : <span>Date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex gap-2 w-auto p-0" align="start">
        <Calendar initialFocus mode="single" selected={date} onSelect={handleChangeDate} />

        <div className="relative w-[120px]">
          <div className="absolute top-0 left-0 right-0 bottom-0 flex">
            <div className="overflow-hidden flex flex-col gap-4 w-[60px] h-full">
              <div className="flex items-center justify-center h-6 pt-1">
                <p className="text-sm">Hour</p>
              </div>

              <div className="overflow-auto flex-1">
                <div className="flex flex-col gap-1">
                  {Array.from(Array(24), (_, index) => (
                    <div
                      key={index}
                      data-hour={index}
                      className={cn(
                        "flex items-center justify-center h-8 rounded-sm hover:bg-accent hover:cursor-pointer",
                        dayjs().get("hour") === index ? "bg-accent" : "unset",
                        date && dayjs(date).get("hour") === index
                          ? "bg-primary hover:bg-primary text-primary-foreground"
                          : "unset",
                      )}
                      onClick={handleClickHour}
                    >
                      <p className="text-sm">{index}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden flex flex-col gap-4 w-[60px] h-full">
              <div className="flex items-center justify-center h-6 pt-1">
                <p className="text-sm">Minute</p>
              </div>

              <div className="overflow-auto flex-1">
                <div className="flex flex-col gap-1">
                  {Array.from(Array(12), (_, index) => (
                    <div
                      key={index}
                      data-minute={index * 5}
                      className={cn(
                        "flex items-center justify-center h-8 rounded-sm hover:bg-accent hover:cursor-pointer",
                        Math.floor(dayjs().get("minute") / 5) * 5 === index * 5 ? "bg-accent" : "unset",
                        date && Math.floor(dayjs(date).get("minute") / 5) * 5 === index * 5
                          ? "bg-primary hover:bg-primary text-primary-foreground"
                          : "unset",
                      )}
                      onClick={handleClickMinute}
                    >
                      <p className="text-sm">{index * 5}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
