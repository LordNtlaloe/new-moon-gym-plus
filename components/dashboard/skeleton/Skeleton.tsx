import { Skeleton } from "@/components/ui/skeleton"

export default function MembersTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Table Header Skeleton */}
            <div className="grid grid-cols-5 gap-4 px-2 py-1">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
            </div>

            {/* Table Rows Skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="grid grid-cols-5 gap-4 px-2 py-2 border-b border-muted"
                >
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-20" />
                </div>
            ))}
        </div>
    )
}
