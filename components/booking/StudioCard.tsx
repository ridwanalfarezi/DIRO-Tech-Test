"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Car,
  Droplets,
  Layers,
  Lock,
  LucideIcon,
  MapPin,
  Star,
  Wind,
} from "lucide-react";
import Image from "next/image";

interface StudioCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string;
  amenities?: string[];
  slotsAvailable: number;
  price?: number;
  isSelected?: boolean;
  onSelect: () => void;
  priority?: boolean;
}

const AMENITY_ICONS: Record<string, LucideIcon> = {
  ac: Wind,
  parking: Car,
  shower: Droplets,
  lockers: Lock,
  mat: Layers,
};

export function StudioCard({
  name,
  description,
  imageUrl,
  amenities = ["ac", "mat"],
  slotsAvailable,
  price,
  isSelected,
  onSelect,
  priority = false,
}: StudioCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left transition-all duration-500 rounded-2xl relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        isSelected
          ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 scale-[1.02]"
          : "hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10",
      )}
    >
      <div className="h-full overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm transition-colors dark:border-white/10">
        <div className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent z-10 transition-opacity duration-300 group-hover:from-slate-900/60" />
          <Image
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1000"
            }
            alt={name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute bottom-4 left-4 z-20 text-white">
            <h3 className="text-2xl font-bold font-heading mb-0.5 tracking-tight">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-200">
              <MapPin className="h-3.5 w-3.5 text-indigo-400" />
              <span>Premium Studio</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-20">
            <Badge
              className={cn(
                "font-semibold backdrop-blur-md border-white/20 px-3 py-1 text-xs uppercase tracking-wider shadow-lg",
                slotsAvailable > 3
                  ? "bg-emerald-500/80 text-white hover:bg-emerald-500"
                  : "bg-amber-500/80 text-white hover:bg-amber-500",
              )}
            >
              {slotsAvailable} spots left
            </Badge>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description ||
                "Experience tranquility and strength in our state-of-the-art studio equipped with premium reformers."}
            </p>

            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity] || Star;
                return (
                  <div
                    key={amenity}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-800/50"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="capitalize">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: 3,
                }).format(price || 150000)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                /session
              </span>
            </div>
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 h-10 px-6",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-indigo-500/25"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              {isSelected ? "Selected" : "Book Now"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
