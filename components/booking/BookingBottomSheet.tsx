"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import * as React from "react";
import { BookingForm, BookingFormData } from "./BookingForm";

interface BookingBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  selectedTimeslot: string | undefined;
  selectedCourtName: string | undefined;
  onBooking: (data: BookingFormData) => Promise<void>;
  isProcessing?: boolean;
}

export function BookingBottomSheet({
  isOpen,
  onOpenChange,
  selectedDate,
  selectedTimeslot,
  selectedCourtName,
  onBooking,
  isProcessing,
}: BookingBottomSheetProps) {
  const [formData, setFormData] = React.useState<BookingFormData | null>(null);
  const [isValid, setIsValid] = React.useState(false);

  const handleBookingClick = async () => {
    if (formData && isValid) {
      await onBooking(formData);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[95%] sm:max-w-md p-0 flex flex-col h-[90vh] sm:h-full rounded-t-2xl sm:rounded-l-2xl border-l border-white/20 shadow-2xl">
        <SheetHeader className="p-6 pb-2 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <SheetTitle className="font-heading text-2xl">
            Complete Your Reservation
          </SheetTitle>
          <SheetDescription>
            You are almost there! Fill in your details to secure your spot.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-0 opacity-50 shrink-0" />

        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6 min-h-0">
          <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl space-y-3 text-sm border border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Studio</span>
              <span className="font-bold text-primary text-base">
                {selectedCourtName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Date</span>
              <span className="font-medium">
                {selectedDate?.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Time</span>
              <span className="font-medium bg-white dark:bg-slate-800 px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-700">
                {selectedTimeslot}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg font-heading">Guest Details</h3>
            <BookingForm
              onFormChange={(data, valid) => {
                setFormData(data);
                setIsValid(valid);
              }}
            />

            <div className="pt-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-lg shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
                disabled={!isValid || isProcessing}
                onClick={handleBookingClick}
              >
                {isProcessing ? "Processing…" : "Confirm Booking"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                By confirming, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
