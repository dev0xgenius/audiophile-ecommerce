import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div aria-busy="true" aria-label="Loading category">
            <div className="bg-darker py-8 md:py-16 flex justify-center">
                <Skeleton className="h-8 w-48" />
            </div>
            <div className="container max-w-[1110] mx-auto flex flex-col gap-16 py-16 md:gap-[120] md:py-[120] xl:gap-40 xl:py-40 px-6">
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
