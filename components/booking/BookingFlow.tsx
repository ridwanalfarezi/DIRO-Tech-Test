"use client";

import { createBooking } from "@/actions/booking";
import { SessionsFeed } from "@/components/booking/SessionsFeed";
import { AvailabilitySlot, useSessions } from "@/hooks/useSessions";
import { TIMESLOTS } from "@/lib/constants";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BookingBottomSheet } from "./BookingBottomSheet";
import { BookingFormData } from "./BookingForm";
import { DateSelector } from "./DateSelector";
import { TimeslotSelector } from "./TimeslotSelector";

interface Court {
  id: string;
  name: string;
  description?: string | null;
}

interface BookableSession {
  uniqueId: string;
  timeStart: string;
  timeEnd: string;
  timeLabel: string;
  court: Court;
  imageUrl: string;
  amenities: string[];
  slotsAvailable: number;
}

interface BookingFlowProps {
  initialAvailability?: AvailabilitySlot[];
}

export function BookingFlow({ initialAvailability }: BookingFlowProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTimeslot, setSelectedTimeslot] = useState<
    string | undefined
  >();

  const [selectedSession, setSelectedSession] =
    useState<BookableSession | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { availability, allSessions, isLoading } = useSessions(
    selectedDate,
    initialAvailability,
  );

  const filteredSessions = useMemo(() => {
    if (!selectedTimeslot) return allSessions;
    return allSessions.filter((s) => s.timeStart === selectedTimeslot);
  }, [allSessions, selectedTimeslot]);

  const handleSessionSelect = (session: BookableSession) => {
    setSelectedSession(session);
    setIsSheetOpen(true);
  };

  const handleBooking = async (data: BookingFormData) => {
    if (!selectedDate || !selectedSession) {
      toast.error("Missing booking details");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSession.timeStart,
        endTime: selectedSession.timeEnd,
        courtId: selectedSession.court.id,
        userName: data.name,
        userEmail: data.email,
        userPhone: data.phone,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.reservationId) {
        // Direct redirect to confirmation
        router.push(`/confirmation/${result.reservationId}`);
      } else {
        throw new Error("No reservation ID received");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error instanceof Error ? error.message : "Booking failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b pb-12 pt-16 px-4 mb-8">
        {/* Abstract Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400 blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-heading bg-linear-to-r from-indigo-600 via-primary to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
              Find Your Flow
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
              Discover premium Pilates studios. Immerse yourself in a space
              designed for balance, strength, and tranquility.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="flex items-center gap-2 font-semibold text-lg text-slate-800 dark:text-slate-100">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </div>

            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            <TimeslotSelector
              timeslots={
                availability.length > 0
                  ? availability
                  : TIMESLOTS.map((t) => ({ ...t, available: false }))
              }
              selectedTimeslot={selectedTimeslot}
              onTimeslotSelect={(time) =>
                setSelectedTimeslot(
                  selectedTimeslot === time ? undefined : time,
                )
              }
              isLoading={isLoading}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                Pro Tip
              </h4>
              <p className="text-sm text-blue-700/80 dark:text-blue-400/80">
                Tap a date to see all available studios. Filter by time if you
                have a tight schedule.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <SessionsFeed
            isLoading={isLoading}
            sessions={filteredSessions}
            onSessionSelect={handleSessionSelect}
            selectedDate={selectedDate}
            onClearFilters={() => setSelectedTimeslot(undefined)}
            hasActiveFilters={!!selectedTimeslot}
          />
        </div>
      </div>

      <BookingBottomSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedDate={selectedDate}
        selectedTimeslot={
          selectedSession?.timeStart && selectedSession?.timeEnd
            ? `${selectedSession.timeStart} - ${selectedSession.timeEnd}`
            : undefined
        }
        selectedCourtName={selectedSession?.court.name}
        onBooking={handleBooking}
        isProcessing={isSubmitting}
      />
    </div>
  );
}
