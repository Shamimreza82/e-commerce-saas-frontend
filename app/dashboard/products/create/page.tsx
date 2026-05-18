import { ProductForm } from "@/modules/product/components/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateProductPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link 
            href="/dashboard/products" 
            className="flex items-center text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 mb-2 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Create New Product</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Add a new item to your store's inventory.</p>
        </div>
      </div>

      {/* Main Form */}
      <ProductForm />
    </div>
  );
}
