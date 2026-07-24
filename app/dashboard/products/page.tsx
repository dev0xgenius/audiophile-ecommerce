"use client";

import { useCallback, useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/dashboard/product-table";
import { ProductFormDialog } from "@/components/dashboard/product-form-dialog";
import { ProductDeleteDialog } from "@/components/dashboard/product-delete-dialog";
import type {
    CreateProductInput,
    UpdateProductInput,
} from "@/lib/validations/product";

interface CategoryInfo {
    id: string;
    name: string;
    slug: string;
}

export interface ProductRow {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    brand: string | null;
    description: string | null;
    basePrice: number;
    costPrice: number | null;
    taxClass: string | null;
    weight: number | null;
    status: string;
    category: CategoryInfo | null;
    createdAt: string;
    updatedAt: string;
}

interface ProductsResponse {
    data: ProductRow[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<
        ProductRow | undefined
    >();
    const [deletingProduct, setDeletingProduct] = useState<
        ProductRow | undefined
    >();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?page=${page}&pageSize=20`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json: ProductsResponse = await res.json();
            setProducts(json.data);
            setTotalPages(json.meta.totalPages);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAdd = async (data: CreateProductInput) => {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create");
        await fetchProducts();
    };

    const handleEdit = async (data: UpdateProductInput) => {
        if (!editingProduct) return;
        const res = await fetch(`/api/products/${editingProduct.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update");
        await fetchProducts();
    };

    const handleDelete = async () => {
        if (!deletingProduct) return;
        const res = await fetch(`/api/products/${deletingProduct.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        setDeletingProduct(undefined);
        await fetchProducts();
    };

    const openAdd = () => {
        setEditingProduct(undefined);
        setFormOpen(true);
    };

    const openEdit = (product: ProductRow) => {
        setEditingProduct(product);
        setFormOpen(true);
    };

    const openDelete = (product: ProductRow) => {
        setDeletingProduct(product);
        setDeleteOpen(true);
    };

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold tracking-tight gradient-text">
                        Products
                    </h2>
                    <p className="text-sm text-secondary">
                        Manage your product catalog, stock levels, and pricing.
                    </p>
                </div>
                <Button onClick={openAdd}>
                    <IconPlus className="size-4 mr-2" />
                    Add Product
                </Button>
            </div>
            <ProductTable
                products={products}
                loading={loading}
                onEdit={openEdit}
                onDelete={openDelete}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
            <ProductFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                product={editingProduct}
                onSubmit={
                    (editingProduct ? handleEdit : handleAdd) as (
                        data: CreateProductInput | UpdateProductInput,
                    ) => Promise<void>
                }
            />
            <ProductDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                productName={deletingProduct?.name ?? ""}
                onConfirm={handleDelete}
            />
        </div>
    );
}
