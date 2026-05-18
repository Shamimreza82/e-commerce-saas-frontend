"use client";

import { useMyTenant } from "@/modules/tenant/tenant.hooks";
import { StoreSetupForm } from "@/modules/tenant/components/StoreSetupForm";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { data: tenantData, isLoading } = useMyTenant();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-zinc-50"></div>
      </div>
    );
  }

  const tenant = tenantData?.data;
  const isNewStore = !tenant?.address || !tenant?.contactEmail;

  const getStorefrontUrl = () => {
    if (typeof window === "undefined") return "";
    const hostname = window.location.hostname;
    if (hostname === "localhost") {
      return `http://${tenant.slug}.localhost:3000`;
    }
    return `https://${tenant.slug}.ecomsaas.com`;
  };

  if (isNewStore) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome to E-COM SAAS!</h1>
          <p className="mt-4 text-lg text-zinc-500">
            Let's get your store set up. This information will be used for your public storefront.
          </p>
        </div>
        <StoreSetupForm />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {tenant.name}!</p>
        </div>
        <a 
          href={getStorefrontUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2 border-zinc-200 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
            View Live Store <ArrowUpRight className="h-4 w-4" />
          </Button>
        </a>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "৳0.00", icon: DollarSign, trend: "+0%", color: "text-emerald-600" },
          { label: "Orders", value: "0", icon: ShoppingBag, trend: "+0%", color: "text-blue-600" },
          { label: "Customers", value: "0", icon: Users, trend: "+0%", color: "text-orange-600" },
          { label: "Conversion Rate", value: "0.0%", icon: ArrowUpRight, trend: "+0%", color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-600 font-medium">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-zinc-950 text-white dark:bg-zinc-900">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Your Store is Live!</CardTitle>
          <CardDescription className="text-zinc-400">
            Start adding products to see them appear on your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <a 
            href={getStorefrontUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-mono font-bold text-white transition-colors hover:bg-white/20"
          >
            {tenant.slug}.ecomsaas.com
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
