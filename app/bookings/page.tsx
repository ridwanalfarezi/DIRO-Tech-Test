"use client";

import { BookingResult, getBookings } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function BookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<BookingResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      const result = await getBookings(email);
      if (result.error) {
        toast.error(result.error);
        setBookings([]);
      } else {
        setBookings(result.bookings || []);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-8 pt-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-heading bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Enter your email to find your reservations
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Find Bookings"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <AnimatePresence>
            {bookings && bookings.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground py-8"
              >
                No bookings found for this email.
              </motion.div>
            )}

            {bookings && bookings.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="font-semibold text-lg px-1">
                  Your Reservations
                </h2>
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-4 border shadow-xs flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-600 font-medium">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(booking.date), "EEE, MMM d, yyyy")}
                      </div>
                      <div className="text-sm font-medium">
                        {booking.courtName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.startTime}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        {booking.status}
                      </div>
                      <Link
                        href={`/confirmation/${booking.id}`}
                        className="text-xs text-indigo-500 hover:underline block pt-1"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
