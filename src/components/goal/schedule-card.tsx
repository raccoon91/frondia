import { FC } from "react";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";

interface Schedule {
  name: string;
  type: TransactionType;
  category: Category;
  currency: Currency;
  memo: string;
  amount: number;
  date: string;
  date_unit: number;
  start: string;
  end?: string;
}

interface ScheduleCardProps {
  schedule: Schedule;
}

export const ScheduleCard: FC<ScheduleCardProps> = ({ schedule }) => {
  return (
    <div className="overflow-hidden relative flex flex-col gap-2 p-4 border rounded-md bg-background shadow-sm">
      <div className="absolute top-0 right-0 py-1 px-2 rounded-bl-sm bg-indigo-300">
        <p className="text-sm">Schedule</p>
      </div>

      <p className="font-bold">{schedule.name}</p>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{schedule.type.name}</Badge>
        <Badge variant="outline">{schedule.category.name}</Badge>
        <Badge variant="outline">{schedule.memo}</Badge>
      </div>

      <div className="flex justify-between px-2">
        <div className="flex gap-2">
          <p className="text-sm">{schedule.date_unit}</p>
          <p className="text-sm">{schedule.date}</p>
        </div>

        <p className="text-sm">
          {schedule.amount} {schedule.currency.name}
        </p>
      </div>

      <div className="flex items-center justify-end gap-1 px-2 text-xs text-muted-foreground italic">
        <p>{dayjs(schedule.start).format("YYYY-MM-DD")}</p>
        <p>~</p>
        {schedule.end ? <p>{dayjs(schedule.end).add(30, "day").format("YYYY-MM-DD")}</p> : null}
      </div>
    </div>
  );
};
