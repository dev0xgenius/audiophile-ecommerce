import assert from "node:assert/strict";
import test from "node:test";

import { rankRecommendationCandidates } from "./recommendation-ranking.ts";

function candidate({
    id,
    name,
    categoryId,
    coPurchaseOrderCount = 0,
    unitsSold = 0,
}) {
    return {
        id,
        name,
        categoryId,
        coPurchaseOrderCount,
        unitsSold,
    };
}

test("prioritizes products bought with the viewed product", () => {
    const ranked = rankRecommendationCandidates(
        [
            candidate({
                id: "same-category",
                name: "Same Category",
                categoryId: "headphones",
                unitsSold: 50,
            }),
            candidate({
                id: "co-purchased",
                name: "Co-purchased",
                categoryId: "speakers",
                coPurchaseOrderCount: 2,
            }),
        ],
        "headphones",
    );

    assert.equal(ranked[0].id, "co-purchased");
});

test("uses same-category relevance before global sales as a fallback", () => {
    const ranked = rankRecommendationCandidates(
        [
            candidate({
                id: "best-seller",
                name: "Best Seller",
                categoryId: "speakers",
                unitsSold: 100,
            }),
            candidate({
                id: "related",
                name: "Related",
                categoryId: "headphones",
                unitsSold: 1,
            }),
        ],
        "headphones",
    );

    assert.equal(ranked[0].id, "related");
});

test("breaks relevance ties by units sold and then product name", () => {
    const ranked = rankRecommendationCandidates(
        [
            candidate({
                id: "charlie",
                name: "Charlie",
                categoryId: "speakers",
                unitsSold: 5,
            }),
            candidate({
                id: "alpha",
                name: "Alpha",
                categoryId: "speakers",
                unitsSold: 5,
            }),
            candidate({
                id: "bravo",
                name: "Bravo",
                categoryId: "speakers",
                unitsSold: 10,
            }),
        ],
        "headphones",
    );

    assert.deepEqual(
        ranked.map((product) => product.id),
        ["bravo", "alpha", "charlie"],
    );
});

test("returns a limited copy without mutating the candidates", () => {
    const candidates = [
        candidate({ id: "c", name: "C", categoryId: "speakers" }),
        candidate({ id: "b", name: "B", categoryId: "speakers" }),
        candidate({ id: "a", name: "A", categoryId: "speakers" }),
    ];

    const ranked = rankRecommendationCandidates(candidates, null, 2);

    assert.deepEqual(
        ranked.map((product) => product.id),
        ["a", "b"],
    );
    assert.deepEqual(
        candidates.map((product) => product.id),
        ["c", "b", "a"],
    );
});
