import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface AvailabilitySlot {
  start: string;
  end: string;
  label: string;
  available: boolean;
  availableCourts?: {
    id: string;
    name: string;
    description?: string | null;
    imageUrl: string;
    amenities: string[];
    slotsAvailable: number;
  }[];
}

export interface Court {
  id: string;
  name: string;
  description?: string | null;
}

export interface BookableSession {
  uniqueId: string;
  timeStart: string;
  timeEnd: string;
  timeLabel: string;
  court: Court;
  imageUrl: string;
  amenities: string[];
  slotsAvailable: number;
}

export function useSessions(
  selectedDate: Date | undefined,
  initialAvailability?: AvailabilitySlot[],
) {
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const [initialDateStr] = useState(dateStr);

  const {
    data: availability = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["availability", dateStr],
    enabled: !!selectedDate,

    initialData: dateStr === initialDateStr ? initialAvailability : undefined,
    queryFn: async () => {
      if (!dateStr) return [];
      const response = await fetch(`/api/availability?date=${dateStr}`);
      if (!response.ok) {
        throw new Error("Failed to load availability");
      }
      const data = await response.json();
      return data.availability as AvailabilitySlot[];
    },
    staleTime: 60 * 1000,
  });

  if (error) {
    toast.error("Failed to load sessions");
  }

  const allSessions = useMemo<BookableSession[]>(() => {
    const sessions: BookableSession[] = [];
    if (!availability) return [];

    availability.forEach((slot) => {
      if (slot.available && slot.availableCourts) {
        slot.availableCourts.forEach((court) => {
          sessions.push({
            uniqueId: `${slot.start}-${court.id}`,
            timeStart: slot.start,
            timeEnd: slot.end,
            timeLabel: slot.label,
            court: {
              id: court.id,
              name: court.name,
              description: court.description,
            },
            imageUrl: court.imageUrl,
            amenities: court.amenities,
            slotsAvailable: court.slotsAvailable,
          });
        });
      }
    });

    return sessions;
  }, [availability]);

  return {
    availability,
    allSessions,
    isLoading,
  };
}
