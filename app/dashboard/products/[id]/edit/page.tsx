"use client";

import { ProductForm } from "@/modules/product/components/ProductForm";
import { useProduct } from "@/modules/product/product.hooks";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: productData, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-950 border-t-transparent"></div>
      </div>
    );
  }

  const product = productData?.data;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link href="/dashboard/products" className="text-zinc-500 underline mt-4 inline-block">
          Go back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link 
            href="/dashboard/products" 
            className="flex items-center text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 mb-2 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Edit Product</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Update your product listing and inventory.</p>
        </div>
      </div>

      <ProductForm productId={id} initialData={product} />
    </div>
  );
}
