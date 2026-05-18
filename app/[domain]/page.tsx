import { tenantService } from "@/modules/tenant/tenant.service";
import { productService } from "@/modules/product/product.service";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  
  try {
    // Fetch tenant and products in parallel using PUBLIC endpoints
    const [tenantRes, productsRes] = await Promise.all([
      tenantService.getTenantBySlug(domain),
      productService.getPublicProducts(domain),
    ]);

    const tenant = tenantRes.data;
    const products = productsRes.data || [];

    if (!tenant) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-12">
        {/* Hero Banner */}
        <div 
          className="relative mb-16 h-[400px] w-full overflow-hidden rounded-[3rem] shadow-2xl border border-zinc-100"
          style={{ backgroundColor: "var(--merchant-primary)" }}
        >
          {tenant.bannerUrl ? (
            <Image
              src={tenant.bannerUrl}
              alt={tenant.name}
              fill
              className="object-cover opacity-80"
              unoptimized
            />
          ) : null}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <h1 className="text-6xl font-black tracking-tighter md:text-9xl drop-shadow-2xl">
              {tenant.name.toUpperCase()}
            </h1>
            <p className="mt-6 text-xl text-zinc-200 max-w-xl font-medium">
              {tenant.description || "Premium collections curated just for you."}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 gap-4">
            <div>
              <h2 className="text-5xl font-black tracking-tight text-zinc-950">New Arrivals</h2>
              <p className="mt-2 text-zinc-500 text-xl">Discover our latest drops and trending items.</p>
            </div>
            <div className="flex gap-4">
               <button className="text-sm font-bold uppercase tracking-widest px-6 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors">Filters</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: any) => {
              const variant = product.variants?.[0];
              const price = Number(variant?.price || 0).toLocaleString();
              
              return (
                <Link href={`/products/${product.slug}`} key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-50 transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 border border-zinc-100">
                    {product.images?.[0]?.url ? (
                      <Image 
                        src={product.images[0].url} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-300 text-center p-4">
                        <span className="text-sm font-bold tracking-tighter text-zinc-400/50 uppercase">{product.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-4 bottom-4 translate-y-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div 
                        className="w-full rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white shadow-2xl text-center"
                        style={{ backgroundColor: "var(--merchant-primary)" }}
                      >
                        Quick View
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-xl text-zinc-950 group-hover:opacity-70 transition-opacity">{product.name}</h3>
                       <p className="text-xl font-black" style={{ color: "var(--merchant-primary)" }}>৳{price}</p>
                    </div>
                    <p className="text-zinc-500 line-clamp-1 text-sm font-medium">{product.description || "High-quality lifestyle product."}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 py-32 text-center bg-zinc-50/50">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Collection is currently empty</p>
              <p className="mt-2 text-zinc-400">Check back soon for new arrivals.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Storefront error:", error);
    notFound();
  }
}
