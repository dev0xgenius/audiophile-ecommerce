import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
    return (
        <div className="bg-gray py-4 px-6 md:py-12 md:px-10 h-full" aria-busy="true" aria-label="Loading checkout">
            <div className="container mx-auto max-w-[1110] flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_350px] lg:gap-8">
                <div className="bg-white rounded-xl p-6 md:p-7 xl:p-12 space-y-8">
                    <Skeleton className="h-6 w-32" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-10 rounded-lg" />
                                <Skeleton className="h-10 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl p-6 space-y-6 h-fit">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="size-16 rounded-lg" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-12 w-full mt-4" />
                </div>
            </div>
        </div>
    );
}
