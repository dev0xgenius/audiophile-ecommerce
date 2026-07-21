import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
    return (
        <div className="flex flex-col gap-6 p-6 py-2 container mx-auto max-w-[1110]" aria-busy="true" aria-label="Loading product">
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 xl:gap-32">
                <Skeleton className="w-full md:w-1/2 h-[350px] rounded-xl" />
                <div className="w-full md:w-1/2 space-y-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-24 mt-2" />
                    <Skeleton className="h-12 w-full mt-4" />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-16">
                <div className="w-full md:w-2/3 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="w-full md:w-1/3 space-y-4">
                    <Skeleton className="h-6 w-24" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-32" />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
                <Skeleton className="h-[200px] rounded-xl" />
                <Skeleton className="h-[200px] rounded-xl" />
                <Skeleton className="h-[200px] rounded-xl col-span-2" />
            </div>
        </div>
    );
}
