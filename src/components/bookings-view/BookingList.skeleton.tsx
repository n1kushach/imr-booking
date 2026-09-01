// components/booking-card/BookingCardSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BookingListSkeleton = () => {
  return (
    <Card className="opacity-60">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2 w-full">
            {/* Title + Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Info rows */}
            <div className="flex flex-wrap gap-3">
              {/* Date */}
              <Skeleton className="h-4 w-24" />
              {/* Time */}
              <Skeleton className="h-4 w-28" />
              {/* Room */}
              <Skeleton className="h-4 w-32" />
              {/* Attendees */}
              <Skeleton className="h-4 w-36" />
            </div>

            {/* Notes (optional) */}
            <div className="space-y-1 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5 shrink-0">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingListSkeleton;
