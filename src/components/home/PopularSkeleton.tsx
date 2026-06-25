import { Skeleton } from "@/components/ui/skeleton";

export function PopularSkeletonRows() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex h-16 items-center justify-between gap-2 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full bg-foreground/10" />
            <Skeleton className="h-4 w-12 rounded bg-foreground/10" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-4 w-16 rounded bg-foreground/10" />
            <Skeleton className="h-3 w-10 rounded bg-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
