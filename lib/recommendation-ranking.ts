export interface RecommendationCandidate {
    id: string;
    name: string;
    categoryId: string | null;
    coPurchaseOrderCount: number;
    unitsSold: number;
}

export function rankRecommendationCandidates<
    T extends RecommendationCandidate,
>(
    candidates: T[],
    currentCategoryId: string | null,
    limit = 3,
): T[] {
    return [...candidates]
        .sort((a, b) => {
            const coPurchaseDifference =
                b.coPurchaseOrderCount - a.coPurchaseOrderCount;
            if (coPurchaseDifference !== 0) return coPurchaseDifference;

            const aMatchesCategory =
                currentCategoryId !== null &&
                a.categoryId === currentCategoryId;
            const bMatchesCategory =
                currentCategoryId !== null &&
                b.categoryId === currentCategoryId;
            if (aMatchesCategory !== bMatchesCategory) {
                return aMatchesCategory ? -1 : 1;
            }

            const salesDifference = b.unitsSold - a.unitsSold;
            if (salesDifference !== 0) return salesDifference;

            const nameDifference = a.name.localeCompare(b.name);
            if (nameDifference !== 0) return nameDifference;

            return a.id.localeCompare(b.id);
        })
        .slice(0, Math.max(0, limit));
}
