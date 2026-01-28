"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Loader2, MapPin } from "lucide-react";

interface Court {
  id: string;
  name: string;
  description?: string | null;
}

interface CourtSelectorProps {
  courts: Court[];
  selectedCourtId: string | undefined;
  onCourtSelect: (courtId: string) => void;
  isLoading?: boolean;
}

export function CourtSelector({
  courts,
  selectedCourtId,
  onCourtSelect,
  isLoading,
}: CourtSelectorProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            Select Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (courts.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            Select Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          No studios available for this time slot
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
            <MapPin className="h-5 w-5" />
          </div>
          Select Studio
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your preferred Pilates studio
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courts.map((court) => (
            <button
              key={court.id}
              onClick={() => onCourtSelect(court.id)}
              className={cn(
                "relative p-5 rounded-xl border-2 text-left transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02]",
                selectedCourtId === court.id
                  ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 shadow-lg"
                  : "border-border hover:border-orange-300 bg-white dark:bg-slate-900",
              )}
            >
              {selectedCourtId === court.id && (
                <div className="absolute top-3 right-3 p-1 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-1">{court.name}</h3>
              {court.description && (
                <p className="text-sm text-muted-foreground">
                  {court.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
