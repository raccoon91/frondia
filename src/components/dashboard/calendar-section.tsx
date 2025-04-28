import dayjs from "dayjs";
import { type FC, type MouseEvent, memo } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CalendarSectionProps {
  selectedType: number | null;
  sessionDate: string;
  transactionTypes: TransactionType[];
  calendarCountByTypeMap: CalendarCountByTypeMap;
  calendarStatisticsMap: CalendarStatisticsMap;
  onClickCalendarType: (calendarType: number) => void;
}

export const CalendarSection: FC<CalendarSectionProps> = memo(
  ({
    selectedType,
    sessionDate,
    transactionTypes,
    calendarCountByTypeMap,
    calendarStatisticsMap,
    onClickCalendarType,
  }) => {
    const handleClickCalendarType = (e: MouseEvent<HTMLDivElement>) => {
      if (!e.currentTarget.dataset.type) return;

      onClickCalendarType(Number(e.currentTarget.dataset.type));
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Calendar
              month={dayjs(sessionDate).toDate()}
              classNames={{
                day: cn(buttonVariants({ variant: "ghost" }), "size-10 p-0 font-normal aria-selected:opacity-100"),
              }}
              components={{
                Caption: () => null,
                DayContent: ({ date }) => {
                  const fullDate = dayjs(date).format("YYYY-MM-DD");
                  const displayDate = dayjs(date).get("date");
                  const calendarMap = calendarStatisticsMap[fullDate];
                  const selected = selectedType ? calendarMap?.[selectedType] : null;

                  if (!selected) {
                    return (
                      <div className="flex items-center justify-center w-full h-full">
                        <p>{displayDate}</p>
                      </div>
                    );
                  }

                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative flex items-center justify-center w-full h-full">
                          <p>{displayDate}</p>

                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 z-1">
                            <p className={cn("text-[10px]", selected?.type?.config?.color ?? "")}>
                              {selected.amount.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" variant="outline">
                        USD ${selected.amount.toFixed(1)}
                      </TooltipContent>
                    </Tooltip>
                  );
                },
              }}
            />
          </TooltipProvider>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-y-1 gap-x-3">
          {transactionTypes.map((type) => (
            <div
              key={type.id}
              data-type={type.id}
              className="flex items-center gap-2"
              onClick={handleClickCalendarType}
            >
              <div className={cn("w-2.5 h-2.5 rounded-xs", type.config?.bg ?? "")} />
              <p className="text-xs">{type.name}</p>
              <p className="text-xs">{calendarCountByTypeMap?.[type.id]?.count ?? "--"}</p>
            </div>
          ))}
        </CardFooter>
      </Card>
    );
  },
);
