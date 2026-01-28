import { BookingFlow } from "@/components/booking/BookingFlow";
import { Toaster } from "@/components/ui/sonner";
import { getAvailability } from "@/lib/availability";

export default async function Home() {
  const today = new Date();
  const { availability } = await getAvailability(today);

  return (
    <main>
      <BookingFlow initialAvailability={availability} />
      <Toaster richColors position="top-center" />
    </main>
  );
}
