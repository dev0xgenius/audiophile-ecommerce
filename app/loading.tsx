import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <div className="flex flex-col gap-16" aria-busy="true" aria-label="Loading home page">
            <div className="bg-darker h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Skeleton className="h-3 w-24 mx-auto" />
                    <Skeleton className="h-10 w-72 mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                    <Skeleton className="h-12 w-40 mx-auto mt-6" />
                </div>
            </div>
            <div className="container max-w-[1110] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-gray p-6 pt-20 relative">
                        <Skeleton className="h-4 w-24 mx-auto mb-2" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                ))}
            </div>
            <div className="container max-w-[1110] mx-auto space-y-24 px-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                        <Skeleton className="w-full md:w-1/2 h-[300px] rounded-xl" />
                        <div className="w-full md:w-1/2 space-y-4">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-12 w-40 mt-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
