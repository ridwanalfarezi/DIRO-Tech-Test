"use server";

import { prisma } from "@/lib/prisma";

export interface BookingResult {
  id: string;
  date: Date;
  startTime: string;
  courtName: string;
  status: string;
}

export async function getBookings(
  email: string,
): Promise<{ bookings?: BookingResult[]; error?: string }> {
  try {
    if (!email) {
      return { error: "Email is required" };
    }

    const bookings = await prisma.reservation.findMany({
      where: {
        user: {
          email: email,
        },
      },
      include: {
        court: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return {
      bookings: bookings.map((b) => ({
        id: b.id,
        date: b.date,
        startTime: b.startTime,
        courtName: b.court.name,
        status: b.status,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return { error: "Failed to fetch bookings" };
  }
}

export interface CreateBookingState {
  error?: string;
  reservationId?: string;
}

export interface CreateBookingPayload {
  reservationId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  courtId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingState> {
  try {
    let reservation;
    let user;

    if (payload.reservationId) {
      reservation = await prisma.reservation.findUnique({
        where: { id: payload.reservationId },
        include: { user: true },
      });

      if (!reservation) {
        return { error: "Reservation not found" };
      }

      user = reservation.user;

      if (reservation.status !== "CONFIRMED") {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: "CONFIRMED" },
        });
      }

      return {
        reservationId: reservation.id,
      };
    } else {
      const {
        date,
        startTime,
        endTime,
        courtId,
        userName,
        userEmail,
        userPhone,
      } = payload;

      if (
        !date ||
        !startTime ||
        !endTime ||
        !courtId ||
        !userName ||
        !userEmail
      ) {
        return { error: "Missing required fields" };
      }

      const { startOfDay } = await import("date-fns");
      const reservationDate = startOfDay(new Date(date));

      const existingReservation = await prisma.reservation.findFirst({
        where: {
          date: reservationDate,
          startTime,
          courtId,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      });

      if (existingReservation) {
        return { error: "This time slot is no longer available" };
      }

      user = await prisma.user.upsert({
        where: { email: userEmail },
        update: { name: userName, phone: userPhone },
        create: { name: userName, email: userEmail, phone: userPhone },
      });

      reservation = await prisma.reservation.create({
        data: {
          date: reservationDate,
          startTime,
          endTime,
          courtId,
          userId: user.id,
          status: "CONFIRMED",
        },
        include: { court: true },
      });
    }

    return {
      reservationId: reservation.id,
    };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}
