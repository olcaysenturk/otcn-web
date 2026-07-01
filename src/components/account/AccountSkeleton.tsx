import { Skeleton } from "@/components/ui/skeleton";

export function AccountRowSkeleton() {
    return (
        <div className="flex flex-col gap-2 border-b border-white/10 py-5 last:border-b-0 lg:grid lg:grid-cols-[240px_1fr] lg:gap-0 lg:items-center">
            <Skeleton className="h-4 w-24 lg:w-32 bg-white/10" />
            <Skeleton className="h-4 w-48 lg:w-1/2 bg-white/10" />
        </div>
    );
}

export function AccountProfileSkeleton() {
    return (
        <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
                <AccountRowSkeleton key={i} />
            ))}
        </div>
    );
}

export function AccountSecuritySkeleton() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <Skeleton className="h-7 w-40 bg-white/10" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
                    <Skeleton className="h-5 w-16 bg-white/10" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32 bg-white/10" />
                        <Skeleton className="h-4 w-full max-w-md bg-white/10" />
                    </div>
                    <Skeleton className="h-11 w-32 rounded-full bg-white/10" />
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/10">
                <Skeleton className="h-7 w-40 bg-white/10" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-12">
                            <Skeleton className="h-5 w-40 bg-white/10" />
                            <Skeleton className="h-4 flex-1 max-w-lg bg-white/10" />
                            <Skeleton className="h-6 w-11 rounded-full bg-white/10" />
                        </div>
                        {i < 2 && <div className="h-px bg-white/10 w-full" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AccountTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-10 w-48 bg-white/10" />
                <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
            </div>
            <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-white/5 p-4 border-b border-white/10 flex gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-4 flex-1 bg-white/10" />
                    ))}
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border-b border-white/10 last:border-0 flex gap-4">
                        {[...Array(4)].map((_, j) => (
                            <Skeleton key={j} className="h-4 flex-1 bg-white/10" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
