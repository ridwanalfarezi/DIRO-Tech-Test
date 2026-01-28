"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays, isBefore, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function DateSelector({
  selectedDate,
  onDateSelect,
}: DateSelectorProps) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  return (
    <Card className="border-0 shadow-xl bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 text-white">
            <CalendarDays className="h-5 w-5" />
          </div>
          Select Your Date
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a date for your Pilates session
        </p>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={(date) => isBefore(date, today) || isBefore(maxDate, date)}
          className="rounded-xl border shadow-sm"
          classNames={{
            day_selected:
              "bg-linear-to-br from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700",
            day_today: "bg-accent text-accent-foreground font-bold",
          }}
        />
      </CardContent>
    </Card>
  );
}
