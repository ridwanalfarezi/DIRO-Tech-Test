import { AMENITIES, MOCK_STUDIO_IMAGES, TIMESLOTS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

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

export async function getAvailability(date: Date, courtId?: string | null) {
  const whereClause: {
    date: Date;
    status: { in: string[] };
    courtId?: string;
  } = {
    date: startOfDay(date),
    status: { in: ["PENDING", "CONFIRMED"] },
  };

  if (courtId) {
    whereClause.courtId = courtId;
  }

  const reservations = await prisma.reservation.findMany({
    where: whereClause,
    select: {
      startTime: true,
      courtId: true,
    },
  });

  const courts = await prisma.court.findMany();

  if (!courtId) {
    const bookedSlots = new Map<string, Set<string>>();
    reservations.forEach((r) => {
      if (!bookedSlots.has(r.courtId)) {
        bookedSlots.set(r.courtId, new Set());
      }
      bookedSlots.get(r.courtId)!.add(r.startTime);
    });

    const availability = TIMESLOTS.map((slot, index) => {
      const availableCourts = courts
        .filter((court) => {
          const courtBookedSlots = bookedSlots.get(court.id);
          return !courtBookedSlots || !courtBookedSlots.has(slot.start);
        })
        .map((c, courtIndex) => {
          const imageIndex =
            (c.name.length + index) % MOCK_STUDIO_IMAGES.length;
          const amenityCount = 2 + (c.name.length % 3);
          const sessionAmenities = AMENITIES.slice(0, amenityCount).map(
            (a) => a.id,
          );
          const slotsAvailable = 1 + ((index + courtIndex) % 5);

          return {
            id: c.id,
            name: c.name,
            description: c.description,
            imageUrl: MOCK_STUDIO_IMAGES[imageIndex],
            amenities: sessionAmenities,
            slotsAvailable: slotsAvailable,
          };
        });

      return {
        ...slot,
        available: availableCourts.length > 0,
        availableCourts: availableCourts,
      };
    });

    return { availability, courts };
  }

  const bookedSlots = new Set(reservations.map((r) => r.startTime));

  const availability = TIMESLOTS.map((slot) => ({
    ...slot,
    available: !bookedSlots.has(slot.start),
  }));

  return { availability, courts: [] };
}
