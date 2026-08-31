import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CRoomSkeleton = () => {
  return (
    <Card className="h-100 overflow-hidden pt-0! gap-0!">
      <div className="relative h-50 shrink-0 overflow-hidden bg-muted">
        <Skeleton className="w-full h-full rounded-none" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      <CardContent className="h-50 pt-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="border-t border-border pt-2">
            <Skeleton className="h-4 w-28" />
          </div>

          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CRoomSkeleton;
