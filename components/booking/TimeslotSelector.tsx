"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutGroup, motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";

interface TimeslotOption {
  start: string;
  end: string;
  label: string;
  available: boolean;
  availableCourts?: { id: string; name: string }[];
}

interface TimeslotSelectorProps {
  timeslots: TimeslotOption[];
  selectedTimeslot: string | undefined;
  onTimeslotSelect: (startTime: string) => void;
  isLoading?: boolean;
}

export function TimeslotSelector({
  timeslots,
  selectedTimeslot,
  onTimeslotSelect,
  isLoading,
}: TimeslotSelectorProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="flex items-center gap-3 text-lg font-heading">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
            Select Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center gap-3 text-lg font-heading">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Clock className="h-5 w-5" />
          </div>
          Select Time Slot
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Pick an available time for your session
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <LayoutGroup>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {timeslots.map((slot) => {
              const isSelected = selectedTimeslot === slot.start;
              return (
                <motion.button
                  key={slot.start}
                  onClick={() => slot.available && onTimeslotSelect(slot.start)}
                  disabled={!slot.available}
                  className={cn(
                    "relative h-auto py-3 px-2 flex flex-col items-center gap-1 rounded-xl transition-colors duration-200 border",
                    !slot.available
                      ? "opacity-40 cursor-not-allowed bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800/50 dark:border-slate-800"
                      : "hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20 cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
                    isSelected && "border-transparent text-white z-10",
                  )}
                  whileTap={{ scale: slot.available ? 0.98 : 1 }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-slot-bg"
                      className="absolute inset-0 bg-emerald-500 rounded-xl z-[-1] shadow-lg shadow-emerald-500/25"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "font-bold text-sm",
                      isSelected
                        ? "text-white"
                        : slot.available
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-400",
                    )}
                  >
                    {slot.label}
                  </span>
                  {slot.available && slot.availableCourts && (
                    <span
                      className={cn(
                        "text-[10px] font-medium transition-colors",
                        isSelected ? "text-emerald-100" : "text-emerald-600/70",
                      )}
                    >
                      {slot.availableCourts.length} studio
                      {slot.availableCourts.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {!slot.available && (
                    <span className="text-[10px] text-slate-400/70 font-medium">
                      Full
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>
      </CardContent>
    </Card>
  );
}
