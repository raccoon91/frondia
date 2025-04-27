import dayjs from "dayjs";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { memo, type FC } from "react";

interface CalendarSectionProps {
  sessionDate: string;
  transactionTypes: TransactionType[];
  calendarStatisticsByTypeMap: CalendarStatisticsByTypeMap;
  calendarStatisticsMap: CalendarStatisticsMap;
}

export const CalendarSection: FC<CalendarSectionProps> = memo(
  ({ sessionDate, transactionTypes, calendarStatisticsByTypeMap, calendarStatisticsMap }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            month={dayjs(sessionDate).toDate()}
            components={{
              Caption: () => null,
              DayContent: ({ date }) => {
                const fullDate = dayjs(date).format("YYYY-MM-DD");
                const displayDate = dayjs(date).get("date");
                const calendarMap = calendarStatisticsMap[fullDate];

                return (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <p>{displayDate}</p>

                    {Object.values(calendarMap ?? {}).map(({ type }) => (
                      <div
                        key={type.id}
                        style={{
                          top: type.config?.top,
                          right: type.config?.right,
                          bottom: type.config?.bottom,
                          left: type.config?.left,
                        }}
                        className={cn(
                          "absolute flex items-center justify-center min-w-1.5 min-h-1.5 rounded-sm z-1",
                          type.config?.color ?? "",
                        )}
                      />
                    ))}
                  </div>
                );
              },
            }}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {transactionTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-1">
              <div key={type.id} className={cn("w-3 h-1.5 rounded-sm", type.config?.color ?? "")} />
              <p className="text-xs">{type.name}</p>
              <p className="text-xs">{calendarStatisticsByTypeMap?.[type.id]?.count ?? "--"}</p>
            </div>
          ))}
        </CardFooter>
      </Card>
    );
  },
);
