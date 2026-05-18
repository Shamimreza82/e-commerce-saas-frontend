"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStoreSchema, TUpdateStore } from "../tenant.validation";
import { useMyTenant, useUpdateTenant } from "../tenant.hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Globe, 
  Palette, 
  Share2, 
  Search, 
  ShieldCheck,
  Store,
  Save,
  Link as LinkIcon
} from "lucide-react";
import { useEffect } from "react";

export const StoreSetupForm = () => {
  const { data: tenantData } = useMyTenant();
  const { mutate: updateStore, isPending: isUpdating } = useUpdateTenant();

  const tenant = tenantData?.data;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TUpdateStore>({
    resolver: zodResolver(updateStoreSchema),
  });

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name || "",
        description: tenant.description || "",
        logoUrl: tenant.logoUrl || "",
        bannerUrl: tenant.bannerUrl || "",
        contactEmail: tenant.contactEmail || "",
        contactPhone: tenant.contactPhone || "",
        address: tenant.address || "",
        currency: tenant.currency || "BDT",
        timezone: tenant.timezone || "Asia/Dhaka",
        customDomain: tenant.customDomain || "",
        storeSettings: {
          primaryColor: tenant.storeSettings?.primaryColor || "#000000",
          fontFamily: tenant.storeSettings?.fontFamily || "Geist Sans",
          seoTitle: tenant.storeSettings?.seoTitle || "",
          seoDescription: tenant.storeSettings?.seoDescription || "",
          socialLinks: tenant.storeSettings?.socialLinks || {},
          refundPolicy: tenant.storeSettings?.refundPolicy || "",
          privacyPolicy: tenant.storeSettings?.privacyPolicy || "",
          termsOfService: tenant.storeSettings?.termsOfService || "",
        }
      });
    }
  }, [tenant, reset]);

  const onSubmit = (data: TUpdateStore) => {
    // Clean payload: nullify empty strings for nullable fields
    const nullableFields = ["description", "logoUrl", "bannerUrl", "contactEmail", "contactPhone", "address", "customDomain"];
    
    const cleanData = (obj: any): any => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (value === "") return [key, nullableFields.includes(key) ? null : undefined];
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) return [key, cleanData(value)];
          return [key, value];
        }).filter(([_, v]) => v !== undefined)
      );
    };

    updateStore(cleanData(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <Tabs defaultValue="general" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto h-auto p-1 bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="general" className="gap-2 py-2.5"><Store className="h-4 w-4" /> Store</TabsTrigger>
            <TabsTrigger value="branding" className="gap-2 py-2.5"><Palette className="h-4 w-4" /> Branding</TabsTrigger>
            <TabsTrigger value="seo" className="gap-2 py-2.5"><Search className="h-4 w-4" /> SEO</TabsTrigger>
            <TabsTrigger value="domains" className="gap-2 py-2.5"><Globe className="h-4 w-4" /> Domain</TabsTrigger>
            <TabsTrigger value="legal" className="gap-2 py-2.5"><ShieldCheck className="h-4 w-4" /> Legal</TabsTrigger>
          </TabsList>

          <Button type="submit" disabled={isUpdating} className="h-11 px-8 gap-2 font-bold shadow-lg">
            {isUpdating ? "Saving..." : <><Save className="h-4 w-4" /> Save Settings</>}
          </Button>
        </div>

        {/* --- GENERAL INFO --- */}
        <TabsContent value="general">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea id="description" {...register("description")} rows={4} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Support Email</Label>
                  <Input id="contactEmail" {...register("contactEmail")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Input id="address" {...register("address")} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- BRANDING --- */}
        <TabsContent value="branding">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader><CardTitle>Visual Identity</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Brand Color</Label>
                  <div className="flex gap-4 items-center">
                    <Input type="color" className="h-12 w-20 p-1 rounded-lg" {...register("storeSettings.primaryColor")} />
                    <Input className="font-mono" {...register("storeSettings.primaryColor")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input {...register("logoUrl")} placeholder="https://..." />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader><CardTitle>Social Profiles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input {...register("storeSettings.socialLinks.facebook")} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input {...register("storeSettings.socialLinks.instagram")} placeholder="https://instagram.com/..." />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- SEO --- */}
        <TabsContent value="seo">
          <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 max-w-2xl mx-auto">
            <CardHeader><CardTitle>Search Engine Optimization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO Title Tag</Label>
                <Input {...register("storeSettings.seoTitle")} placeholder="The best tech store in Bangladesh" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea {...register("storeSettings.seoDescription")} rows={4} placeholder="Briefly describe your store for search results..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- DOMAINS --- */}
        <TabsContent value="domains">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>Connect your own domain to your store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Domain Name</Label>
                  <div className="flex gap-2">
                    <Input {...register("customDomain")} placeholder="www.yourbrand.com" />
                  </div>
                </div>
                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> DNS Configuration
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-500 leading-relaxed">
                    Point your domain&apos;s **A Record** to: <br/>
                    <code className="bg-white/50 px-1 rounded dark:bg-black/50">76.76.21.21</code> (Our Server IP)
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 border-dashed border-2">
              <CardHeader>
                <CardTitle className="text-zinc-400">Manage Subdomain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 mb-4">Your store is currently available at:</p>
                <code className="text-zinc-900 font-bold dark:text-zinc-50">{tenant?.slug}.ecomsaas.com</code>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- LEGAL --- */}
        <TabsContent value="legal">
          <div className="grid gap-8 md:grid-cols-3">
             <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
               <CardHeader><CardTitle>Refund Policy</CardTitle></CardHeader>
               <CardContent><Textarea {...register("storeSettings.refundPolicy")} rows={8} /></CardContent>
             </Card>
             <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
               <CardHeader><CardTitle>Privacy Policy</CardTitle></CardHeader>
               <CardContent><Textarea {...register("storeSettings.privacyPolicy")} rows={8} /></CardContent>
             </Card>
             <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
               <CardHeader><CardTitle>Terms of Service</CardTitle></CardHeader>
               <CardContent><Textarea {...register("storeSettings.termsOfService")} rows={8} /></CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};
