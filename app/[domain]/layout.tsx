import { tenantService } from "@/modules/tenant/tenant.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

// Dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  try {
    const response = await tenantService.getTenantBySlug(domain);
    const tenant = response.data;
    const settings = tenant?.storeSettings;

    return {
      title: settings?.seoTitle || tenant?.name || "E-COM Store",
      description: settings?.seoDescription || tenant?.description || "Welcome to our store",
      openGraph: {
        title: settings?.seoTitle || tenant?.name,
        description: settings?.seoDescription || tenant?.description,
        images: tenant?.logoUrl ? [tenant.logoUrl] : [],
      },
    };
  } catch {
    return { title: "Store Not Found" };
  }
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  try {
    const response = await tenantService.getTenantBySlug(domain);
    const tenant = response.data;

    if (!tenant) {
      notFound();
    }

    const settings = tenant.storeSettings;
    const primaryColor = settings?.primaryColor || "#000000";

    return (
      <div 
        className="min-h-screen bg-white text-zinc-900"
        style={{ 
          // Inject merchant's primary color as a CSS variable
          "--merchant-primary": primaryColor,
        } as React.CSSProperties}
      >
        {/* Simple Store Header */}
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 py-6">
          <div className="container mx-auto flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              {tenant.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenant.logoUrl} alt={tenant.name} className="h-8 w-auto object-contain" />
              )}
              <div className="text-2xl font-black tracking-tighter" style={{ color: "var(--merchant-primary)" }}>
                {tenant.name.toUpperCase()}
              </div>
            </div>
            
            <nav className="hidden space-x-8 md:flex font-bold text-sm uppercase tracking-widest text-zinc-500">
              <span className="cursor-pointer hover:text-zinc-950 transition-colors">Shop</span>
              <span className="cursor-pointer hover:text-zinc-950 transition-colors">Collections</span>
              <Link href="http://localhost:3000/login" className="hover:text-zinc-950 transition-colors">Merchant Login</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button 
                className="rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: "var(--merchant-primary)" }}
              >
                Cart (0)
              </button>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Simple Store Footer */}
        <footer className="mt-40 border-t py-20 bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-black tracking-tighter mb-6 uppercase" style={{ color: "var(--merchant-primary)" }}>
                {tenant.name}
              </h3>
              <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                {tenant.description || "Building the future of commerce in Bangladesh."}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Legal</h4>
              {settings?.refundPolicy && <span className="text-sm font-bold cursor-pointer hover:underline">Refund Policy</span>}
              {settings?.privacyPolicy && <span className="text-sm font-bold cursor-pointer hover:underline">Privacy Policy</span>}
              {settings?.termsOfService && <span className="text-sm font-bold cursor-pointer hover:underline">Terms of Service</span>}
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Connect</h4>
              <div className="flex gap-4">
                {settings?.socialLinks?.facebook && (
                   <a href={settings.socialLinks.facebook} target="_blank" className="font-bold hover:underline">Facebook</a>
                )}
                {settings?.socialLinks?.instagram && (
                   <a href={settings.socialLinks.instagram} target="_blank" className="font-bold hover:underline">Instagram</a>
                )}
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-20 pt-8 border-t border-zinc-200 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <p>© {new Date().getFullYear()} {tenant.name}. Powered by E-COM SAAS.</p>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch tenant:", error);
    notFound();
  }
}
