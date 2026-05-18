import { productService } from "@/modules/product/product.service";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;

  try {
    const response = await productService.getPublicProduct(domain, slug);
    const product = response.data;

    if (!product) {
      notFound();
    }

    const variant = product.variants?.[0];
    const inStock = variant?.inventoryLevels?.[0]?.quantity || 0;

    return (
      <div className="container mx-auto px-4 py-12 animate-in fade-in duration-700">
        <Link 
          href="/" 
          className="mb-8 flex items-center text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[3rem] bg-zinc-50 border border-zinc-100 shadow-xl">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-300 font-bold uppercase tracking-widest">
                  No Image
                </div>
              )}
            </div>
            
            {/* Thumbnail Placeholders */}
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 opacity-50"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="space-y-4">
              {product.category && (
                <span 
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                  style={{ backgroundColor: "var(--merchant-primary)" }}
                >
                  {product.category.name}
                </span>
              )}
              <h1 className="text-6xl font-black tracking-tighter text-zinc-950 leading-none">
                {product.name}
              </h1>
              <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest">SKU: {variant?.sku}</p>
            </div>

            <div className="mt-10 flex items-baseline gap-6 border-b border-zinc-100 pb-10">
              <span className="text-5xl font-black text-zinc-950" style={{ color: "var(--merchant-primary)" }}>
                ৳{Number(variant?.price || 0).toLocaleString()}
              </span>
              {variant?.compareAtPrice && (
                <span className="text-2xl text-zinc-300 line-through decoration-zinc-200">
                  ৳{Number(variant.compareAtPrice).toLocaleString()}
                </span>
              )}
            </div>

            <div className="mt-10 space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Description</h4>
                <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed text-lg">
                  {product.description || "Crafted with excellence, this item represents our commitment to quality and modern style."}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Stock Status</h4>
                  <span className={`text-sm font-bold uppercase tracking-tighter ${inStock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {inStock > 0 ? `${inStock} Units Available` : "Temporarily Out of Stock"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1 h-16 rounded-[1.5rem] text-white hover:opacity-90 text-lg font-black uppercase tracking-widest shadow-2xl transition-transform active:scale-95 gap-3"
                    style={{ backgroundColor: "var(--merchant-primary)" }}
                    disabled={inStock <= 0}
                  >
                    <ShoppingBag className="h-5 w-5" /> Add to Cart
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-16 w-16 rounded-[1.5rem] border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-100 transition-colors"
                  >
                    ♡
                  </Button>
                </div>
              </div>

              {/* Trust Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
                <div className="flex items-center gap-4 rounded-3xl bg-zinc-50 p-6 border border-zinc-100">
                   <div className="p-3 bg-white rounded-2xl shadow-sm"><Truck className="h-5 w-5 text-zinc-400" /></div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Shipping</p>
                      <p className="text-sm font-bold text-zinc-950">Free nationwide</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 rounded-3xl bg-zinc-50 p-6 border border-zinc-100">
                   <div className="p-3 bg-white rounded-2xl shadow-sm"><ShieldCheck className="h-5 w-5 text-zinc-400" /></div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Authentic</p>
                      <p className="text-sm font-bold text-zinc-950">100% Guaranteed</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Product detail error:", error);
    notFound();
  }
}
