"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRICE_PER_SESSION, TIMESLOTS } from "@/lib/constants";
import { format } from "date-fns";
import { CalendarDays, Clock, CreditCard, Loader2, MapPin } from "lucide-react";

interface BookingSummaryProps {
  selectedDate: Date | undefined;
  selectedTimeslot: string | undefined;
  selectedCourtName: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  onConfirm: () => void;
  isProcessing?: boolean;
  isValid: boolean;
}

export function BookingSummary({
  selectedDate,
  selectedTimeslot,
  selectedCourtName,
  userName,
  userEmail,
  onConfirm,
  isProcessing,
  isValid,
}: BookingSummaryProps) {
  const timeslotLabel = TIMESLOTS.find(
    (t) => t.start === selectedTimeslot,
  )?.label;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white">
            <CreditCard className="h-5 w-5" />
          </div>
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
            <CalendarDays className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d, yyyy")
                  : "Not selected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Clock className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium">{timeslotLabel || "Not selected"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
            <MapPin className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Studio</p>
              <p className="font-medium">
                {selectedCourtName || "Not selected"}
              </p>
            </div>
          </div>
        </div>

        {userName && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              {userName}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {userEmail}
            </p>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Session Fee</span>
            <span className="text-xl font-bold">
              {formatPrice(PRICE_PER_SESSION)}
            </span>
          </div>

          <Button
            onClick={onConfirm}
            disabled={!isValid || isProcessing}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>Confirm Booking</>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-3">
            Your reservation will be confirmed immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
