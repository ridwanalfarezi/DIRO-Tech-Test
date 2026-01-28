import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ConfirmationPageProps {
  params: Promise<{ reservationId: string }>;
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { reservationId } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      court: true,
      user: true,
    },
  });

  if (!reservation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-white mb-6 shadow-xl animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your Pilates session has been successfully booked.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <p className="text-sm opacity-80 mb-1">Confirmation Number</p>
            <p className="text-2xl font-mono font-bold tracking-wider">
              {reservation.id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">
                  {format(new Date(reservation.date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold">
                  {reservation.startTime} - {reservation.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Studio</p>
                <p className="font-semibold">{reservation.court.name}</p>
                {reservation.court.description && (
                  <p className="text-sm text-muted-foreground">
                    {reservation.court.description}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed my-4" />

            {/* User Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{reservation.user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {reservation.user.email}
                </span>
              </div>
              {reservation.user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {reservation.user.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6">
            <Link
              href="/"
              className="block w-full text-center py-3 px-6 rounded-xl bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Book Another Session
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          A confirmation email has been sent to your email address.
        </p>

        <div className="text-center mt-4">
          <Link
            href="/bookings"
            className="text-sm text-indigo-500 hover:text-indigo-600 hover:underline transition-colors"
          >
            Check my existing bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
