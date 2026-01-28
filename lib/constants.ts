// App Constants for Pilates Reservation

export const TIMESLOTS = [
  { start: "07:00", end: "08:00", label: "07:00 - 08:00" },
  { start: "08:00", end: "09:00", label: "08:00 - 09:00" },
  { start: "09:00", end: "10:00", label: "09:00 - 10:00" },
  { start: "10:00", end: "11:00", label: "10:00 - 11:00" },
  { start: "11:00", end: "12:00", label: "11:00 - 12:00" },
  { start: "13:00", end: "14:00", label: "13:00 - 14:00" },
  { start: "14:00", end: "15:00", label: "14:00 - 15:00" },
  { start: "15:00", end: "16:00", label: "15:00 - 16:00" },
  { start: "16:00", end: "17:00", label: "16:00 - 17:00" },
  { start: "17:00", end: "18:00", label: "17:00 - 18:00" },
  { start: "18:00", end: "19:00", label: "18:00 - 19:00" },
  { start: "19:00", end: "20:00", label: "19:00 - 20:00" },
] as const;

export type Timeslot = (typeof TIMESLOTS)[number];

export const PRICE_PER_SESSION = 100000;

export const RESERVATION_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  EXPIRED: "EXPIRED",
  FAILED: "FAILED",
} as const;

export const BOOKING_STEPS = [
  { id: 1, title: "Select Date", description: "Choose your preferred date" },
  { id: 2, title: "Select Time", description: "Pick an available time slot" },
  { id: 3, title: "Select Court", description: "Choose your Pilates court" },
  { id: 4, title: "Your Details", description: "Enter your information" },
  { id: 5, title: "Payment", description: "Complete your booking" },
] as const;

export const AMENITIES = [
  { id: "ac", label: "Air Conditioning", icon: "Wind" },
  { id: "parking", label: "Free Parking", icon: "Car" },
  { id: "shower", label: "Showers", icon: "Droplets" },
  { id: "lockers", label: "Lockers", icon: "Lock" },
  { id: "mat", label: "Yoga Mats", icon: "Layers" },
] as const;

export const MOCK_STUDIO_IMAGES = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=1000",
] as const;
