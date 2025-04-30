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
  calendarCountByTypeMap: CalendarCountByTypeMap | null;
  calendarStatisticsMap: CalendarStatisticsMap | null;
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
              classNames={{ day: "size-10 p-0 font-normal aria-selected:opacity-100 rounded-md" }}
              components={{
                Caption: () => null,
                DayContent: ({ date }) => {
                  const fullDate = dayjs(date).format("YYYY-MM-DD");
                  const displayDate = dayjs(date).get("date");
                  const calendarMap = calendarStatisticsMap?.[fullDate];
                  const selected = selectedType ? calendarMap?.[selectedType] : null;

                  if (!selected) {
                    return (
                      <div className="flex items-center justify-center w-full h-full">
                        <p className="text-muted-foreground">{displayDate}</p>
                      </div>
                    );
                  }

                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "relative flex items-center justify-center w-full h-full",
                          )}
                        >
                          <p>{displayDate}</p>

                          <p
                            style={{ color: selected?.type?.config?.color ?? "" }}
                            className={cn("absolute -bottom-1 left-1/2 transform -translate-x-1/2 z-1 text-[10px]")}
                          >
                            {selected.usd.toFixed(1)}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" variant="outline">
                        {Object.values(selected.currencyMap ?? {})?.length ? (
                          <div className="mb-1">
                            {Object.values(selected.currencyMap ?? {}).map(({ currency, amount }, index) => (
                              <div key={index} className="flex items-center justify-between gap-2">
                                <p>{currency.code}</p>
                                <p>
                                  {currency.symbol} {amount.toLocaleString("en-US")}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="flex items-center justify-between gap-2">
                          <p>USD</p>
                          <p>$ {selected.usd.toFixed(1)}</p>
                        </div>
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
              className={cn(
                "flex items-center gap-2 px-1 border border-background rounded-sm hover:cursor-pointer hover:border-border",
                selectedType === type.id ? "bg-accent" : "",
              )}
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
