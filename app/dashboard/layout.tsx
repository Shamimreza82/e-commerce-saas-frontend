"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut,
  ShoppingBag,
  Bell,
  Search,
  Layers,
  Tag,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout, useUser } from "@/modules/auth/auth.hooks";
import { useMyTenant } from "@/modules/tenant/tenant.hooks";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Layers,
  },
  {
    title: "Brands",
    href: "/dashboard/brands",
    icon: Tag,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();
  const { data: userData, isLoading: isUserLoading, error: userError } = useUser();
  const { data: tenantData, isLoading: isTenantLoading, error: tenantError } = useMyTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const user = userData?.data;
  const tenant = tenantData?.data;

  const getStorefrontUrl = () => {
    if (typeof window === "undefined" || !tenant) return "";
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    if (hostname === "localhost") {
      return `${protocol}//${tenant.slug}.localhost:3000`;
    }
    return `https://${tenant.slug}.ecomsaas.com`;
  };

  if (isUserLoading || isTenantLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black font-sans">
        <div className="flex flex-col items-center gap-4">
           <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-950 border-t-transparent"></div>
           <p className="text-sm font-bold animate-pulse text-zinc-500 uppercase tracking-widest">Initialising Session...</p>
        </div>
      </div>
    );
  }

  if (userError || tenantError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center dark:bg-black font-sans">
        <div className="max-w-md space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/20">
             <Settings className="h-10 w-10 animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Something went wrong</h2>
          <p className="text-zinc-500 leading-relaxed">
            We couldn&apos;t load your dashboard data. This might be due to a connection issue or an expired session.
          </p>
          <div className="flex gap-4 justify-center">
             <Button onClick={() => window.location.reload()} className="h-12 px-8 font-bold rounded-xl shadow-lg">
                Try Again
             </Button>
             <Button variant="outline" onClick={() => logout()} className="h-12 px-8 font-bold rounded-xl">
                Logout
             </Button>
          </div>
        </div>
      </div>
    );
  }

  const NavContent = (onItemClick?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="mb-10 flex items-center px-4 mt-2">
        <span className="text-2xl font-black tracking-tighter">
          E-COM<span className="text-zinc-500">SAAS</span>
        </span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center rounded-xl px-4 py-3.5 text-sm font-bold transition-all",
                isActive 
                  ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/20 dark:bg-zinc-50 dark:text-zinc-950" 
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "animate-pulse" : "")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <a 
          href={getStorefrontUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <ExternalLink className="h-5 w-5" />
          View Store
        </a>
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-zinc-500 font-bold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
          onClick={() => logout()}
          disabled={isPending}
        >
          <LogOut className="mr-3 h-5 w-5" />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-black font-sans">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-white/50 backdrop-blur-xl lg:block dark:bg-zinc-900/50 dark:border-zinc-800">
        <div className="flex h-full flex-col px-4 py-6">
          {NavContent()}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 md:px-8 dark:bg-black/80 dark:border-zinc-800">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="lg:hidden h-11 w-11 flex items-center justify-center rounded-xl border border-zinc-100 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Menu className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6">
                <SheetHeader className="text-left mb-4">
                   <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                {NavContent(() => setIsMobileMenuOpen(false))}
              </SheetContent>
            </Sheet>
            
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search analytics, products..." 
                className="h-12 w-full rounded-2xl bg-zinc-100/50 border-transparent border transition-all focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-zinc-950/5 pl-11 pr-4 text-sm font-medium dark:bg-zinc-900 dark:focus:bg-zinc-950 dark:focus:border-zinc-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800">
              <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 ring-4 ring-white dark:ring-black"></span>
            </Button>
            
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-zinc-100 dark:border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 leading-tight">
                  {user?.name || user?.email?.split('@')[0]}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              
              <div className="h-11 w-11 overflow-hidden rounded-2xl ring-2 ring-zinc-100 dark:ring-zinc-800 transition-transform active:scale-95 cursor-pointer">
                {user?.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt="Profile" 
                    width={44} 
                    height={44} 
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-sm font-black text-white dark:bg-zinc-50 dark:text-zinc-950">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
