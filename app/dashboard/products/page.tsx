"use client";

import { useProducts, useDeleteProduct } from "@/modules/product/product.hooks";
import { useMyTenant } from "@/modules/tenant/tenant.hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Package, 
  MoreHorizontal, 
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const { data: productsData, isLoading } = useProducts();
  const { data: tenantData } = useMyTenant();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  
  const products = productsData?.data || [];
  const tenant = tenantData?.data;

  const getStorefrontUrl = (productSlug: string) => {
    if (typeof window === "undefined") return "";
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    let baseUrl = "";
    if (hostname === "localhost") {
      baseUrl = `${protocol}//${tenant?.slug}.localhost:3000`;
    } else {
      baseUrl = `https://${tenant?.slug}.ecomsaas.com`;
    }

    return `${baseUrl}/products/${productSlug}`;
  };

  const handleDelete = (id: string, name: string) => {
    toast(`Delete "${name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => deleteProduct(id),
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-zinc-500">Manage and track your store inventory.</p>
        </div>
        <Link href="/dashboard/products/create">
          <Button className="gap-2 px-6">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Filters/Search Placeholder */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="h-10 w-full rounded-lg bg-zinc-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:bg-zinc-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Products Table/Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 4].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-zinc-100 animate-pulse dark:bg-zinc-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800">
          <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800 mb-6">
            <Package className="h-12 w-12 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold">No products found</h3>
          <p className="mt-2 text-zinc-500 max-w-sm">
            You haven&apos;t added any products to your store yet. Start by creating your first listing.
          </p>
          <Link href="/dashboard/products/create" className="mt-8">
            <Button variant="outline">Create Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-sm font-semibold text-zinc-500 dark:bg-zinc-800/50 dark:border-zinc-800">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200 dark:bg-zinc-800">
                        {product.images?.[0]?.url ? (
                          <Image 
                            src={product.images[0].url} 
                            alt={product.name} 
                            width={48} 
                            height={48} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                           <div className="flex h-full w-full items-center justify-center text-zinc-300">
                              <Package className="h-6 w-6" />
                           </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-zinc-50">{product.name}</p>
                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-tighter">SKU: {product.variants?.[0]?.sku || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      product.status === "PUBLISHED" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{product.variants?.[0]?.inventoryLevels?.[0]?.quantity || 0} in stock</p>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    ৳{Number(product.variants?.[0]?.price || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => window.open(getStorefrontUrl(product.slug), "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" /> View on Store
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
