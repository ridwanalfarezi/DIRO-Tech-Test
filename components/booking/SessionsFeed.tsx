"use client";

import { StudioCard } from "@/components/booking/StudioCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookableSession } from "@/hooks/useSessions";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter } from "lucide-react";

interface SessionsFeedProps {
  isLoading: boolean;
  sessions: BookableSession[];
  onSessionSelect: (session: BookableSession) => void;
  selectedDate: Date | undefined;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

import { Badge } from "@/components/ui/badge";

const SessionsHeader = ({
  count,
  hasActiveFilters,
  onClearFilters,
}: {
  count: number;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      Available Sessions
      <Badge variant="secondary" className="rounded-full">
        {count}
      </Badge>
    </h2>
    {hasActiveFilters && onClearFilters && (
      <Button variant="ghost" size="sm" onClick={onClearFilters}>
        Clear Time Filter
      </Button>
    )}
  </div>
);

export function SessionsFeed({
  // ... (rest of function signature)
  isLoading,
  sessions,
  onSessionSelect,
  selectedDate,
  onClearFilters,
  hasActiveFilters,
}: SessionsFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <SessionsHeader
          count={0}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="space-y-4">
        <SessionsHeader
          count={0}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Sessions Found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find any open slots for this specific time. Try
            clearing your time filter or checking another date.
          </p>
          {hasActiveFilters && onClearFilters && (
            <Button variant="outline" className="mt-6" onClick={onClearFilters}>
              Show All Times
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SessionsHeader
        count={sessions.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {sessions.map((session, index) => (
          <div key={session.uniqueId} className="relative group/card-wrapper">
            <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/10 shadow-sm pointer-events-none">
              <CalendarIcon className="w-3 h-3" />
              {format(selectedDate || new Date(), "MMM d")}
              <span className="mx-1 opacity-50">|</span>
              {session.timeStart}
            </div>

            <StudioCard
              id={session.court.id}
              name={session.court.name}
              description={session.court.description}
              imageUrl={session.imageUrl}
              amenities={session.amenities}
              slotsAvailable={session.slotsAvailable}
              price={100000}
              onSelect={() => onSessionSelect(session)}
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
